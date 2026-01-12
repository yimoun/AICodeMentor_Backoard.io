from app.schemas.base import BaseSchema
from uuid import UUID
from datetime import date
from typing import List, Optional, Dict
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, delete
from pydantic import BaseModel, model_validator, EmailStr, Field, field_validator

from app.models.auth import User
from app.models.profile import UserProfile, UserLearningGoal
from app.models.progress import UserSkillLevel
from app.models.enums import LevelEnum, LearningStyleEnum
from app.models.skills import Skill
from app.utils.dependencies import DBSession

from app.models.enums import GoalTypeEnum, LearningStyleEnum

class UserProfileSchema(BaseModel):
    id: UUID
    user_id: UUID

    first_name: Optional[str]
    last_name: Optional[str]
    display_name: Optional[str]
    avatar_url: Optional[str]
    bio: Optional[str]

    country: Optional[str]
    timezone: str
    preferred_language: str

    years_of_experience: int
    current_role: Optional[str]

    learning_style: LearningStyleEnum
    daily_goal_minutes: int

    notification_preferences: Dict

    total_xp: int
    current_streak: int
    longest_streak: int
    last_activity_date: Optional[date]

    class Config:
        from_attributes = True

class ProfileResponse(BaseSchema):
    """Réponse du profil de l'utilisateur."""
    profile: UserProfileSchema


class OnboardingRequest(BaseSchema):
    """Toutes les données collectées pendant l'onboarding."""
    years_of_experience: int = Field(default=0, ge=0, le=50)
    current_role: str | None = None

    goals: list[GoalTypeEnum] = Field(default_factory=list, max_length=3)
    primary_goal: GoalTypeEnum | None = None

    initial_skills: list[str] = Field(default_factory=list, max_length=5)

    learning_style: LearningStyleEnum = LearningStyleEnum.READING
    daily_goal_minutes: int = Field(default=15, ge=5, le=240)


class OnboardingResponse(BaseSchema):
    """Réponse après onboarding complété."""
    message: str = "Profil complété avec succès"
    profile: ProfileResponse
    skills_added: list[str]
    next_step: str = "assessment"  # ou "dashboard"


class LearningPreferences(BaseSchema):
    """Préférences d'apprentissage."""
    learning_style: LearningStyleEnum = LearningStyleEnum.READING
    daily_goal_minutes: int = Field(default=15, ge=5, le=240)


class NotificationPreferences(BaseSchema):
    """Préférences de notifications."""
    email_daily_reminder: bool = True
    email_weekly_summary: bool = True
    email_badge_earned: bool = True
    email_streak_reminder: bool = True
    push_enabled: bool = False


class LocalizationPreferences(BaseSchema):
    """Préférences de localisation."""
    preferred_language: str = Field(default="fr", max_length=5)
    timezone: str = Field(default="America/Montreal", max_length=50)
    country: str | None = Field(None, min_length=2, max_length=2)


class UserPreferencesResponse(BaseSchema):
    """Réponse complète des préférences utilisateur."""
    learning: LearningPreferences
    notifications: NotificationPreferences
    localization: LocalizationPreferences

class UserPreferencesUpdate(BaseSchema):
    """Mise à jour des préférences (tous champs optionnels)."""
    learning_style: LearningStyleEnum = LearningStyleEnum.READING
    daily_goal_minutes: int | None = Field(None, ge=5, le=240)

    preferred_language: str | None = None
    timezone: str | None = None

    notification_preferences: NotificationPreferences | None = None

class OnboardingStep1Request(BaseModel):
    years_of_experience: int
    current_role: str

class OnboardingStep2Request(BaseModel):
    learning_style: LearningStyleEnum
    daily_goal_minutes: int

class OnboardingStep3Request(BaseModel):
    goals: List[str]
    primary_goal: str

class OnboardingStep4Request(BaseModel):
    initial_skills: List[str]