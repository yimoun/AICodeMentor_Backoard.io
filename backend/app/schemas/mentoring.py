from datetime import datetime
from typing import Optional, Literal
from uuid import UUID

from pydantic import Field

from app.schemas.base import BaseSchema


# === REQUEST SCHEMAS ===

class SessionCreateRequest(BaseSchema):
    """Création d'une nouvelle session de mentorat."""
    skill_slug: Optional[str] = None
    topic_slug: Optional[str] = None
    initial_message: str = Field(..., min_length=1, max_length=5000)


class MessageSendRequest(BaseSchema):
    """Envoi d'un message dans une session."""
    content: str = Field(..., min_length=1, max_length=10000)


class SessionFeedbackRequest(BaseSchema):
    """Feedback sur une session."""
    rating: int = Field(..., ge=1, le=5)
    feedback_text: Optional[str] = Field(None, max_length=1000)


class MessageFeedbackRequest(BaseSchema):
    """Feedback sur un message spécifique."""
    is_helpful: bool


# === RESPONSE SCHEMAS ===

class MessageResponse(BaseSchema):
    """Un message dans la conversation."""
    id: UUID
    role: Literal["user", "assistant"]
    content: str
    tokens_used: int
    credits_cost: int
    llm_used: Optional[str] = None
    tool_called: Optional[str] = None
    created_at: datetime


class SessionResponse(BaseSchema):
    """Détails d'une session de mentorat."""
    id: UUID
    skill_slug: Optional[str] = None
    skill_name: Optional[str] = None
    skill_icon: Optional[str] = None
    topic_slug: Optional[str] = None
    topic_name: Optional[str] = None

    title: Optional[str]
    status: str
    message_count: int
    credits_consumed: int

    started_at: datetime
    last_message_at: Optional[datetime]
    ended_at: Optional[datetime]
    duration_minutes: int

    satisfaction_rating: Optional[int] = None


class SessionCreateResponse(BaseSchema):
    """Réponse après création d'une session."""
    session: SessionResponse
    assistant_response: MessageResponse
    credits_remaining: int


class MessageSendResponse(BaseSchema):
    """Réponse après envoi d'un message."""
    user_message: MessageResponse
    assistant_response: MessageResponse
    credits_remaining: int
    session_credits_total: int


class SessionListResponse(BaseSchema):
    """Liste des sessions."""
    sessions: list[SessionResponse]
    total: int
    has_more: bool


class SessionDetailResponse(BaseSchema):
    """Session avec historique des messages."""
    session: SessionResponse
    messages: list[MessageResponse]
    credits_remaining: int