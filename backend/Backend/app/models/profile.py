"""
AI Code Mentor - Profile Models
===============================
Modèles pour le profil utilisateur et les préférences.
"""

from datetime import datetime, date
from typing import TYPE_CHECKING, Optional
from uuid import UUID

from sqlalchemy import (
    Boolean, Date, DateTime, ForeignKey, Integer, 
    String, Text, func, Index
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, UUIDMixin, TimestampMixin
from .enums import LearningStyleEnum, GoalTypeEnum

if TYPE_CHECKING:
    from .auth import User


class UserProfile(Base, UUIDMixin, TimestampMixin):
    """
    Profil détaillé de l'utilisateur.
    Séparé de User pour optimiser les requêtes.
    """
    
    __tablename__ = "user_profiles"
    
    # ===== Clé étrangère =====
    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True
    )
    
    # ===== Informations personnelles =====
    first_name: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True
    )
    last_name: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True
    )
    display_name: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True
    )
    avatar_url: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
        default="https://www.svgrepo.com/svg/452030/avatar-default"
    )
    bio: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    
    # ===== Localisation =====
    country: Mapped[Optional[str]] = mapped_column(
        String(2),  # Code ISO
        nullable=True
    )
    timezone: Mapped[str] = mapped_column(
        String(50),
        default="UTC",
        nullable=False
    )
    preferred_language: Mapped[str] = mapped_column(
        String(5),
        default="fr",
        nullable=False
    )
    
    # ===== Expérience =====
    years_of_experience: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    current_role: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True
    )
    
    # ===== Préférences d'apprentissage =====
    learning_style: Mapped[LearningStyleEnum] = mapped_column(
        default=LearningStyleEnum.READING,
        nullable=False
    )
    daily_goal_minutes: Mapped[int] = mapped_column(
        Integer,
        default=15,
        nullable=False
    )
    
    # ===== Préférences de notification =====
    notification_preferences: Mapped[dict] = mapped_column(
        JSONB,
        default={
            "email_daily_reminder": True,
            "email_weekly_summary": True,
            "email_badge_earned": True,
            "push_enabled": False
        },
        nullable=False
    )
    
    # ===== Gamification =====
    total_xp: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
        index=True
    )
    current_streak: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    longest_streak: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    last_activity_date: Mapped[Optional[date]] = mapped_column(
        Date,
        nullable=True
    )
    
    # ===== Relations =====
    user: Mapped["User"] = relationship(
        "User",
        back_populates="profile"
    )
    learning_goals: Mapped[list["UserLearningGoal"]] = relationship(
        "UserLearningGoal",
        back_populates="user_profile",
        cascade="all, delete-orphan"
    )
    
    # ===== Index =====
    __table_args__ = (
        Index("idx_user_profiles_xp", total_xp.desc()),
    )
    
    @property
    def full_name(self) -> str:
        """Retourne le nom complet ou le display_name."""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.display_name or ""
    
    @property
    def initials(self) -> str:
        """Retourne les initiales pour l'avatar."""
        if self.first_name and self.last_name:
            return f"{self.first_name[0]}{self.last_name[0]}".upper()
        if self.display_name:
            parts = self.display_name.split()
            if len(parts) >= 2:
                return f"{parts[0][0]}{parts[1][0]}".upper()
            return self.display_name[:2].upper()
        return "??"
    
    def update_streak(self) -> None:
        """Met à jour le streak de l'utilisateur."""
        today = date.today()
        
        if self.last_activity_date is None:
            # Première activité
            self.current_streak = 1
            self.longest_streak = 1
        elif self.last_activity_date == today:
            # Déjà actif aujourd'hui, ne rien faire
            pass
        elif self.last_activity_date == today - datetime.timedelta(days=1):
            # Jour consécutif
            self.current_streak += 1
            if self.current_streak > self.longest_streak:
                self.longest_streak = self.current_streak
        else:
            # Streak cassé
            self.current_streak = 1
        
        self.last_activity_date = today
    
    def add_xp(self, amount: int) -> None:
        """Ajoute de l'XP au profil."""
        self.total_xp += amount

class UserLearningGoal(Base, UUIDMixin):
    """
    Objectifs d'apprentissage de l'utilisateur.
    """
    
    __tablename__ = "user_learning_goals"
    
    # ===== Clé étrangère =====
    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("user_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    # ===== Objectif =====
    goal_type: Mapped[GoalTypeEnum] = mapped_column(
        default=GoalTypeEnum.SKILL_UP,
        nullable=False,
        index=True
    )
    # Types possibles: 'career_change', 'skill_up', 'interview_prep', 
    #                  'certification', 'hobby', 'school', 'job_requirement'
    
    is_primary: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )
    
    target_date: Mapped[Optional[date]] = mapped_column(
        Date,
        nullable=True
    )
    
    # ===== Timestamps =====
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=func.now(),
        nullable=False
    )
    
    # ===== Relations =====
    user_profile: Mapped["UserProfile"] = relationship(
        "UserProfile",
        back_populates="learning_goals",
    )

