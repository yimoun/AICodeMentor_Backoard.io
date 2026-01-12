"""
AI Code Mentor - Auth Router
============================
Routes pour l'authentification et la gestion des sessions.
"""

from datetime import datetime, timedelta, timezone
from sys import displayhook
from typing import Annotated, Dict
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
from app.schemas.auth import *
from app.schemas.base import MessageResponse
from app.models import User, EmailVerificationToken, PasswordResetToken, RefreshToken
from app.models import UserProfile, UserCredits, UserSubscription, SubscriptionPlan
from app.utils.security import *
from app.services.email_service import *
from app.config.settings import settings

import urllib.parse

from app.schemas.auth import TokenResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


# ============================================================================
# REGISTER
# ============================================================================

@router.post(
    "/register",
    response_model=UserRegisterResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Créer un compte",
    description="Crée un nouveau compte utilisateur et envoie un email de vérification."
)
async def register(
    data: UserRegister,
    db: DBSession,
    background_tasks: BackgroundTasks,
    client_info: ClientInfo,
    _: Annotated[None, Depends(RateLimiter(max_requests=5, window_seconds=300))]
):
    """Inscription d'un nouvel utilisateur."""
    
    # Vérifier si l'email existe déjà
    stmt = select(User).where(User.email == data.email.lower())
    result = await db.execute(stmt)
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Un compte existe déjà avec cet email"
        )
    
    # Créer l'utilisateur
    user = User(
        email=data.email.lower(),
        password_hash=hash_password(data.password),
        email_verified=False,
    )
    db.add(user)
    await db.flush()  # Pour obtenir l'ID
    
    # Créer le profil vide
    profile = UserProfile(
        user_id=user.id,
        first_name = data.first_name.lower(),
        last_name = data.last_name.lower(),
        display_name = data.username.lower(),
    )
    db.add(profile)
    
    # Créer les crédits initiaux (plan gratuit)
    credits = UserCredits(
        user_id=user.id,
        credits_balance=50,  # Crédits gratuits de bienvenue
        bonus_credits=0
    )
    db.add(credits)
    
    # Générer le code de vérification
    now = datetime.now(timezone.utc)
    verification_code = generate_verification_code()
    verification_token = EmailVerificationToken(
        user_id=user.id,
        token=verification_code,
        expires_at=now + timedelta(hours=24)
    )
    db.add(verification_token)
    
    await db.commit()

    # Créer l'évènement pour n8n
    json_data = {
      "event": "USER_REGISTERED",
      "user": {
        "first_name": profile.first_name,
        "last_name": profile.last_name,
        "email": user.email,
        "code": verification_code,
      }
    }

    background_tasks.add_task(send_n8n_webhook, json_data, settings.N8N_URL)
    
    return UserRegisterResponse(
        user_id=user.id,
        email=user.email
    )


# ============================================================================
# LOGIN & OAUTH
# ============================================================================

@router.post(
    "/login",
    response_model=LoginResponse,
    summary="Connexion",
    description="Authentification par email et mot de passe."
)
async def login(
    data: UserLogin,
    db: DBSession,
    client_info: ClientInfo,
    _: Annotated[None, Depends(RateLimiter(max_requests=10, window_seconds=60))]
):
    """Connexion d'un utilisateur."""
    
    # Trouver l'utilisateur
    stmt = select(User).where(User.email == data.email.lower())
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if user is None or user.password_hash is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect"
        )
    
    # Vérifier le mot de passe
    if not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect"
        )
    
    # Vérifier que le compte est actif
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Compte désactivé"
        )
    
    # Générer les tokens
    access_token = create_access_token(subject=str(user.id))
    refresh_token_value = create_refresh_token(subject=str(user.id))
    
    # Stocker le refresh token
    refresh_token = RefreshToken(
        user_id=user.id,
        token_hash=hash_token(refresh_token_value),
        device_info=client_info,
        expires_at=datetime.utcnow() + timedelta(days=30)
    )
    db.add(refresh_token)
    
    # Mettre à jour last_login
    user.last_login_at = datetime.utcnow()
    
    await db.commit()
    
    return LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token_value,
        user=UserBasic(
            id=user.id,
            email=user.email,
            email_verified=user.email_verified,
            is_active=user.is_active
        )
    )

