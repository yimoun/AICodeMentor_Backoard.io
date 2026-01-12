"""
AI Code Mentor - Billing Models
===============================
Modèles pour les abonnements, crédits et transactions.
"""

from datetime import datetime, date
from decimal import Decimal
from typing import TYPE_CHECKING, Optional
from uuid import UUID

from sqlalchemy import (
    Boolean, Date, DateTime, ForeignKey, Integer, 
    Numeric, String, Text, func, Index
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, UUIDMixin, TimestampMixin
from .enums import SubscriptionStatusEnum, PlanTypeEnum, CreditTransactionTypeEnum

if TYPE_CHECKING:
    from .auth import User
    from .mentoring import MentoringSession


class SubscriptionPlan(Base, UUIDMixin, TimestampMixin):
    """
    Plans d'abonnement disponibles.
    Ex: Free, Starter, Pro, Enterprise.
    """
    
    __tablename__ = "subscription_plans"
    
    # ===== Identification =====
    name: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )
    slug: Mapped[PlanTypeEnum] = mapped_column(
        unique=True,
        nullable=False
    )
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    
    # ===== Prix =====
    price_monthly: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False
    )
    price_yearly: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(10, 2),
        nullable=True
    )
    
    # ===== Stripe =====
    stripe_price_id_monthly: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True
    )
    stripe_price_id_yearly: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True
    )
    
    # ===== Crédits =====
    credits_per_month: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )
    
    # ===== Limites =====
    max_skills: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True  # NULL = illimité
    )
    max_sessions_per_day: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True  # NULL = illimité
    )
    
    # ===== Features =====
    features: Mapped[dict] = mapped_column(
        JSONB,
        default={},
        nullable=False
    )
    # Structure:
    # {
    #     "code_review": true,
    #     "advanced_analytics": true,
    #     "priority_support": false,
    #     "api_access": false,
    #     "team_management": false,
    #     "llm_access": ["mistral", "gpt35", "claude"]
    # }
    
    # ===== Affichage =====
    is_featured: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )
    display_order: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    
    # ===== Statut =====
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )
    
    # ===== Relations =====
    subscriptions: Mapped[list["UserSubscription"]] = relationship(
        "UserSubscription",
        back_populates="plan"
    )
    
    @property
    def is_free(self) -> bool:
        """Vérifie si c'est le plan gratuit."""
        return self.slug == PlanTypeEnum.FREE
    
    @property
    def yearly_savings_percent(self) -> Optional[float]:
        """Calcule le pourcentage d'économie annuel."""
        if not self.price_yearly or self.price_monthly == 0:
            return None
        yearly_if_monthly = self.price_monthly * 12
        savings = ((yearly_if_monthly - self.price_yearly) / yearly_if_monthly) * 100
        return round(float(savings), 1)
    
    def has_feature(self, feature_name: str) -> bool:
        """Vérifie si le plan inclut une fonctionnalité."""
        return self.features.get(feature_name, False)
    
    def can_access_llm(self, llm: str) -> bool:
        """Vérifie si le plan permet d'accéder à un LLM."""
        allowed_llms = self.features.get("llm_access", [])
        return llm in allowed_llms


class UserSubscription(Base, UUIDMixin, TimestampMixin):
    """
    Abonnement actif d'un utilisateur.
    """
    
    __tablename__ = "user_subscriptions"
    
    # ===== Clés étrangères =====
    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    plan_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("subscription_plans.id"),
        nullable=False
    )
    
    # ===== Stripe =====
    stripe_subscription_id: Mapped[Optional[str]] = mapped_column(
        String(100),
        unique=True,
        nullable=True,
        index=True
    )
    
    # ===== Statut =====
    status: Mapped[SubscriptionStatusEnum] = mapped_column(
        default=SubscriptionStatusEnum.ACTIVE,
        nullable=False,
        index=True
    )
    
    # ===== Période =====
    current_period_start: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False
    )
    current_period_end: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False
    )
    
    # ===== Annulation =====
    cancel_at_period_end: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )
    canceled_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    cancellation_reason: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    
    # ===== Trial =====
    trial_start: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    trial_end: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    
    # ===== Relations =====
    user: Mapped["User"] = relationship(
        "User",
        back_populates="subscriptions"
    )
    plan: Mapped["SubscriptionPlan"] = relationship(
        "SubscriptionPlan",
        back_populates="subscriptions"
    )
    
    @property
    def is_active(self) -> bool:
        """Vérifie si l'abonnement est actif."""
        return self.status == SubscriptionStatusEnum.ACTIVE
    
    @property
    def is_trialing(self) -> bool:
        """Vérifie si l'abonnement est en période d'essai."""
        return self.status == SubscriptionStatusEnum.TRIALING
    
    @property
    def days_until_renewal(self) -> int:
        """Calcule le nombre de jours avant renouvellement."""
        delta = self.current_period_end - datetime.utcnow()
        return max(0, delta.days)
    
    @property
    def is_expiring_soon(self) -> bool:
        """Vérifie si l'abonnement expire bientôt (< 7 jours)."""
        return self.days_until_renewal < 7
    
    def cancel(self, reason: Optional[str] = None, immediate: bool = False) -> None:
        """Annule l'abonnement."""
        self.canceled_at = datetime.utcnow()
        self.cancellation_reason = reason
        
        if immediate:
            self.status = SubscriptionStatusEnum.CANCELED
        else:
            self.cancel_at_period_end = True


