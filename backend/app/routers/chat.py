# routers/mentoring.py

from datetime import datetime
from uuid import UUID
from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy import select, desc

from app.utils.dependencies import DBSession, CurrentUser, VerifiedUser
from app.schemas.mentoring import (
    SessionCreateRequest,
    SessionCreateResponse,
    SessionResponse,
    SessionListResponse,
    SessionDetailResponse,
    MessageSendRequest,
    MessageSendResponse,
    MessageResponse,
    SessionFeedbackRequest,
    MessageFeedbackRequest,
)
from app.models import (
    MentoringSession,
    SessionMessage,
    Skill,
    Topic,
    UserProfile,
)
from app.services.backboard_service import backboard_service
from app.services.credit_service import consume_credits, get_credits_balance

router = APIRouter(prefix="/mentoring", tags=["Mentoring"])


# === HELPERS ===

def build_user_context(user, skill=None, topic=None, profile=None) -> dict:
    """Construit le contexte utilisateur pour Backboard."""
    context = {
        "user_id": str(user.id),
        "user_name": profile.first_name if profile else "Apprenant",
    }

    if profile:
        context["level"] = profile.years_of_experience or 0
        context["learning_style"] = profile.learning_style or "reading"

    if skill:
        context["current_skill"] = skill.name
        context["skill_slug"] = skill.slug

    if topic:
        context["current_topic"] = topic.name
        context["topic_slug"] = topic.slug

    return context


async def session_to_response(session: MentoringSession) -> SessionResponse:
    """Convertit un modèle en response."""
    return SessionResponse(
        id=session.id,
        skill_slug=session.skill.slug if session.skill else None,
        skill_name=session.skill.name if session.skill else None,
        skill_icon=session.skill.icon if session.skill else None,
        topic_slug=session.topic.slug if session.topic else None,
        topic_name=session.topic.name if session.topic else None,
        title=session.title,
        status=session.status,
        message_count=session.message_count,
        credits_consumed=session.credits_consumed,
        started_at=session.started_at,
        last_message_at=session.last_message_at,
        ended_at=session.ended_at,
        duration_minutes=session.duration_minutes,
        satisfaction_rating=session.satisfaction_rating
    )


# === ENDPOINTS ===

