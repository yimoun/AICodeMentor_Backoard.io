"""
AI Code Mentor - Questions Models
=================================
Modèles pour la banque de questions et l'historique des réponses.
"""

from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING, Optional, Any
from uuid import UUID

from sqlalchemy import (
    Boolean, DateTime, ForeignKey, Integer, 
    Numeric, String, Text, func, Index, UniqueConstraint
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, UUIDMixin, TimestampMixin
from .enums import QuestionTypeEnum, DifficultyEnum

if TYPE_CHECKING:
    from .auth import User
    from .skills import Topic
    from .mentoring import MentoringSession


class Question(Base, UUIDMixin, TimestampMixin):
    """
    Banque de questions pour les tests de niveau.
    Supporte QCM, vrai/faux, complétion de code, etc.
    """
    
    __tablename__ = "questions"
    
    # ===== Type et difficulté =====
    type: Mapped[QuestionTypeEnum] = mapped_column(
        nullable=False,
        index=True
    )
    difficulty: Mapped[DifficultyEnum] = mapped_column(
        nullable=False,
        index=True
    )
    
    # ===== Contenu =====
    question_text: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )
    code_snippet: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    code_language: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True
    )
    
    # ===== Réponses =====
    options: Mapped[Optional[list[dict]]] = mapped_column(
        JSONB,
        nullable=True
    )
    # Structure pour QCM: [{"id": "a", "text": "..."}, {"id": "b", "text": "..."}, ...]
    
    correct_answer: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )
    # Pour QCM: "a" ou "b"
    # Pour code: le code correct
    # Pour vrai/faux: "true" ou "false"
    
    explanation: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    
    # ===== Indices =====
    hints: Mapped[list[str]] = mapped_column(
        JSONB,
        default=[],
        nullable=False
    )
    # Structure: ["Indice 1", "Indice 2", "Indice 3"]
    
    # ===== Statistiques =====
    times_shown: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    times_correct: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    avg_time_seconds: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(6, 2),
        nullable=True
    )
    
    # ===== Versioning =====
    version: Mapped[int] = mapped_column(
        Integer,
        default=1,
        nullable=False
    )
    
    # ===== Statut =====
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )
    
    # ===== Créateur =====
    created_by: Mapped[Optional[UUID]] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True
    )
    
    # ===== Relations =====
    topics: Mapped[list["QuestionTopic"]] = relationship(
        "QuestionTopic",
        back_populates="question",
        cascade="all, delete-orphan"
    )
    history: Mapped[list["UserQuestionHistory"]] = relationship(
        "UserQuestionHistory",
        back_populates="question"
    )
    
    # ===== Index =====
    __table_args__ = (
        Index("idx_questions_type_difficulty", "type", "difficulty"),
    )
    
    @property
    def success_rate(self) -> float:
        """Calcule le taux de réussite."""
        if self.times_shown == 0:
            return 0.0
        return (self.times_correct / self.times_shown) * 100
    
    @property
    def has_hints(self) -> bool:
        """Vérifie si la question a des indices."""
        return len(self.hints) > 0
    
    @property
    def hint_count(self) -> int:
        """Nombre d'indices disponibles."""
        return len(self.hints)
    
    def get_hint(self, index: int) -> Optional[str]:
        """Récupère un indice par son index."""
        if 0 <= index < len(self.hints):
            return self.hints[index]
        return None
    
    def record_attempt(self, is_correct: bool, time_seconds: int) -> None:
        """Enregistre une tentative de réponse."""
        self.times_shown += 1
        if is_correct:
            self.times_correct += 1
        
        # Mettre à jour le temps moyen
        if self.avg_time_seconds is None:
            self.avg_time_seconds = Decimal(str(time_seconds))
        else:
            # Moyenne mobile
            current_avg = float(self.avg_time_seconds)
            new_avg = (current_avg * (self.times_shown - 1) + time_seconds) / self.times_shown
            self.avg_time_seconds = Decimal(str(round(new_avg, 2)))
    
    def to_dict_for_test(self) -> dict[str, Any]:
        """Retourne la question formatée pour un test (sans la réponse)."""
        return {
            "id": str(self.id),
            "type": self.type.value,
            "difficulty": self.difficulty.value,
            "question_text": self.question_text,
            "code_snippet": self.code_snippet,
            "code_language": self.code_language,
            "options": self.options,
            "has_hints": self.has_hints,
            "hint_count": self.hint_count,
        }


class QuestionTopic(Base, UUIDMixin):
    """
    Association Many-to-Many entre Questions et Topics.
    """
    
    __tablename__ = "question_topics"
    
    # ===== Clés étrangères =====
    question_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("questions.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    topic_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("topics.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    # ===== Topic principal =====
    is_primary: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )
    
    # ===== Relations =====
    question: Mapped["Question"] = relationship(
        "Question",
        back_populates="topics"
    )
    topic: Mapped["Topic"] = relationship(
        "Topic",
        back_populates="question_topics"
    )
    
    # ===== Contraintes =====
    __table_args__ = (
        UniqueConstraint("question_id", "topic_id", name="unique_question_topic"),
    )


class UserQuestionHistory(Base, UUIDMixin):
    """
    Historique des réponses aux questions par utilisateur.
    """
    
    __tablename__ = "user_question_history"
    
    # ===== Clés étrangères =====
    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    question_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("questions.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    session_id: Mapped[Optional[UUID]] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("mentoring_sessions.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    
    # ===== Réponse =====
    user_answer: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    is_correct: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False
    )
    
    # ===== Temps =====
    time_taken_seconds: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True
    )
    
    # ===== Indices utilisés =====
    hints_used: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    
    # ===== Timestamps =====
    answered_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=func.now(),
        nullable=False
    )
    
    # ===== Relations =====
    user: Mapped["User"] = relationship("User")
    question: Mapped["Question"] = relationship(
        "Question",
        back_populates="history"
    )
    session: Mapped[Optional["MentoringSession"]] = relationship(
        "MentoringSession"
    )
    
    # ===== Index =====
    __table_args__ = (
        Index("idx_question_history_answered", "answered_at"),
    )
    
    @property
    def used_hints(self) -> bool:
        """Vérifie si des indices ont été utilisés."""
        return self.hints_used > 0
    
    @property
    def quality_score(self) -> int:
        """
        Calcule un score de qualité (0-5) pour SM-2.
        Basé sur: correctitude, temps, indices utilisés.
        """
        if not self.is_correct:
            return 0 if self.hints_used > 0 else 1
        
        # Réponse correcte
        base_score = 5
        
        # Pénalité pour les indices (-1 par indice, minimum 3)
        base_score -= self.hints_used
        
        # Pénalité si trop long (>60s pour question moyenne)
        if self.time_taken_seconds and self.time_taken_seconds > 60:
            base_score -= 1
        
        return max(3, base_score)  # Minimum 3 si correct
