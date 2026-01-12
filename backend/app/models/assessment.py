from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4
from decimal import Decimal

from sqlalchemy import ForeignKey, String, Integer, ARRAY, text
from sqlalchemy.dialects.postgresql import JSONB, UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.enums import LevelEnum


class AssessmentSession(Base):
    """Session d'évaluation de niveau."""

    __tablename__ = "assessment_sessions"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid4
    )
    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True
    )
    skill_id: Mapped[UUID] = mapped_column(
        ForeignKey("skills.id", ondelete="CASCADE"),
        index=True
    )

    # État
    status: Mapped[str] = mapped_column(
        String(20),
        default="in_progress"
    )  # in_progress, completed, abandoned, expired

    # Questions
    question_ids: Mapped[list] = mapped_column(JSONB)  # Liste ordonnée des UUIDs
    current_index: Mapped[int] = mapped_column(Integer, default=0)

    # Résultats
    total_questions: Mapped[int] = mapped_column(Integer)
    correct_answers: Mapped[int] = mapped_column(Integer, default=0)
    score: Mapped[Optional[Decimal]] = mapped_column(default=None)
    determined_level: Mapped[Optional[LevelEnum]] = mapped_column(default=None)

    # Temps
    started_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    completed_at: Mapped[Optional[datetime]] = mapped_column(default=None)
    time_limit_minutes: Mapped[int] = mapped_column(Integer, default=30)

    # Crédits
    credits_consumed: Mapped[int] = mapped_column(Integer, default=0)

    # Relations
    user: Mapped["User"] = relationship(back_populates="assessment_sessions")
    skill: Mapped["Skill"] = relationship()

    # === PROPRIÉTÉS ===

    @property
    def is_expired(self) -> bool:
        """Vérifie si le temps est écoulé."""
        if self.status != "in_progress":
            return False
        elapsed = datetime.utcnow() - self.started_at
        return elapsed.total_seconds() > (self.time_limit_minutes * 60)

    @property
    def time_remaining_seconds(self) -> int:
        """Temps restant en secondes."""
        if self.status != "in_progress":
            return 0
        elapsed = (datetime.utcnow() - self.started_at).total_seconds()
        remaining = (self.time_limit_minutes * 60) - elapsed
        return max(0, int(remaining))

    @property
    def progress_percentage(self) -> float:
        """Pourcentage de progression."""
        if self.total_questions == 0:
            return 0
        return round((self.current_index / self.total_questions) * 100, 1)

    @property
    def current_score_percentage(self) -> float:
        """Score actuel en pourcentage."""
        if self.current_index == 0:
            return 0
        return round((self.correct_answers / self.current_index) * 100, 1)

    # === MÉTHODES ===

    def get_current_question_id(self) -> Optional[UUID]:
        """Retourne l'ID de la question courante."""
        if self.current_index >= len(self.question_ids):
            return None
        return UUID(self.question_ids[self.current_index])

    def get_remaining_question_ids(self) -> list[UUID]:
        """Retourne les IDs des questions restantes."""
        return [
            UUID(qid) for qid in self.question_ids[self.current_index:]
        ]

    def complete(self, score: Decimal, level: LevelEnum) -> None:
        """Marque l'assessment comme terminé."""
        self.status = "completed"
        self.completed_at = datetime.utcnow()
        self.score = score
        self.determined_level = level

    def abandon(self) -> None:
        """Marque l'assessment comme abandonné."""
        self.status = "abandoned"
        self.completed_at = datetime.utcnow()

    def expire(self) -> None:
        """Marque l'assessment comme expiré (temps écoulé)."""
        self.status = "expired"
        self.completed_at = datetime.utcnow()