@router.post("/sessions", response_model=SessionCreateResponse, status_code=201)
async def create_session(
        data: SessionCreateRequest,
        current_user: VerifiedUser,
        db: DBSession
):
    """
    Crée une nouvelle session de mentorat.
    Consomme 1 crédit pour le premier message.
    """

    # 1. Vérifier les crédits
    credits_balance = await get_credits_balance(current_user.id, db)
    if credits_balance < 1:
        raise HTTPException(402, "Crédits insuffisants")

    # 2. Récupérer skill et topic si fournis
    skill = None
    topic = None

    if data.skill_slug:
        stmt = select(Skill).where(Skill.slug == data.skill_slug)
        result = await db.execute(stmt)
        skill = result.scalar_one_or_none()

    if data.topic_slug:
        stmt = select(Topic).where(Topic.slug == data.topic_slug)
        result = await db.execute(stmt)
        topic = result.scalar_one_or_none()

    # 3. Récupérer le profil
    profile = current_user.profile

    # 4. Créer le thread Backboard
    user_context = build_user_context(current_user, skill, topic, profile)

    thread_data = await backboard_service.create_thread(
        user_id=str(current_user.id),
        metadata={
            "skill": skill.slug if skill else None,
            "topic": topic.slug if topic else None,
            "user_level": profile.years_of_experience if profile else 0
        }
    )

    # 5. Créer la session en BD
    session = MentoringSession(
        user_id=current_user.id,
        skill_id=skill.id if skill else None,
        topic_id=topic.id if topic else None,
        backboard_thread_id=thread_data["thread_id"],
        title=data.initial_message[:100] + "..." if len(data.initial_message) > 100 else data.initial_message
    )
    db.add(session)
    await db.flush()

    # 6. Envoyer le premier message à Backboard
    response_data = await backboard_service.send_message(
        thread_id=thread_data["thread_id"],
        content=data.initial_message,
        user_context=user_context
    )

    print( " =========================================================== ")
    print("  =========================================================== ")
    print("                    RÉPONSE DE BACKBOARD ")
    print("  =========================================================== ")
    print("  =========================================================== ")
    print(response_data)
    print("  =========================================================== ")
    print("  =========================================================== ")


    if response_data.get("tool_called"):
        print()
        tool_response = await handle_tool_call(
            ToolCallRequest(
                tool=response_data["tool_called"],
                arguments=response_data.get("arguments", {})
            ),
            current_user=current_user
        )

        await backboard_service.send_tool_result(
            thread_id=thread_id,
            tool_name=response_data["tool_called"],
            result=tool_response
        )

        final_response = await backboard_service.send_message(
            thread_id=thread_id,
            content="Continue"  # ou "continue"
        )


    # 7. Consommer les crédits
    credits_remaining = await consume_credits(
        user_id=current_user.id,
        amount=1,
        description=f"Session mentorat: {session.title}",
        session_id=session.id,
        db=db
    )

    # 8. Enregistrer les messages (métadonnées)
    user_msg = SessionMessage(
        session_id=session.id,
        role="user",
        tokens_used=response_data.get("input_tokens", 0),
        credits_cost=0
    )
    db.add(user_msg)

    assistant_msg = SessionMessage(
        session_id=session.id,
        role="assistant",
        tokens_used=response_data.get("output_tokens", 0),
        credits_cost=1,
        llm_used=response_data.get("model", "claude"),
        tool_called=response_data.get("tool_called")
    )
    db.add(assistant_msg)

    # 9. Mettre à jour la session
    session.message_count = 2
    session.credits_consumed = 1
    session.last_message_at = datetime.utcnow()

    await db.commit()
    await db.refresh(session)

    # 10. Retourner la réponse
    return SessionCreateResponse(
        session=await session_to_response(session),
        assistant_response=MessageResponse(
            id=assistant_msg.id,
            role="assistant",
            content=response_data["content"],
            tokens_used=assistant_msg.tokens_used,
            credits_cost=assistant_msg.credits_cost,
            llm_used=assistant_msg.llm_used,
            tool_called=assistant_msg.tool_called,
            created_at=assistant_msg.created_at
        ),
        credits_remaining=credits_remaining
    )


@router.get("/sessions", response_model=SessionListResponse)
async def list_sessions(
        current_user: CurrentUser,
        db: DBSession,
        status: Optional[str] = Query(None, pattern="^(active|completed|abandoned)$"),
        skill_slug: Optional[str] = None,
        limit: int = Query(20, ge=1, le=50),
        offset: int = Query(0, ge=0)
):
    """Liste les sessions de mentorat de l'utilisateur."""

    stmt = select(MentoringSession).where(
        MentoringSession.user_id == current_user.id
    )

    if status:
        stmt = stmt.where(MentoringSession.status == status)

    if skill_slug:
        stmt = stmt.join(Skill).where(Skill.slug == skill_slug)

    stmt = stmt.order_by(desc(MentoringSession.last_message_at))

    # Count total
    count_stmt = select(func.count()).select_from(stmt.subquery())
    total = (await db.execute(count_stmt)).scalar()

    # Paginate
    stmt = stmt.offset(offset).limit(limit + 1)
    result = await db.execute(stmt)
    sessions = result.scalars().all()

    has_more = len(sessions) > limit
    sessions = sessions[:limit]

    return SessionListResponse(
        sessions=[await session_to_response(s) for s in sessions],
        total=total,
        has_more=has_more
    )


@router.get("/sessions/{session_id}", response_model=SessionDetailResponse)
async def get_session(
        session_id: UUID,
        current_user: CurrentUser,
        db: DBSession
):
    """Récupère une session avec son historique de messages."""

    # 1. Récupérer la session
    stmt = select(MentoringSession).where(
        MentoringSession.id == session_id,
        MentoringSession.user_id == current_user.id
    )
    result = await db.execute(stmt)
    session = result.scalar_one_or_none()

    if not session:
        raise HTTPException(404, "Session non trouvée")

    # 2. Récupérer les messages depuis Backboard
    messages_data = await backboard_service.get_thread_messages(
        thread_id=session.backboard_thread_id
    )

    # 3. Récupérer les métadonnées locales
    stmt = select(SessionMessage).where(
        SessionMessage.session_id == session_id
    ).order_by(SessionMessage.created_at)
    result = await db.execute(stmt)
    local_messages = {str(m.id): m for m in result.scalars().all()}

    # 4. Fusionner les données
    messages = []
    for msg in messages_data:
        messages.append(MessageResponse(
            id=msg.get("id", UUID("00000000-0000-0000-0000-000000000000")),
            role=msg["role"],
            content=msg["content"],
            tokens_used=msg.get("tokens_used", 0),
            credits_cost=msg.get("credits_cost", 0),
            llm_used=msg.get("model"),
            tool_called=msg.get("tool_called"),
            created_at=msg.get("created_at", datetime.utcnow())
        ))

    # 5. Crédits restants
    credits_remaining = await get_credits_balance(current_user.id, db)

    return SessionDetailResponse(
        session=await session_to_response(session),
        messages=messages,
        credits_remaining=credits_remaining
    )


