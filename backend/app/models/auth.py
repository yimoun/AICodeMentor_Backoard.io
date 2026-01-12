"""
AI Code Mentor - Auth Models
============================
Modèles pour l'authentification et la gestion des sessions.
"""

from datetime import datetime
from typing import TYPE_CHECKING, Optional
from uuid import UUID

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text, func, Index
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, UUIDMixin, TimestampMixin

if TYPE_CHECKING:
    from .profile import UserProfile
    from .skills import UserSkillLevel
    from .progress import UserTopicMastery
    from .mentoring import MentoringSession
    from .billing import UserSubscription, UserCredits, CreditTransaction
    from .badges import UserBadge, SkillCertification
    from .public import PublicProfile, SocialShare
    from .analytics import DailyActivity, EventLog


class User(Base, UUIDMixin, TimestampMixin):
    """
    Table principale des utilisateurs.
    Contient les données critiques d'authentification.
    """
    
    __tablename__ = "users"
    
    # ===== Identifiants =====
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True
    )

    assessment_sessions = relationship(
        "AssessmentSession",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    email_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )
    email_verified_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    
    # ===== Authentification =====
    password_hash: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True  # NULL si OAuth uniquement
    )
    
    # ===== OAuth Providers =====
    google_id: Mapped[Optional[str]] = mapped_column(
        String(100),
        unique=True,
        nullable=True,
        index=True
    )
    github_id: Mapped[Optional[str]] = mapped_column(
        String(100),
        unique=True,
        nullable=True,
        index=True
    )
    
    # ===== Stripe =====
    stripe_customer_id: Mapped[Optional[str]] = mapped_column(
        String(100),
        unique=True,
        nullable=True,
        index=True
    )
    
    # ===== Statut =====
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )
    is_admin: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )
    
    # ===== Métadonnées =====
    last_login_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    
    # ===== Relations =====
    # One-to-One
    profile: Mapped[Optional["UserProfile"]] = relationship(
        "UserProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan"
    )
    credits: Mapped[Optional["UserCredits"]] = relationship(
        "UserCredits",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan"
    )
    public_profile: Mapped[Optional["PublicProfile"]] = relationship(
        "PublicProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan"
    )
    
    # One-to-Many
    email_verification_tokens: Mapped[list["EmailVerificationToken"]] = relationship(
        "EmailVerificationToken",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    password_reset_tokens: Mapped[list["PasswordResetToken"]] = relationship(
        "PasswordResetToken",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    refresh_tokens: Mapped[list["RefreshToken"]] = relationship(
        "RefreshToken",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    subscriptions: Mapped[list["UserSubscription"]] = relationship(
        "UserSubscription",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    credit_transactions: Mapped[list["CreditTransaction"]] = relationship(
        "CreditTransaction",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    skill_levels: Mapped[list["UserSkillLevel"]] = relationship(
        "UserSkillLevel",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    topic_masteries: Mapped[list["UserTopicMastery"]] = relationship(
        "UserTopicMastery",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    mentoring_sessions: Mapped[list["MentoringSession"]] = relationship(
        "MentoringSession",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    badges: Mapped[list["UserBadge"]] = relationship(
        "UserBadge",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    certifications: Mapped[list["SkillCertification"]] = relationship(
        "SkillCertification",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    social_shares: Mapped[list["SocialShare"]] = relationship(
        "SocialShare",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    daily_activities: Mapped[list["DailyActivity"]] = relationship(
        "DailyActivity",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    event_logs: Mapped[list["EventLog"]] = relationship(
        "EventLog",
        back_populates="user"
    )
    
    def __repr__(self) -> str:
        return f"User(id={self.id}, email={self.email})"


class EmailVerificationToken(Base, UUIDMixin):
    """
    Tokens de vérification email (codes à 6 chiffres).
    """
    
    __tablename__ = "email_verification_tokens"
    
    # ===== Clé étrangère =====
    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    # ===== Token =====
    token: Mapped[str] = mapped_column(
        String(6),
        nullable=False
    )
    
    # ===== Expiration =====
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False
    )
    used_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
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
        back_populates="email_verification_tokens"
    )
    
    # ===== Index =====
    __table_args__ = (
        Index("idx_email_tokens_expires", "expires_at"),
    )
    
    @property
    def is_valid(self) -> bool:
        """Vérifie si le token est encore valide."""
        return (
            self.used_at is None and 
            self.expires_at > datetime.utcnow()
        )


class PasswordResetToken(Base, UUIDMixin):
    """
    Tokens de réinitialisation de mot de passe.
    """
    
    __tablename__ = "password_reset_tokens"
    
    # ===== Clé étrangère =====
    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    # ===== Token =====
    token: Mapped[str] = mapped_column(
        String(64),
        unique=True,
        nullable=False
    )
    
    # ===== Expiration =====
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False
    )
    used_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
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
        back_populates="password_reset_tokens"
    )
    
    @property
    def is_valid(self) -> bool:
        """Vérifie si le token est encore valide."""
        return (
            self.used_at is None and 
            self.expires_at > datetime.utcnow()
        )


class RefreshToken(Base, UUIDMixin):
    """
    Sessions de refresh tokens pour JWT.
    Permet de révoquer des sessions spécifiques.
    """
    
    __tablename__ = "refresh_tokens"
    
    # ===== Clé étrangère =====
    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    # ===== Token =====
    token_hash: Mapped[str] = mapped_column(
        String(64),  # SHA-256 hash
        unique=True,
        nullable=False,
        index=True
    )
    
    # ===== Device Info =====
    device_info: Mapped[Optional[dict]] = mapped_column(
        JSONB,
        nullable=True
    )
    # Structure: {"browser": "Chrome", "os": "Windows", "ip": "..."}
    
    # ===== Expiration =====
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False
    )
    revoked_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
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
        back_populates="refresh_tokens"
    )
    
    @property
    def is_valid(self) -> bool:
        """Vérifie si le token est encore valide."""
        return (
            self.revoked_at is None and 
            self.expires_at > datetime.utcnow()
        )
    
    def revoke(self) -> None:
        """Révoque ce refresh token."""
        self.revoked_at = datetime.utcnow()
