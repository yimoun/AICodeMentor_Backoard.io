"""
AI Code Mentor - Auth Router
============================
Routes pour la gestion de la progression et des topics à apprendre.
"""

from datetime import datetime, timedelta, timezone, date
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
from app.schemas.progress import *
from app.schemas.base import MessageResponse
from app.models import User, EmailVerificationToken, PasswordResetToken, RefreshToken
from app.models import UserProfile, UserCredits
from app.utils.security import *
from app.services.progres_service import *
from app.config.settings import settings

import urllib.parse

router = APIRouter(prefix="/progress", tags=["Progression"])


@router.get("/progress/topics/review", response_model=TopicsToReviewResponse)
async def get_topics_to_review(
        current_user: CurrentUser,
        db: DBSession,
        limit: int = Query(default=10, le=50)
):
    """Récupère les topics à réviser aujourd'hui."""

    today = date.today()

    stmt = select(UserTopicMastery, Topic).join(Topic).where(
        UserTopicMastery.user_id == current_user.id,
        or_(
            UserTopicMastery.needs_review == True,
            UserTopicMastery.next_review_date <= today
        )
    ).order_by(
        UserTopicMastery.next_review_date.asc()  # Plus urgent d'abord
    ).limit(limit)

    result = await db.execute(stmt)
    topics = result.all()

    return TopicsToReviewResponse(
        topics=[...],
        total=len(topics),
        message=f"{len(topics)} topic(s) à réviser aujourd'hui"
    )