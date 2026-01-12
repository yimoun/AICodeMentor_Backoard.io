# services/assessment_service.py

import random
from datetime import datetime
from decimal import Decimal
from uuid import UUID
from typing import Optional

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import (
    Skill,
    Question,
    Topic,
    SkillTopic,
    QuestionTopic,
    UserQuestionHistory,
    UserSkillLevel,
    UserTopicMastery,
    AssessmentSession
)
from app.models.enums import DifficultyEnum, LevelEnum


async def get_skill_by_slug(slug: str, db: AsyncSession) -> Skill:
    """Récupère un skill par son slug."""
    stmt = select(Skill).where(Skill.slug == slug, Skill.is_active == True)
    result = await db.execute(stmt)
    skill = result.scalar_one_or_none()

    if not skill:
        from fastapi import HTTPException
        raise HTTPException(404, f"Skill '{slug}' non trouvé")

    return skill


async def get_active_assessment(
        user_id: UUID,
        skill_id: UUID,
        db: AsyncSession
) -> Optional[AssessmentSession]:
    """Récupère un assessment en cours pour ce user/skill."""
    stmt = select(AssessmentSession).where(
        AssessmentSession.user_id == user_id,
        AssessmentSession.skill_id == skill_id,
        AssessmentSession.status == "in_progress"
    )
    result = await db.execute(stmt)
    session = result.scalar_one_or_none()

    # Vérifier si expiré
    if session and session.is_expired:
        session.expire()
        await db.commit()
        return None

    return session


async def get_assessment_session(
        session_id: UUID,
        user_id: UUID,
        db: AsyncSession
) -> AssessmentSession:
    """Récupère une session d'assessment."""
    stmt = select(AssessmentSession).where(
        AssessmentSession.id == session_id,
        AssessmentSession.user_id == user_id
    )
    result = await db.execute(stmt)
    session = result.scalar_one_or_none()

    if not session:
        from fastapi import HTTPException
        raise HTTPException(404, "Session d'assessment non trouvée")

    # Vérifier expiration
    if session.status == "in_progress" and session.is_expired:
        session.expire()
        await db.commit()
        from fastapi import HTTPException
        raise HTTPException(410, "Assessment expiré (temps écoulé)")

    return session


async def select_assessment_questions(
        user_id: UUID,
        skill_id: UUID,
        question_count: int,
        db: AsyncSession
) -> list[Question]:
    """Sélectionne les questions pour un assessment."""

    # 1. Récupérer les topics du skill (core uniquement)
    stmt = select(Topic.id).join(SkillTopic).where(
        SkillTopic.skill_id == skill_id,
        SkillTopic.is_core == True
    )
    result = await db.execute(stmt)
    topic_ids = [r[0] for r in result.all()]

    if not topic_ids:
        # Fallback : tous les topics du skill
        stmt = select(Topic.id).join(SkillTopic).where(
            SkillTopic.skill_id == skill_id
        )
        result = await db.execute(stmt)
        topic_ids = [r[0] for r in result.all()]

    # 2. Questions déjà vues récemment (éviter répétition)
    stmt = select(UserQuestionHistory.question_id).where(
        UserQuestionHistory.user_id == user_id
    ).order_by(UserQuestionHistory.answered_at.desc()).limit(100)
    result = await db.execute(stmt)
    recently_seen_ids = {r[0] for r in result.all()}

    # 3. Distribution des difficultés
    difficulty_distribution = {
        DifficultyEnum.EASY: max(1, int(question_count * 0.25)),
        DifficultyEnum.MEDIUM: max(1, int(question_count * 0.40)),
        DifficultyEnum.HARD: max(1, int(question_count * 0.25)),
        DifficultyEnum.EXPERT: max(1, int(question_count * 0.10)),
    }

    selected_questions = []

    # 4. Sélectionner par difficulté
    for difficulty, count in difficulty_distribution.items():
        stmt = select(Question).join(QuestionTopic).where(
            QuestionTopic.topic_id.in_(topic_ids),
            Question.difficulty == difficulty,
            Question.is_active == True,
            Question.id.notin_(recently_seen_ids) if recently_seen_ids else True
        ).order_by(func.random()).limit(count)

        result = await db.execute(stmt)
        questions = result.scalars().all()
        selected_questions.extend(questions)

    # 5. Compléter si pas assez de questions
    if len(selected_questions) < question_count:
        needed = question_count - len(selected_questions)
        existing_ids = {q.id for q in selected_questions}

        stmt = select(Question).join(QuestionTopic).where(
            QuestionTopic.topic_id.in_(topic_ids),
            Question.is_active == True,
            Question.id.notin_(existing_ids)
        ).order_by(func.random()).limit(needed)

        result = await db.execute(stmt)
        selected_questions.extend(result.scalars().all())

    # 6. Mélanger
    random.shuffle(selected_questions)

    return selected_questions[:question_count]


async def update_topic_mastery_from_answer(
        user_id: UUID,
        question: Question,
        is_correct: bool,
        time_seconds: int,
        skill_id: UUID,
        db: AsyncSession
) -> None:
    """Met à jour la maîtrise des topics après une réponse."""

    # Récupérer les topics de la question
    stmt = select(QuestionTopic.topic_id).where(
        QuestionTopic.question_id == question.id
    )
    result = await db.execute(stmt)
    topic_ids = [r[0] for r in result.all()]

    # Calculer la qualité SM-2 basée sur le temps et la correction
    if not is_correct:
        quality = 1
    elif time_seconds < 30:
        quality = 5  # Rapide et correct = excellent
    elif time_seconds < 60:
        quality = 4
    elif time_seconds < 90:
        quality = 3
    else:
        quality = 3  # Correct mais lent

    # Mettre à jour chaque topic
    for topic_id in topic_ids:
        stmt = select(UserTopicMastery).where(
            UserTopicMastery.user_id == user_id,
            UserTopicMastery.topic_id == topic_id,
            UserTopicMastery.skill_id == skill_id
        )
        result = await db.execute(stmt)
        mastery = result.scalar_one_or_none()

        if not mastery:
            # Créer le mastery
            mastery = UserTopicMastery(
                user_id=user_id,
                topic_id=topic_id,
                skill_id=skill_id
            )
            db.add(mastery)

        # Appliquer la pratique
        mastery.record_practice(is_correct, quality)


def calculate_question_xp(
        difficulty: DifficultyEnum,
        is_correct: bool,
        is_first_attempt: bool,
        hints_used: int,
        current_streak: int
) -> int:
    """Calcule l'XP gagné pour une question."""

    base_xp = {
        DifficultyEnum.EASY: 5,
        DifficultyEnum.MEDIUM: 10,
        DifficultyEnum.HARD: 15,
        DifficultyEnum.EXPERT: 20
    }[difficulty]

    xp = base_xp

    # Bonus/malus
    if is_correct:
        xp = int(xp * 1.5)

    if is_first_attempt:
        xp += 25

    # Pénalité indices
    xp = max(1, xp - (hints_used * 5))

    # Bonus streak
    streak_bonus = min(current_streak * 0.10, 0.50)
    xp = int(xp * (1 + streak_bonus))

    return xp


def determine_level_from_score(score: float) -> LevelEnum:
    """Détermine le niveau basé sur le score."""
    if score >= 90:
        return LevelEnum.EXPERT
    elif score >= 75:
        return LevelEnum.ADVANCED
    elif score >= 50:
        return LevelEnum.INTERMEDIATE
    else:
        return LevelEnum.BEGINNER