@router.get("/google")
async def google_login():
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "scope": "email profile",
        "response_type": "code",
        "access_type": "offline",
        "prompt":"consent"
    }
    query_string = "&".join(f"{k}={v}" for k, v in params.items())
    google_auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{query_string}"

    return RedirectResponse(google_auth_url)


@router.get("/google/callback")
async def google_callback(code: str, db: DBSession, request: Request):
    # Échanger code contre token Google
    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code"
            }
        )

    token_data = token_response.json()

    if "error" in token_data:
        raise HTTPException(
            status_code=400,
            detail=f"Google OAuth error: {token_data.get('error_description', token_data['error'])}"
        )

    google_token = token_data["access_token"]

    # Obtenir les infos utilisateur
    async with httpx.AsyncClient() as client:
        user_response = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {google_token}"}
        )

    user_info = user_response.json()

    # Trouver ou créer l'utilisateur
    stmt = select(User).where(User.google_id == user_info["id"])
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if user:
        # Compte déjà lié → connexion directe
        tokens : TokenResponse = await generate_and_store_tokens(user, db, request)
        return redirect_with_tokens(tokens)

    # Chercher par email
    stmt = select(User).where(User.email == user_info["email"])
    result = await db.execute(stmt)
    existing_user = result.scalar_one_or_none()

    if existing_user:
        # Email existe mais pas lié à Google
        # → Demander confirmation
        link_token = create_access_token(
            subject=str(existing_user.id),
            expires_delta=timedelta(minutes=15),
            extra_data={
                "google_id": user_info["id"],
                "email": user_info["email"],
                "type": "account_linking"  # Pour savoir quoi faire au retour
            }
        )
        return RedirectResponse(
            f"{settings.FRONTEND_URL}/auth/link-account?token={link_token}"
        )

    user = User(
        email=user_info["email"],
        google_id=user_info["id"],
        email_verified=True,
        email_verified_at=datetime.now(timezone.utc),
        password_hash=None
    )
    db.add(user)
    await db.flush()

    # Créer profil
    profile = UserProfile(
        user_id=user.id,
        display_name=user_info.get("name"),
        avatar_url=user_info.get("picture")
    )
    db.add(profile)

    # Créer crédits
    credits = UserCredits(
        user_id=user.id,
        credits_balance=50,
        bonus_credits=0
    )
    db.add(credits)

    await db.commit()

    # Générer tokens
    tokens = await generate_and_store_tokens(user, db, request)
    return redirect_with_tokens(tokens)


@router.post("/link-account")
async def link_account(
        data:dict[str, None],
        db: DBSession, request: Request,
):
    try:
        link_data = decode_link_token(data.link_token)
    except:
        raise HTTPException(400, "Token de liaison invalide ou expiré")

        # Trouver l'utilisateur
    stmt = select(User).where(User.email == link_data["email"])
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(404, "Utilisateur non trouvé")

    # Vérifier le mot de passe
    if not verify_password(data.password, user.password_hash):
        raise HTTPException(401, "Mot de passe incorrect")

    # Lier le compte Google
    user.google_id = link_data["google_id"]
    await db.commit()

    # Générer tokens
    tokens : TokenResponse = await generate_and_store_tokens(user, db, request)
    return tokens

# ============================================================================
# LOGOUT
# ============================================================================

