from datetime import datetime
from uuid import UUID
from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from sqlalchemy import select

from app.utils.dependencies import DBSession, CurrentUser
from app.schemas.assessment import (
    AssessmentStartRequest,
    AssessmentStartResponse,
    AssessmentResumeResponse,
    AnswerSubmit,
    AnswerResponse,
    AnswerResult,
    QuestionForTest,
    HintRequest,
    HintResponse,
    AssessmentResults,
    AssessmentResultsResponse,
    TopicResultDetail,
)
from app.models import (
    AssessmentSession,
    Question,
    UserQuestionHistory,
    UserSkillLevel,
    UserProfile,
)
from app.services.assessment_service import (
    get_skill_by_slug,
    get_active_assessment,
    get_assessment_session,
    select_assessment_questions,
    update_topic_mastery_from_answer,
    calculate_question_xp,
    determine_level_from_score,
)


router = APIRouter(prefix="/assessment", tags=["Assessment"])


# === HELPERS ===

def question_to_response(question: Question, number: int = 1) -> QuestionForTest:
    """Convertit une Question en schema pour le client."""
    return QuestionForTest(
        id=question.id,
        type=question.type.value,
        difficulty=question.difficulty.value,
        question_text=question.question_text,
        code_snippet=question.code_snippet,
        code_language=question.code_language,
        options=question.options,
        has_hints=bool(question.hints),
        hints_count=len(question.hints) if question.hints else 0,
        time_limit_seconds=120
    )


# === ENDPOINTS ===