class UserCredits(Base, UUIDMixin):
    """
    Solde de crédits de l'utilisateur.
    Table séparée pour optimiser les requêtes fréquentes.
    """
    
    __tablename__ = "user_credits"
    
    # ===== Clé étrangère =====
    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True
    )
    
    # ===== Solde =====
    credits_balance: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    
    # ===== Utilisation ce mois =====
    credits_used_this_month: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    
    # ===== Crédits bonus =====
    bonus_credits: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    
    # ===== Dernier refill =====
    last_refill_date: Mapped[Optional[date]] = mapped_column(
        Date,
        nullable=True
    )
    last_refill_amount: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True
    )
    
    # ===== Statistiques lifetime =====
    total_credits_purchased: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    total_credits_used: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    
    # ===== Timestamps =====
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=func.now(),
        onupdate=func.now(),
        nullable=False
    )
    
    # ===== Relations =====
    user: Mapped["User"] = relationship(
        "User",
        back_populates="credits"
    )
    
    @property
    def total_available(self) -> int:
        """Total des crédits disponibles (balance + bonus)."""
        return self.credits_balance + self.bonus_credits
    
    @property
    def is_low(self) -> bool:
        """Vérifie si le solde est bas (< 20% du refill)."""
        if self.last_refill_amount:
            return self.total_available < (self.last_refill_amount * 0.2)
        return self.total_available < 10
    
    def can_afford(self, amount: int) -> bool:
        """Vérifie si l'utilisateur peut se permettre cette dépense."""
        return self.total_available >= amount
    
    def deduct(self, amount: int) -> bool:
        """
        Déduit des crédits (bonus d'abord, puis balance).
        Retourne True si réussi.
        """
        if not self.can_afford(amount):
            return False
        
        # Utiliser les bonus d'abord
        if self.bonus_credits >= amount:
            self.bonus_credits -= amount
        elif self.bonus_credits > 0:
            remaining = amount - self.bonus_credits
            self.bonus_credits = 0
            self.credits_balance -= remaining
        else:
            self.credits_balance -= amount
        
        self.credits_used_this_month += amount
        self.total_credits_used += amount
        return True
    
    def add(self, amount: int, is_bonus: bool = False) -> None:
        """Ajoute des crédits."""
        if is_bonus:
            self.bonus_credits += amount
        else:
            self.credits_balance += amount
    
    def refill(self, amount: int) -> None:
        """Effectue un refill mensuel."""
        self.credits_balance = amount
        self.credits_used_this_month = 0
        self.last_refill_date = date.today()
        self.last_refill_amount = amount
    
    def add_purchased(self, amount: int) -> None:
        """Ajoute des crédits achetés."""
        self.credits_balance += amount
        self.total_credits_purchased += amount


class CreditTransaction(Base, UUIDMixin):
    """
    Historique des transactions de crédits.
    Pour l'audit et le suivi des dépenses.
    """
    
    __tablename__ = "credit_transactions"
    
    # ===== Clés étrangères =====
    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    # ===== Montant =====
    amount: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )
    # Positif = crédit (gain), Négatif = débit (dépense)
    
    # ===== Type =====
    type: Mapped[CreditTransactionTypeEnum] = mapped_column(
        nullable=False,
        index=True
    )
    
    # ===== Description =====
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    
    # ===== Références =====
    session_id: Mapped[Optional[UUID]] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("mentoring_sessions.id", ondelete="SET NULL"),
        nullable=True
    )
    stripe_payment_intent_id: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True
    )
    
    # ===== Solde après transaction =====
    balance_after: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )
    
    # ===== Timestamps =====
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=func.now(),
        nullable=False
    )
    
    # ===== Relations =====
    user: Mapped["User"] = relationship(
        "User",
        back_populates="credit_transactions"
    )
    session: Mapped[Optional["MentoringSession"]] = relationship(
        "MentoringSession"
    )
    
    # ===== Index =====
    __table_args__ = (
        Index("idx_credit_trans_created", "created_at", postgresql_ops={"created_at": "DESC"}),
    )
    
    @property
    def is_credit(self) -> bool:
        """Vérifie si c'est un crédit (gain)."""
        return self.amount > 0
    
    @property
    def is_debit(self) -> bool:
        """Vérifie si c'est un débit (dépense)."""
        return self.amount < 0
    
    @property
    def formatted_amount(self) -> str:
        """Retourne le montant formaté avec signe."""
        if self.amount >= 0:
            return f"+{self.amount}"
        return str(self.amount)
    
    @classmethod
    def create_usage(
        cls,
        user_id: UUID,
        amount: int,
        balance_after: int,
        session_id: Optional[UUID] = None,
        description: Optional[str] = None
    ) -> "CreditTransaction":
        """Factory pour créer une transaction d'usage."""
        return cls(
            user_id=user_id,
            amount=-abs(amount),  # Toujours négatif pour usage
            type=CreditTransactionTypeEnum.USAGE,
            description=description or "Utilisation de crédits",
            session_id=session_id,
            balance_after=balance_after
        )
    
    @classmethod
    def create_refill(
        cls,
        user_id: UUID,
        amount: int,
        balance_after: int
    ) -> "CreditTransaction":
        """Factory pour créer une transaction de refill."""
        return cls(
            user_id=user_id,
            amount=amount,
            type=CreditTransactionTypeEnum.SUBSCRIPTION_REFILL,
            description="Recharge mensuelle automatique",
            balance_after=balance_after
        )
    
    @classmethod
    def create_purchase(
        cls,
        user_id: UUID,
        amount: int,
        balance_after: int,
        stripe_payment_intent_id: str
    ) -> "CreditTransaction":
        """Factory pour créer une transaction d'achat."""
        return cls(
            user_id=user_id,
            amount=amount,
            type=CreditTransactionTypeEnum.PURCHASE,
            description="Achat de crédits",
            stripe_payment_intent_id=stripe_payment_intent_id,
            balance_after=balance_after
        )
