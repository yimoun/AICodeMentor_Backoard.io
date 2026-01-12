from datetime import datetime, timedelta, timezone
from sys import displayhook
from typing import Annotated
from uuid import UUID
import requests


from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.responses import RedirectResponse

from app.utils.dependencies import (
    DBSession,
    CurrentUser,
    RateLimiter,
    ClientInfo,
    get_current_user_optional,
)
from app.schemas.profile import *
from app.schemas.base import MessageResponse
from app.models import profile
from app.models import UserProfile
from app.utils.security import *
from app.services.email_service import *
from app.config.settings import settings


router = APIRouter(prefix="/profile", tags=["Profil Utilisateur"])


# ------------------------------------------------------------
# ÉTAPE 1 : PROFIL PROFESSIONNEL
# ------------------------------------------------------------
@router.post("/profile/onboarding/step1", status_code=status.HTTP_200_OK)
async def onboarding_step1(
        data: OnboardingStep1Request,
        current_user: CurrentUser,
        db: DBSession
):
    """Étape 1 : Expérience et Rôle actuel."""

    # On s'assure que le profil existe, sinon on le crée
    if not current_user.profile:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)
        await db.flush()  # Pour avoir l'ID si nécessaire tout de suite
    else:
        profile = current_user.profile

    # Mise à jour des données
    profile.years_of_experience = data.years_of_experience
    profile.current_role = data.current_role

    # Sauvegarde
    await db.commit()

    return {"message": "Step 1 completed", "next_step": "step2"}


# ------------------------------------------------------------
# ÉTAPE 2 : PRÉFÉRENCES D'APPRENTISSAGE
# ------------------------------------------------------------
@router.post("/profile/onboarding/step2", status_code=status.HTTP_200_OK)
async def onboarding_step2(
        data: OnboardingStep2Request,
        current_user: CurrentUser,
        db: DBSession
):
    """Étape 2 : Style d'apprentissage et temps quotidien."""

    # Le profil doit exister à ce stade (créé à l'étape 1)
    if not current_user.profile:
        raise HTTPException(400, "Veuillez compléter l'étape 1 d'abord")

    profile = current_user.profile

    profile.learning_style = data.learning_style
    profile.daily_goal_minutes = data.daily_goal_minutes

    await db.commit()

    return {"message": "Step 2 completed", "next_step": "step3"}


# ------------------------------------------------------------
# ÉTAPE 3 : OBJECTIFS
# ------------------------------------------------------------
@router.post("/profile/onboarding/step3", status_code=status.HTTP_200_OK)
async def onboarding_step3(
        data: OnboardingStep3Request,
        current_user: CurrentUser,
        db: DBSession
):
    """Étape 3 : Définition des objectifs."""

    if not current_user.profile:
        raise HTTPException(400, "Profil introuvable")

    # Nettoyage préventif : Si l'utilisateur refait l'onboarding, on supprime les anciens objectifs
    # pour éviter les doublons
    stmt = delete(UserLearningGoal).where(UserLearningGoal.user_id == current_user.profile.id)
    await db.execute(stmt)

    # Ajout des nouveaux objectifs
    for goal_type in data.goals:
        goal = UserLearningGoal(
            profile_id=current_user.profile.id,
            goal_type=goal_type,
            is_primary=(goal_type == data.primary_goal)
        )
        db.add(goal)

    await db.commit()

    return {"message": "Step 3 completed", "next_step": "step4"}


# ------------------------------------------------------------
# ÉTAPE 4 : SKILLS INITIAUX
# ------------------------------------------------------------
@router.post("/profile/onboarding/step4", response_model=OnboardingResponse)  # Ton modèle de réponse original
async def onboarding_step4(
        data: OnboardingStep4Request,
        current_user: CurrentUser,
        db: DBSession
):
    """Étape 4 : Sélection des compétences initiales."""

    if not current_user.profile:
        raise HTTPException(400, "Profil introuvable")

    skills_added = []

    # On pourrait aussi nettoyer les compétences existantes si on veut être strict,
    # mais pour les skills, l'ajout incrémental est souvent acceptable.

    for skill_slug in data.initial_skills:
        # Trouver le skill
        stmt = select(Skill).where(Skill.slug == skill_slug)
        result = await db.execute(stmt)
        skill = result.scalar_one_or_none()

        if skill:
            # Vérifier si l'utilisateur a déjà ce skill pour éviter erreur SQL (Unique Constraint)
            # Cette vérification dépend de tes contraintes, voici une version sûre :
            check_stmt = select(UserSkillLevel).where(
                (UserSkillLevel.user_id == current_user.id) &
                (UserSkillLevel.skill_id == skill.id)
            )
            existing = await db.execute(check_stmt)

            if not existing.scalar_one_or_none():
                user_skill = UserSkillLevel(
                    user_id=current_user.id,
                    skill_id=skill.id,
                    current_level=LevelEnum.BEGINNER
                )
                db.add(user_skill)
                # Attention : incrémenter le compteur doit être atomique ou géré proprement
                skill.learners_count += 1
                skills_added.append(skill_slug)

    await db.commit()

    # On rafraichit le profil pour la réponse finale
    await db.refresh(current_user.profile)

    return OnboardingResponse(
        profile=ProfileResponse.model_validate(current_user.profile),
        skills_added=skills_added,
        next_step="assessment" if skills_added else "browse_skills"
    )


@router.get("/profile/preferences", response_model=UserPreferencesResponse)
async def get_preferences(current_user: CurrentUser, db: DBSession):
    """Récupère toutes les préférences."""
    profile = current_user.profile

    return UserPreferencesResponse(
        learning=LearningPreferences(
            learning_style=profile.learning_style,
            daily_goal_minutes=profile.daily_goal_minutes
        ),
        notifications=NotificationPreferences(
            **(profile.notification_preferences or {})
        ),
        localization=LocalizationPreferences(
            preferred_language=profile.preferred_language,
            timezone=profile.timezone,
            country=profile.country
        )
    )


@router.patch("/profile/preferences", response_model=UserPreferencesResponse)
async def update_preferences(
        data: UserPreferencesUpdate,
        current_user: CurrentUser,
        db: DBSession
):
    """Met à jour les préférences (partiellement)."""
    profile = current_user.profile

    # Mise à jour partielle (seulement les champs fournis)
    if data.learning_style is not None:
        profile.learning_style = data.learning_style

    if data.daily_goal_minutes is not None:
        profile.daily_goal_minutes = data.daily_goal_minutes

    if data.preferred_language is not None:
        profile.preferred_language = data.preferred_language

    if data.timezone is not None:
        profile.timezone = data.timezone

    if data.notification_preferences is not None:
        # Fusionner avec les préférences existantes
        current_notifs = profile.notification_preferences or {}
        updated_notifs = data.notification_preferences.model_dump(exclude_none=True)
        profile.notification_preferences = {**current_notifs, **updated_notifs}

    await db.commit()
    await db.refresh(profile)

    return await get_preferences(current_user, db)