@router.post(
    "/logout",
    response_model=MessageResponse,
    summary="Déconnexion",
    description="Révoque le refresh token actuel."
)
async def logout(
    db: DBSession,
    data: RefreshTokenRequest
):
    """Déconnexion (révocation du refresh token)."""
    
    # Trouver et révoquer le refresh token
    token_hash = hash_token(data.refresh_token)
    stmt = select(RefreshToken).where(
        RefreshToken.user_id == current_user.id,
        RefreshToken.token_hash == token_hash,
        RefreshToken.revoked_at.is_(None)
    )
    result = await db.execute(stmt)
    refresh_token = result.scalar_one_or_none()

    if not refresh_token:
        return MessageResponse(message="Déconnexion réussie")
    
    if refresh_token:
        refresh_token.revoke()
        await db.commit()
    
    return MessageResponse(message="Déconnexion réussie")


# ============================================================================
# REFRESH TOKEN
# ============================================================================

@router.post(
    "/refresh",
    response_model=TokenResponse,
    summary="Rafraîchir le token",
    description="Obtient un nouveau access token avec le refresh token."
)
async def refresh_token(
    data: RefreshTokenRequest,
    db: DBSession
):
    """Rafraîchit l'access token."""
    
    # Trouver le refresh token
    token_hash = hash_token(data.refresh_token)
    stmt = select(RefreshToken).where(
        RefreshToken.token_hash == token_hash,
        RefreshToken.revoked_at.is_(None)
    )
    result = await db.execute(stmt)
    refresh_token = result.scalar_one_or_none()
    
    if refresh_token is None or not refresh_token.is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token invalide ou expiré"
        )
    
    # Vérifier l'utilisateur
    user = await db.get(User, refresh_token.user_id)
    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Utilisateur non trouvé ou désactivé"
        )
    
    # Générer un nouveau access token
    access_token = create_access_token(user_id=str(user.id))
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=data.refresh_token  # On renvoie le même
    )


# ============================================================================
# EMAIL VERIFICATION
# ============================================================================

@router.post(
    "/verify-email",
    response_model=LoginResponse,
    summary="Vérifier l'email",
    description="Vérifie l'email avec le code à 6 chiffres."
)
async def verify_email(
    data: EmailVerificationRequest,
    db: DBSession,
    client_info: ClientInfo,
    background_tasks: BackgroundTasks,
):
    """Vérifie l'email et retourne les tokens."""
    
    # Trouver l'utilisateur
    stmt = select(User).where(User.email == data.email.lower())
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )
    
    # Trouver le token valide
    stmt = select(EmailVerificationToken).where(
        EmailVerificationToken.user_id == user.id,
        EmailVerificationToken.token == data.code,
        EmailVerificationToken.used_at.is_(None),
        EmailVerificationToken.expires_at > datetime.utcnow()
    )
    result = await db.execute(stmt)
    verification_token = result.scalar_one_or_none()
    
    if verification_token is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Code invalide ou expiré"
        )
    
    # Marquer comme vérifié
    user.email_verified = True
    user.email_verified_at = datetime.utcnow()
    verification_token.used_at = datetime.utcnow()
    
    # Générer les tokens
    access_token = create_access_token(subject=str(user.id))
    refresh_token_value = create_refresh_token(subject=str(user.id))
    
    refresh_token = RefreshToken(
        user_id=user.id,
        token_hash=hash_token(refresh_token_value),
        device_info=client_info,
        expires_at=datetime.utcnow() + timedelta(days=30)
    )
    db.add(refresh_token)
    
    await db.commit()

    stmt = select(UserProfile).where(UserProfile.user_id == user.id)
    result = await db.execute(stmt)
    profile = result.scalar_one_or_none()

    # Envoi de l'email de bienvenue
    # Créer l'évènement pour n8n
    json_data = {
        "event": "EMAIL_VERIFIED",
        "user": {
            "first_name": profile.first_name,
            "email": user.email,
        }
    }

    background_tasks.add_task(send_n8n_webhook, json_data, settings.N8N_URL)
    
    return LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token_value,
        user=UserBasic(
            id=user.id,
            email=user.email,
            email_verified=True,
            is_active=user.is_active
        )
    )