@router.post("/start", response_model=AssessmentStartResponse | AssessmentResumeResponse)
async def start_assessment(
    data: AssessmentStartRequest,
    current_user: CurrentUser,
    db: DBSession
):
    """
    Démarre un assessment ou reprend un assessment en cours.
    """
    
    # 1. Vérifier le skill
    skill = await get_skill_by_slug(data.skill_slug, db)
    
    # 2. Vérifier si assessment en cours
    existing = await get_active_assessment(current_user.id, skill.id, db)
    
    if existing:
        # === REPRENDRE L'ASSESSMENT ===
        current_question_id = existing.get_current_question_id()
        
        if not current_question_id:
            # Toutes les questions répondues, forcer la complétion
            return await complete_assessment(existing.id, current_user, db)
        
        current_question = await db.get(Question, current_question_id)
        
        return AssessmentResumeResponse(
            session_id=existing.id,
            skill_slug=skill.slug,
            skill_name=skill.name,
            total_questions=existing.total_questions,
            current_index=existing.current_index,
            correct_so_far=existing.correct_answers,
            time_remaining_seconds=existing.time_remaining_seconds,
            current_question=question_to_response(current_question),
            message=f"Assessment en cours repris - Question {existing.current_index + 1}/{existing.total_questions}"
        )
    
    # 3. Vérifier inscription au skill
    stmt = select(UserSkillLevel).where(
        UserSkillLevel.user_id == current_user.id,
        UserSkillLevel.skill_id == skill.id
    )
    result = await db.execute(stmt)
    user_skill = result.scalar_one_or_none()
    
    if not user_skill:
        raise HTTPException(403, "Tu dois d'abord t'inscrire à ce skill")
    
    # 4. Sélectionner les questions
    questions = await select_assessment_questions(
        current_user.id,
        skill.id,
        data.question_count,
        db
    )
    
    if len(questions) < data.question_count:
        raise HTTPException(
            400, 
            f"Pas assez de questions disponibles ({len(questions)}/{data.question_count})"
        )
    
    # 5. Créer la session
    session = AssessmentSession(
        user_id=current_user.id,
        skill_id=skill.id,
        status="in_progress",
        question_ids=[str(q.id) for q in questions],
        total_questions=len(questions),
        time_limit_minutes=30
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    
    # 6. Retourner la première question
    first_question = questions[0]
    
    return AssessmentStartResponse(
        session_id=session.id,
        skill_slug=skill.slug,
        skill_name=skill.name,
        total_questions=len(questions),
        time_limit_minutes=30,
        time_remaining_seconds=30 * 60,
        first_question=question_to_response(first_question)
    )


@router.post("/{session_id}/answer", response_model=AnswerResponse)
async def submit_answer(
    session_id: UUID,
    data: AnswerSubmit,
    current_user: CurrentUser,
    db: DBSession
):
    """Soumet une réponse à la question courante."""
    
    # 1. Récupérer la session
    session = await get_assessment_session(session_id, current_user.id, db)
    
    if session.status != "in_progress":
        raise HTTPException(400, f"Assessment {session.status}")
    
    # 2. Récupérer la question courante
    question_id = session.get_current_question_id()
    if not question_id:
        raise HTTPException(400, "Toutes les questions ont été répondues")
    
    question = await db.get(Question, question_id)
    
    # 3. Vérifier si déjà répondu (protection double-submit)
    stmt = select(UserQuestionHistory).where(
        UserQuestionHistory.user_id == current_user.id,
        UserQuestionHistory.question_id == question.id,
        UserQuestionHistory.session_id == session_id
    )
    result = await db.execute(stmt)
    if result.scalar_one_or_none():
        raise HTTPException(409, "Question déjà répondue")
    
    # 4. Vérifier la réponse
    is_correct = (data.answer.strip().lower() == question.correct_answer.strip().lower())
    
    # 5. Vérifier si première tentative sur ce topic
    stmt = select(UserQuestionHistory).where(
        UserQuestionHistory.user_id == current_user.id,
        UserQuestionHistory.question_id == question.id
    )
    result = await db.execute(stmt)
    is_first_attempt = result.scalar_one_or_none() is None
    
    # 6. Enregistrer dans l'historique
    history = UserQuestionHistory(
        user_id=current_user.id,
        question_id=question.id,
        session_id=session_id,
        user_answer=data.answer,
        is_correct=is_correct,
        time_taken_seconds=data.time_taken_seconds,
        hints_used=data.hints_used
    )
    db.add(history)
    
    # 7. Mettre à jour les stats de la question
    question.record_attempt(is_correct, data.time_taken_seconds)
    
    # 8. Mettre à jour topic mastery
    await update_topic_mastery_from_answer(
        current_user.id,
        question,
        is_correct,
        data.time_taken_seconds,
        session.skill_id,
        db
    )
    
    # 9. Calculer XP
    profile = current_user.profile
    xp_earned = calculate_question_xp(
        difficulty=question.difficulty,
        is_correct=is_correct,
        is_first_attempt=is_first_attempt,
        hints_used=data.hints_used,
        current_streak=profile.current_streak if profile else 0
    )
    
    # 10. Avancer dans l'assessment
    session.current_index += 1
    if is_correct:
        session.correct_answers += 1
    
    await db.commit()
    
    # 11. Préparer la réponse
    result = AnswerResult(
        is_correct=is_correct,
        correct_answer=question.correct_answer,
        explanation=question.explanation,
        xp_earned=xp_earned,
        questions_answered=session.current_index,
        correct_answers=session.correct_answers,
        current_score_percentage=session.current_score_percentage
    )
    
    # 12. Question suivante ou fin ?
    next_question = None
    is_complete = session.current_index >= session.total_questions
    
    if not is_complete:
        next_q_id = session.get_current_question_id()
        next_q = await db.get(Question, next_q_id)
        next_question = question_to_response(next_q)
    
    return AnswerResponse(
        result=result,
        next_question=next_question,
        is_complete=is_complete
    )


@router.post("/{session_id}/hint", response_model=HintResponse)
async def get_hint(
    session_id: UUID,
    data: HintRequest,
    current_user: CurrentUser,
    db: DBSession
):
    """Demande un indice pour la question courante."""
    
    session = await get_assessment_session(session_id, current_user.id, db)
    
    if session.status != "in_progress":
        raise HTTPException(400, "Assessment non actif")
    
    question_id = session.get_current_question_id()
    question = await db.get(Question, question_id)
    
    hint = question.get_hint(data.hint_index)
    
    if hint is None:
        raise HTTPException(404, "Indice non disponible")
    
    hints_remaining = (len(question.hints) - data.hint_index - 1) if question.hints else 0
    
    return HintResponse(
        hint=hint,
        hint_number=data.hint_index + 1,
        hints_remaining=hints_remaining
    )


@router.post("/{session_id}/complete", response_model=AssessmentResultsResponse)
async def complete_assessment(
    session_id: UUID,
    current_user: CurrentUser,
    db: DBSession
):
    """Termine l'assessment et calcule les résultats."""
    
    session = await get_assessment_session(session_id, current_user.id, db)
    
    if session.status == "completed":
        raise HTTPException(400, "Assessment déjà terminé")
    
    # 1. Calculer le score final
    score = (session.correct_answers / session.total_questions) * 100 if session.total_questions > 0 else 0
    
    # 2. Déterminer le niveau
    new_level = determine_level_from_score(score)
    
    # 3. Récupérer le niveau actuel
    stmt = select(UserSkillLevel).where(
        UserSkillLevel.user_id == current_user.id,
        UserSkillLevel.skill_id == session.skill_id
    )
    result = await db.execute(stmt)
    user_skill = result.scalar_one()
    
    previous_level = user_skill.current_level
    level_changed = new_level != previous_level
    
    # 4. Mettre à jour le niveau si meilleur
    levels_order = [LevelEnum.BEGINNER, LevelEnum.INTERMEDIATE, LevelEnum.ADVANCED, LevelEnum.EXPERT]
    if levels_order.index(new_level) > levels_order.index(previous_level):
        user_skill.current_level = new_level
        user_skill.assessment_score = score
        user_skill.assessment_date = datetime.utcnow()
    
    # 5. Calculer XP total
    total_time = (datetime.utcnow() - session.started_at).total_seconds()
    base_xp = int(score * 5)  # 500 XP max pour 100%
    xp_earned = base_xp
    
    # Ajouter XP au skill
    user_skill.add_xp(xp_earned)
    
    # Ajouter XP au profil
    if current_user.profile:
        current_user.profile.total_xp += xp_earned
        current_user.profile.update_streak()
    
    # 6. Marquer l'assessment comme terminé
    session.complete(score=score, level=new_level)
    
    # 7. Certification si >= 80%
    certification_earned = score >= 80
    certification_number = None
    
    if certification_earned:
        # TODO: Créer la certification
        pass
    
    await db.commit()
    
    # 8. Construire les résultats
    # TODO: Calculer topics_breakdown depuis UserQuestionHistory
    
    skill = await db.get(Skill, session.skill_id)
    
    results = AssessmentResults(
        session_id=session.id,
        skill_slug=skill.slug,
        skill_name=skill.name,
        total_questions=session.total_questions,
        correct_answers=session.correct_answers,
        final_score=round(score, 1),
        determined_level=new_level.value,
        previous_level=previous_level.value,
        level_changed=level_changed,
        xp_earned=xp_earned,
        total_skill_xp=user_skill.xp_points,
        topics_breakdown=[],  # TODO
        strong_topics=[],     # TODO
        weak_topics=[],       # TODO
        total_time_seconds=int(total_time),
        average_time_per_question=round(total_time / session.total_questions, 1),
        certification_earned=certification_earned,
        certification_number=certification_number,
        completed_at=session.completed_at
    )
    
    # 9. Générer des recommandations
    recommendations = []
    if score < 50:
        recommendations.append("Révise les bases avant de continuer")
    elif score < 75:
        recommendations.append("Continue à pratiquer les topics faibles")
    else:
        recommendations.append("Excellent ! Passe au niveau suivant")

    return AssessmentResultsResponse(
        results=results,
        message="Assessment terminé !",
        recommendations=recommendations
    )


@router.post("/{session_id}/abandon")
async def abandon_assessment(
        session_id: UUID,
        current_user: CurrentUser,
        db: DBSession
):
    """Abandonne un assessment en cours."""

    session = await get_assessment_session(session_id, current_user.id, db)

    if session.status != "in_progress":
        raise HTTPException(400, "Assessment non actif")

    session.abandon()
    await db.commit()

    return {"message": "Assessment abandonné", "session_id": session_id}