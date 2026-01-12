"""
AI Code Mentor - Analytics Models
=================================
Modèles pour l'activité quotidienne et les logs d'événements.
"""

from datetime import datetime, date
from typing import TYPE_CHECKING, Optional, Any
from uuid import UUID

from sqlalchemy import (
    Date, DateTime, ForeignKey, Integer, 
    String, Text, func, Index, UniqueConstraint
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, UUIDMixin

if TYPE_CHECKING:
    from .auth import User


class DailyActivity(Base, UUIDMixin):
    """
    Activité quotidienne de l'utilisateur.
    Utilisé pour le heatmap et les statistiques.
    """
    
    __tablename__ = "daily_activity"
    
    # ===== Clés =====
    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    activity_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True
    )
    
    # ===== Métriques =====
    minutes_active: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    questions_answered: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    messages_sent: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    xp_earned: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    credits_used: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    sessions_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    
    # ===== Relations =====
    user: Mapped["User"] = relationship(
        "User",
        back_populates="daily_activities"
    )
    
    # ===== Contraintes =====
    __table_args__ = (
        UniqueConstraint("user_id", "activity_date", name="unique_user_date"),
        Index("idx_daily_activity_date", "activity_date", postgresql_ops={"activity_date": "DESC"}),
    )
    
    @property
    def activity_level(self) -> int:
        """
        Calcule le niveau d'activité (0-4) pour le heatmap.
        Basé sur les minutes d'activité.
        """
        if self.minutes_active == 0:
            return 0
        elif self.minutes_active < 15:
            return 1
        elif self.minutes_active < 30:
            return 2
        elif self.minutes_active < 60:
            return 3
        else:
            return 4
    
    @property
    def has_activity(self) -> bool:
        """Vérifie si il y a eu de l'activité ce jour."""
        return self.minutes_active > 0 or self.messages_sent > 0
    
    def add_minutes(self, minutes: int) -> None:
        """Ajoute des minutes d'activité."""
        self.minutes_active += minutes
    
    def add_xp(self, xp: int) -> None:
        """Ajoute de l'XP gagné."""
        self.xp_earned += xp
    
    def add_credits_used(self, credits: int) -> None:
        """Ajoute des crédits utilisés."""
        self.credits_used += credits
    
    def record_question(self) -> None:
        """Enregistre une question répondue."""
        self.questions_answered += 1
    
    def record_message(self) -> None:
        """Enregistre un message envoyé."""
        self.messages_sent += 1
    
    def record_session(self) -> None:
        """Enregistre une nouvelle session."""
        self.sessions_count += 1
    
    @classmethod
    def get_or_create(
        cls,
        session,
        user_id: UUID,
        activity_date: date = None
    ) -> "DailyActivity":
        """
        Récupère ou crée l'activité du jour.
        
        Args:
            session: Session SQLAlchemy
            user_id: ID de l'utilisateur
            activity_date: Date (défaut: aujourd'hui)
        """
        if activity_date is None:
            activity_date = date.today()
        
        activity = session.query(cls).filter(
            cls.user_id == user_id,
            cls.activity_date == activity_date
        ).first()
        
        if not activity:
            activity = cls(
                user_id=user_id,
                activity_date=activity_date
            )
            session.add(activity)
        
        return activity
    
    def to_heatmap_dict(self) -> dict[str, Any]:
        """Retourne les données pour le heatmap."""
        return {
            "date": self.activity_date.isoformat(),
            "level": self.activity_level,
            "minutes": self.minutes_active,
            "xp": self.xp_earned
        }


