"""
AI Code Mentor - Mentoring Models
=================================
Modèles pour les sessions de mentorat et les messages.
"""

from datetime import datetime, timezone
from typing import TYPE_CHECKING, Optional
from uuid import UUID

from sqlalchemy import (
    Boolean, DateTime, ForeignKey, Integer, 
    String, Text, func, Index
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, UUIDMixin
from .enums import SessionStatusEnum, MessageRoleEnum, LLMProviderEnum

if TYPE_CHECKING:
    from .auth import User
    from .skills import Skill, Topic


class MentoringSession(Base, UUIDMixin):
    """
    Session de mentorat (conversation avec le mentor IA).
    Chaque session est liée à un skill et optionnellement un topic.
    """
    
    __tablename__ = "mentoring_sessions"
    
    # ===== Clés étrangères =====
    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    skill_id: Mapped[Optional[UUID]] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("skills.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    topic_id: Mapped[Optional[UUID]] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("topics.id", ondelete="SET NULL"),
        nullable=True
    )
    
    # ===== Identification =====
    title: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True
    )
    
    # ===== Statut =====
    status: Mapped[SessionStatusEnum] = mapped_column(
        default=SessionStatusEnum.ACTIVE,
        nullable=False,
        index=True
    )
    
    # ===== Métriques =====
    message_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    credits_consumed: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    total_tokens_used: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    
    # ===== Feedback =====
    satisfaction_rating: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True
    )
    # Rating 1-5 étoiles
    feedback_text: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    
    # ===== Backboard.io =====
    backboard_thread_id: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        index=True
    )
    
    # ===== Timestamps =====
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=func.now(),
        nullable=False
    )
    last_message_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=func.now(),
        nullable=False
    )
    ended_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    
    # ===== Relations =====
    user: Mapped["User"] = relationship(
        "User",
        back_populates="mentoring_sessions"
    )
    skill: Mapped[Optional["Skill"]] = relationship(
        "Skill",
        back_populates="mentoring_sessions"
    )
    topic: Mapped[Optional["Topic"]] = relationship("Topic")
    messages: Mapped[list["SessionMessage"]] = relationship(
        "SessionMessage",
        back_populates="session",
        cascade="all, delete-orphan",
        order_by="SessionMessage.created_at"
    )
    # ===== Index =====
    __table_args__ = (
        Index("idx_sessions_last_message", "last_message_at", postgresql_ops={"last_message_at": "DESC"}),
    )
    
    @property
    def is_active(self) -> bool:
        """Vérifie si la session est active."""
        return self.status == SessionStatusEnum.ACTIVE
    
    @property
    def duration_minutes(self) -> int:
        """Calcule la durée de la session en minutes."""
        end = self.ended_at or datetime.now(timezone.utc)
        delta = end - self.started_at
        return int(delta.total_seconds() / 60)
    
    @property
    def context_summary(self) -> str:
        """Retourne un résumé du contexte pour l'affichage."""
        parts = []
        if self.skill:
            parts.append(self.skill.name)
        if self.topic:
            parts.append(self.topic.name)
        return " → ".join(parts) if parts else "Général"
    
    def add_message(self, message: "SessionMessage") -> None:
        """Ajoute un message à la session."""
        self.messages.append(message)
        self.message_count += 1
        self.last_message_at = datetime.now(timezone.utc)
        
        if message.credits_cost:
            self.credits_consumed += message.credits_cost
        if message.tokens_used:
            self.total_tokens_used += message.tokens_used
    
    def complete(self) -> None:
        """Marque la session comme terminée."""
        self.status = SessionStatusEnum.COMPLETED
        self.ended_at = datetime.utcnow()
    
    def abandon(self) -> None:
        """Marque la session comme abandonnée."""
        self.status = SessionStatusEnum.ABANDONED
        self.ended_at = datetime.utcnow()
    
    def add_feedback(self, rating: int, text: Optional[str] = None) -> None:
        """Ajoute un feedback à la session."""
        self.satisfaction_rating = max(1, min(5, rating))
        self.feedback_text = text
    
    def generate_title(self) -> str:
        """Génère un titre automatique basé sur le premier message."""
        if self.messages:
            first_user_msg = next(
                (m for m in self.messages if m.role == MessageRoleEnum.USER),
                None
            )
            if first_user_msg:
                # Prendre les 50 premiers caractères
                title = first_user_msg.content[:50]
                if len(first_user_msg.content) > 50:
                    title += "..."
                return title
        return f"Session {self.context_summary}"


class SessionMessage(Base, UUIDMixin):
    """
    Message individuel dans une session de mentorat.
    """
    __tablename__ = "session_messages"

    # ===== Clés étrangères =====
    session_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("mentoring_sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    # ===== Contenu =====
    role: Mapped[MessageRoleEnum] = mapped_column(nullable=False)

    # ===== Métriques IA =====
    llm_used: Mapped[Optional[LLMProviderEnum]] = mapped_column(nullable=True)
    tokens_used: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    credits_cost: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # ===== Feedback Message =====
    feedback_helpful: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    feedback_text: Mapped[Optional[str]] = mapped_column(Text,
                                                         nullable=True)

    # ===== Métadonnées =====
    metadata_json: Mapped[dict] = mapped_column("metadata", JSONB, default={}, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=func.now(), nullable=False)

    # ===== Relation Correcte (Celle qui fixe votre erreur initiale) =====
    session = relationship("MentoringSession", back_populates="messages")

    __table_args__ = (
        Index("idx_messages_created", "created_at"),
    )

    tool_called: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    def mark_helpful(self, is_helpful: bool, text: Optional[str] = None) -> None:
        """Marque le message comme utile ou non."""
        self.feedback_helpful = is_helpful
        self.feedback_text = text  # Maintenant ça marchera