@router.post(
    "/resend-verification",
    response_model=MessageResponse,
    summary="Renvoyer le code",
    description="Renvoie un nouveau code de vérification par email."
)
async def resend_verification(
    data: ResendVerificationRequest,
    db: DBSession,
    background_tasks: BackgroundTasks,
    _: Annotated[None, Depends(RateLimiter(max_requests=3, window_seconds=300))]
):
    """Renvoie le code de vérification."""
    
    stmt = select(User).where(User.email == data.email.lower())
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if user is None:
        # Ne pas révéler si l'email existe
        return MessageResponse(message="Si l'email existe, un code a été envoyé.")
    
    if user.email_verified:
        return MessageResponse(message="Email déjà vérifié.")
    
    # Générer un nouveau code
    verification_code = generate_verification_code()
    verification_token = EmailVerificationToken(
        user_id=user.id,
        token=verification_code,
        expires_at=datetime.utcnow() + timedelta(hours=24)
    )
    db.add(verification_token)
    await db.commit()
    
    # Envoyer l'email
    # Envoi de l'email de bienvenue
    # Créer l'évènement pour n8n
    json_data = {
        "event": "EMAIL_VERIFIED_RESENT_CODE",
        "user": {
            "first_name": profile.first_name,
            "email": user.email,
        }
    }

    background_tasks.add_task(send_n8n_webhook, json_data, settings.N8N_URL)
    
    return MessageResponse(message="Code de vérification envoyé.")


# ============================================================================
# PASSWORD RESET
# ============================================================================

@router.post(
    "/forgot-password",
    response_model=MessageResponse,
    summary="Mot de passe oublié",
    description="Envoie un email de réinitialisation de mot de passe."
)
async def forgot_password(
    data: ForgotPasswordRequest,
    db: DBSession,
    background_tasks: BackgroundTasks,
    _: Annotated[None, Depends(RateLimiter(max_requests=3, window_seconds=300))]
):
    """Demande de réinitialisation de mot de passe."""
    
    stmt = select(User).where(User.email == data.email.lower())
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    # Toujours retourner le même message (sécurité)
    message = "Si l'email existe, un lien de réinitialisation a été envoyé."
    
    if user and user.password_hash:  # Pas pour les comptes OAuth-only
        reset_token = generate_reset_token()
        password_reset = PasswordResetToken(
            user_id=user.id,
            token=reset_token,
            expires_at=datetime.utcnow() + timedelta(hours=1)
        )
        db.add(password_reset)
        await db.commit()
        
        background_tasks.add_task(
            send_password_reset_email,
            email=user.email,
            token=reset_token
        )
    
    return MessageResponse(message=message)


@router.post(
    "/reset-password",
    response_model=MessageResponse,
    summary="Réinitialiser le mot de passe",
    description="Applique le nouveau mot de passe avec le token de reset."
)
async def reset_password(
    data: ResetPasswordRequest,
    db: DBSession
):
    """Réinitialise le mot de passe."""
    
    # Trouver le token
    stmt = select(PasswordResetToken).where(
        PasswordResetToken.token == data.token,
        PasswordResetToken.used_at.is_(None),
        PasswordResetToken.expires_at > datetime.utcnow()
    )
    result = await db.execute(stmt)
    reset_token = result.scalar_one_or_none()
    
    if reset_token is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token invalide ou expiré"
        )
    
    # Mettre à jour le mot de passe
    user = await db.get(User, reset_token.user_id)
    user.password_hash = hash_password(data.new_password)
    reset_token.used_at = datetime.utcnow()
    
    # Révoquer tous les refresh tokens (force reconnexion)
    stmt = select(RefreshToken).where(
        RefreshToken.user_id == user.id,
        RefreshToken.revoked_at.is_(None)
    )
    result = await db.execute(stmt)
    for token in result.scalars():
        token.revoke()
    
    await db.commit()
    
    return MessageResponse(message="Mot de passe mis à jour. Veuillez vous reconnecter.")