@router.post("/sessions/{session_id}/messages", response_model=MessageSendResponse)
async def send_message(
        session_id: UUID,
        data: MessageSendRequest,
        current_user: VerifiedUser,
        db: DBSession
):
    """Envoie un message dans une session existante."""

    # 1. Récupérer la session
    stmt = select(MentoringSession).where(
        MentoringSession.id == session_id,
        MentoringSession.user_id == current_user.id
    )
    result = await db.execute(stmt)
    session = result.scalar_one_or_none()

    if not session:
        raise HTTPException(404, "Session non trouvée")

    if session.status != "active":
        raise HTTPException(400, "Session non active")

    # 2. Vérifier les crédits
    credits_balance = await get_credits_balance(current_user.id, db)
    if credits_balance < 1:
        raise HTTPException(402, "Crédits insuffisants")

    # 3. Construire le contexte
    user_context = build_user_context(
        current_user,
        session.skill,
        session.topic,
        current_user.profile
    )

    # 4. Envoyer à Backboard
    response_data = await backboard_service.send_message(
        thread_id=session.backboard_thread_id,
        content=data.content,
        user_context=user_context
    )

    if response_data.get("tool_called"):
        tool_response = await handle_tool_call(
            ToolCallRequest(
                tool=response_data["tool_called"],
                arguments=response_data.get("arguments", {})
            ),
            current_user=current_user
        )

        await backboard_service.send_tool_result(
            thread_id=thread_id,
            tool_name=response_data["tool_called"],
            result=tool_response
        )

        final_response = await backboard_service.send_message(
            thread_id=thread_id,
            content="Continue"  # ou "continue"
        )

    # 5. Consommer les crédits
    credits_remaining = await consume_credits(
        user_id=current_user.id,
        amount=1,
        description=f"Message mentorat",
        session_id=session.id,
        db=db
    )

    # 6. Enregistrer les métadonnées
    user_msg = SessionMessage(
        session_id=session.id,
        role="user",
        tokens_used=response_data.get("input_tokens", 0),
        credits_cost=0
    )
    db.add(user_msg)

    assistant_msg = SessionMessage(
        session_id=session.id,
        role="assistant",
        tokens_used=response_data.get("output_tokens", 0),
        credits_cost=1,
        llm_used=response_data.get("model"),
        tool_called=response_data.get("tool_called")
    )
    db.add(assistant_msg)

    # 7. Mettre à jour la session
    session.message_count += 2
    session.credits_consumed += 1
    session.last_message_at = datetime.utcnow()

    await db.commit()

    # 8. Retourner la réponse
    return MessageSendResponse(
        user_message=MessageResponse(
            id=user_msg.id,
            role="user",
            content=data.content,
            tokens_used=user_msg.tokens_used,
            credits_cost=0,
            created_at=user_msg.created_at
        ),
        assistant_response=MessageResponse(
            id=assistant_msg.id,
            role="assistant",
            content=response_data["content"],
            tokens_used=assistant_msg.tokens_used,
            credits_cost=1,
            llm_used=assistant_msg.llm_used,
            tool_called=assistant_msg.tool_called,
            created_at=assistant_msg.created_at
        ),
        credits_remaining=credits_remaining,
        session_credits_total=session.credits_consumed
    )