class EventLog(Base, UUIDMixin):
    """
    Logs d'événements importants.
    Pour audit et debugging.
    """
    
    __tablename__ = "event_logs"
    
    # ===== Clé étrangère =====
    user_id: Mapped[Optional[UUID]] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    
    # ===== Événement =====
    event_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True
    )
    # Types d'événements:
    # - user.signup
    # - user.login
    # - user.logout
    # - user.password_reset
    # - subscription.created
    # - subscription.updated
    # - subscription.canceled
    # - payment.succeeded
    # - payment.failed
    # - badge.earned
    # - certification.earned
    # - session.started
    # - session.completed
    
    event_data: Mapped[dict] = mapped_column(
        JSONB,
        default={},
        nullable=False
    )
    # Données spécifiques à l'événement
    
    # ===== Contexte =====
    ip_address: Mapped[Optional[str]] = mapped_column(
        String(45),  # IPv6 max length
        nullable=True
    )
    user_agent: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    
    # ===== Timestamps =====
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=func.now(),
        nullable=False
    )
    
    # ===== Relations =====
    user: Mapped[Optional["User"]] = relationship(
        "User",
        back_populates="event_logs"
    )
    
    # ===== Index =====
    __table_args__ = (
        Index("idx_event_logs_type", "event_type"),
        Index("idx_event_logs_created", "created_at", postgresql_ops={"created_at": "DESC"}),
    )
    
    @property
    def event_category(self) -> str:
        """Retourne la catégorie de l'événement."""
        if "." in self.event_type:
            return self.event_type.split(".")[0]
        return "other"
    
    @property
    def event_action(self) -> str:
        """Retourne l'action de l'événement."""
        if "." in self.event_type:
            return self.event_type.split(".")[1]
        return self.event_type
    
    # ===== Factory Methods =====
    @classmethod
    def log_user_signup(
        cls,
        user_id: UUID,
        method: str = "email",
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None
    ) -> "EventLog":
        """Log un signup."""
        return cls(
            user_id=user_id,
            event_type="user.signup",
            event_data={"method": method},
            ip_address=ip_address,
            user_agent=user_agent
        )
    
    @classmethod
    def log_user_login(
        cls,
        user_id: UUID,
        method: str = "password",
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None
    ) -> "EventLog":
        """Log un login."""
        return cls(
            user_id=user_id,
            event_type="user.login",
            event_data={"method": method},
            ip_address=ip_address,
            user_agent=user_agent
        )
    
    @classmethod
    def log_subscription_created(
        cls,
        user_id: UUID,
        plan_slug: str,
        stripe_subscription_id: str
    ) -> "EventLog":
        """Log une création d'abonnement."""
        return cls(
            user_id=user_id,
            event_type="subscription.created",
            event_data={
                "plan": plan_slug,
                "stripe_subscription_id": stripe_subscription_id
            }
        )
    
    @classmethod
    def log_subscription_canceled(
        cls,
        user_id: UUID,
        plan_slug: str,
        reason: Optional[str] = None
    ) -> "EventLog":
        """Log une annulation d'abonnement."""
        return cls(
            user_id=user_id,
            event_type="subscription.canceled",
            event_data={
                "plan": plan_slug,
                "reason": reason
            }
        )
    
    @classmethod
    def log_payment_succeeded(
        cls,
        user_id: UUID,
        amount: float,
        currency: str,
        stripe_payment_intent_id: str
    ) -> "EventLog":
        """Log un paiement réussi."""
        return cls(
            user_id=user_id,
            event_type="payment.succeeded",
            event_data={
                "amount": amount,
                "currency": currency,
                "stripe_payment_intent_id": stripe_payment_intent_id
            }
        )
    
    @classmethod
    def log_payment_failed(
        cls,
        user_id: UUID,
        amount: float,
        currency: str,
        error: str
    ) -> "EventLog":
        """Log un paiement échoué."""
        return cls(
            user_id=user_id,
            event_type="payment.failed",
            event_data={
                "amount": amount,
                "currency": currency,
                "error": error
            }
        )
    
    @classmethod
    def log_badge_earned(
        cls,
        user_id: UUID,
        badge_slug: str,
        badge_name: str
    ) -> "EventLog":
        """Log l'obtention d'un badge."""
        return cls(
            user_id=user_id,
            event_type="badge.earned",
            event_data={
                "badge_slug": badge_slug,
                "badge_name": badge_name
            }
        )
    
    @classmethod
    def log_certification_earned(
        cls,
        user_id: UUID,
        skill_slug: str,
        level: str,
        score: float,
        cert_number: str
    ) -> "EventLog":
        """Log l'obtention d'une certification."""
        return cls(
            user_id=user_id,
            event_type="certification.earned",
            event_data={
                "skill_slug": skill_slug,
                "level": level,
                "score": score,
                "cert_number": cert_number
            }
        )