# ============================================================================
# GET CURRENT USER
# ============================================================================

@router.get(
    "/me",
    response_model=UserMe,
    summary="Utilisateur courant",
    description="Retourne les informations de l'utilisateur connecté et son étape d'onboarding."
)
async def get_me(
        current_user: CurrentUser,
        db: DBSession
):
    """Obtient les infos de l'utilisateur connecté."""

    # ==========================
    # 1. INFOS DE BASE
    # ==========================
    profile = current_user.profile  # Relation chargée via SQLAlchemy (lazy ou eager)
    has_profile = profile is not None

    # ==========================
    # 2. ABONNEMENT
    # ==========================
    stmt = select(UserSubscription, SubscriptionPlan).join(
        SubscriptionPlan
    ).where(
        UserSubscription.user_id == current_user.id,
        UserSubscription.status == "active"
    )
    result = await db.execute(stmt)
    sub_data = result.first()

    has_subscription = sub_data is not None
    current_plan = sub_data[1].slug if sub_data else "free"

    # ==========================
    # 3. CRÉDITS
    # ==========================
    stmt = select(UserCredits).where(UserCredits.user_id == current_user.id)
    result = await db.execute(stmt)
    credits_obj = result.scalar_one_or_none()
    # J'utilise 'credits_balance' car c'est le nom du champ dans votre modèle UserCredits précédent
    credits_balance = credits_obj.credits_balance if credits_obj else 0

    # ==========================
    # 4. LOGIQUE ONBOARDING
    # ==========================
    onboarding_step = "completed"
    needs_onboarding = False

    if not has_profile or not profile.current_role:
        # ÉTAPE 1 : Pas de profil ou pas de rôle défini
        # (years_of_experience a une valeur par défaut 0, donc on se fie à current_role)
        needs_onboarding = True
        onboarding_step = "step1"

    else:
        # Le profil existe (Step 1 validé).
        # Vérifions si l'étape 3 (Objectifs) a été faite.
        # Note : L'étape 2 (Préférences) modifie le profil existant avec des valeurs par défaut,
        # il est donc difficile de savoir si elle a été "sautée".
        # Par sécurité, si pas d'objectifs, on renvoie vers Step 2 pour suivre le flux.

        # On utilise profile.id car on a fait la migration FK vers profile_id
        stmt_goals = select(UserLearningGoal).where(UserLearningGoal.profile_id == profile.id).limit(1)
        result_goals = await db.execute(stmt_goals)
        has_goals = result_goals.scalar_one_or_none() is not None

        if not has_goals:
            # ÉTAPE 2 (et par extension 3) : Pas d'objectifs trouvés
            needs_onboarding = True
            onboarding_step = "step2"
        else:
            # Les objectifs existent. Vérifions les compétences (Step 4)
            stmt_skills = select(UserSkillLevel).where(UserSkillLevel.user_id == current_user.id).limit(1)
            result_skills = await db.execute(stmt_skills)
            has_skills = result_skills.scalar_one_or_none() is not None

            if not has_skills:
                # ÉTAPE 4 : Pas de compétences initiales
                needs_onboarding = True
                onboarding_step = "step4"
            else:
                # Tout est bon !
                onboarding_step = "completed"
                needs_onboarding = False

    # ==========================
    # 5. RÉPONSE
    # ==========================
    return UserMe(
        id=str(current_user.id),  # Conversion UUID -> str pour Pydantic si nécessaire
        email=current_user.email,
        email_verified=current_user.email_verified,
        is_active=current_user.is_active,
        is_admin=current_user.is_admin,
        google_id=current_user.google_id,
        github_id=current_user.github_id,
        created_at=current_user.created_at,
        last_login_at=current_user.last_login_at,

        has_profile=has_profile,
        has_subscription=has_subscription,
        current_plan=current_plan,
        credits_balance=credits_balance,

        needs_onboarding=needs_onboarding,
        onboarding_step=onboarding_step
    )