@router.post("/sessions/{session_id}/messages/stream")
async def send_message_stream(
        session_id: UUID,
        data: MessageSendRequest,
        current_user: VerifiedUser,
        db: DBSession
):
    """
    Envoie un message et stream la réponse.
    Utilise Server-Sent Events (SSE).
    """

    # 1-4. Mêmes vérifications que send_message...
    session = await get_session_or_404(session_id, current_user.id, db)
    await verify_credits(current_user.id, 1, db)

    user_context = build_user_context(
        current_user,
        session.skill,
        session.topic,
        current_user.profile
    )

    async def generate():
        """Générateur pour SSE."""
        full_response = ""

        try:
            # Stream depuis Backboard
            async for chunk in backboard_service.send_message_stream(
                    thread_id=session.backboard_thread_id,
                    content=data.content,
                    user_context=user_context
            ):
                full_response += chunk
                yield f"data: {chunk}\n\n"

            # Signal de fin
            yield "data: [DONE]\n\n"

            # Après le stream complet, sauvegarder les métadonnées
            await save_message_metadata(
                session=session,
                user_content=data.content,
                assistant_content=full_response,
                db=db
            )

        except Exception as e:
            yield f"data: [ERROR] {str(e)}\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )


async def save_message_metadata(
        session: MentoringSession,
        user_content: str,
        assistant_content: str,
        db: DBSession
):
    """Sauvegarde les métadonnées après un stream."""

    # Estimer les tokens (approximation)
    user_tokens = len(user_content.split()) * 1.3
    assistant_tokens = len(assistant_content.split()) * 1.3

    # Créer les messages
    user_msg = SessionMessage(
        session_id=session.id,
        role="user",
        tokens_used=int(user_tokens),
        credits_cost=0
    )
    db.add(user_msg)

    assistant_msg = SessionMessage(
        session_id=session.id,
        role="assistant",
        tokens_used=int(assistant_tokens),
        credits_cost=1,
        llm_used="claude"
    )
    db.add(assistant_msg)

    # Mettre à jour la session
    session.message_count += 2
    session.credits_consumed += 1
    session.last_message_at = datetime.utcnow()

    # Consommer les crédits
    await consume_credits(
        user_id=session.user_id,
        amount=1,
        description="Message mentorat (stream)",
        session_id=session.id,
        db=db
    )

    await db.commit()

@router.post("/sessions/{session_id}/feedback")
async def submit_session_feedback(
        session_id: UUID,
        data: SessionFeedbackRequest,
        current_user: CurrentUser,
        db: DBSession
):
    """Soumet un feedback sur la session."""

    stmt = select(MentoringSession).where(
        MentoringSession.id == session_id,
        MentoringSession.user_id == current_user.id
    )
    result = await db.execute(stmt)
    session = result.scalar_one_or_none()

    if not session:
        raise HTTPException(404, "Session non trouvée")

    session.satisfaction_rating = data.rating
    session.feedback_text = data.feedback_text

    await db.commit()

    return {"message": "Feedback enregistré", "rating": data.rating}


@router.post("/sessions/{session_id}/complete")
async def complete_session(
        session_id: UUID,
        current_user: CurrentUser,
        db: DBSession
):
    """Termine une session de mentorat."""

    stmt = select(MentoringSession).where(
        MentoringSession.id == session_id,
        MentoringSession.user_id == current_user.id
    )
    result = await db.execute(stmt)
    session = result.scalar_one_or_none()

    if not session:
        raise HTTPException(404, "Session non trouvée")

    if session.status != "active":
        raise HTTPException(400, "Session déjà terminée")

    session.complete()
    await db.commit()

    return {
        "message": "Session terminée",
        "duration_minutes": session.duration_minutes,
        "messages_count": session.message_count,
        "credits_consumed": session.credits_consumed
    }


@router.delete("/sessions/{session_id}")
async def delete_session(
        session_id: UUID,
        current_user: CurrentUser,
        db: DBSession
):
    """Supprime une session (et son thread Backboard)."""

    stmt = select(MentoringSession).where(
        MentoringSession.id == session_id,
        MentoringSession.user_id == current_user.id
    )
    result = await db.execute(stmt)
    session = result.scalar_one_or_none()

    if not session:
        raise HTTPException(404, "Session non trouvée")

    # Supprimer le thread Backboard
    await backboard_service.delete_thread(session.backboard_thread_id)

    # Supprimer en BD (cascade supprime les messages)
    await db.delete(session)
    await db.commit()

    return {"message": "Session supprimée"}