# ============================================================================
# CHANGE PASSWORD
# ============================================================================

@router.patch(
    "/me/password",
    response_model=MessageResponse,
    summary="Changer le mot de passe",
    description="Change le mot de passe de l'utilisateur connecté."
)
async def change_password(
    data: ChangePasswordRequest,
    current_user: CurrentUser,
    db: DBSession
):
    """Change le mot de passe."""
    
    if current_user.password_hash is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Compte OAuth sans mot de passe"
        )
    
    if not verify_password(data.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mot de passe actuel incorrect"
        )
    
    current_user.password_hash = hash_password(data.new_password)
    await db.commit()
    
    return MessageResponse(message="Mot de passe mis à jour")


# ============================================================================
# SESSIONS MANAGEMENT
# ============================================================================

@router.get(
    "/me/sessions",
    response_model=SessionListResponse,
    summary="Lister les sessions",
    description="Liste les sessions actives (refresh tokens)."
)
async def list_sessions(
    current_user: CurrentUser,
    db: DBSession,
    request: Request
):
    """Liste les sessions actives."""
    
    stmt = select(RefreshToken).where(
        RefreshToken.user_id == current_user.id,
        RefreshToken.revoked_at.is_(None),
        RefreshToken.expires_at > datetime.utcnow()
    ).order_by(RefreshToken.created_at.desc())
    
    result = await db.execute(stmt)
    tokens = result.scalars().all()
    
    # Déterminer la session actuelle (via le token dans le header)
    # Note: Simplifié ici, en prod on comparerait avec le token actuel
    
    sessions = [
        ActiveSession(
            id=token.id,
            device_info=token.device_info,
            created_at=token.created_at,
            expires_at=token.expires_at,
            is_current=False  # À implémenter correctement
        )
        for token in tokens
    ]
    
    return SessionListResponse(
        sessions=sessions,
        total=len(sessions)
    )


@router.delete(
    "/me/sessions/{session_id}",
    response_model=MessageResponse,
    summary="Révoquer une session",
    description="Révoque une session spécifique."
)
async def revoke_session(
    session_id: UUID,
    current_user: CurrentUser,
    db: DBSession
):
    """Révoque une session."""
    
    stmt = select(RefreshToken).where(
        RefreshToken.id == session_id,
        RefreshToken.user_id == current_user.id,
        RefreshToken.revoked_at.is_(None)
    )
    result = await db.execute(stmt)
    token = result.scalar_one_or_none()
    
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session non trouvée"
        )
    
    token.revoke()
    await db.commit()
    
    return MessageResponse(message="Session révoquée")


# === HELPERS ===

async def generate_and_store_tokens(
        user: User,
        db: AsyncSession,
        request: Request
) -> dict:
    """Génère et stocke les tokens."""
    access_token = create_access_token(str(user.id))
    refresh_token_value = create_refresh_token(str(user.id))

    # Device info
    device_info = {
        "ip": request.client.host if request.client else None,
        "user_agent": request.headers.get("user-agent"),
    }

    # Stocker refresh token
    refresh_token = RefreshToken(
        user_id=user.id,
        token_hash=hash_token(refresh_token_value),
        device_info=device_info,
        expires_at=datetime.utcnow() + timedelta(days=30)
    )
    db.add(refresh_token)
    await db.commit()

    return TokenResponse(access_token=access_token, refresh_token=refresh_token_value)


def redirect_with_tokens(tokens: TokenResponse) -> RedirectResponse:
    """Redirige vers le frontend avec les tokens."""
    base_url = f"{settings.FRONTEND_URL}/auth/success"
    params = {
        "access_token": tokens.access_token,
        "refresh_token": tokens.refresh_token,
        "token_type": "bearer"
    }
    query_string = urllib.parse.urlencode(params)

    final_url = f"{base_url}?{query_string}"

    return RedirectResponse(url=final_url)