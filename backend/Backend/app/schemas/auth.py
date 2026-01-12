"""
AI Code Mentor - Auth Schemas
=============================
Schemas Pydantic pour l'authentification.
"""

from datetime import datetime
from typing import Optional, Self
from uuid import UUID

from pydantic import model_validator, BaseModel, EmailStr, Field, field_validator

from .base import BaseSchema, IDMixin


# ============================================================================
# REGISTER
# ============================================================================

class UserRegister(BaseSchema):
    """Schema pour l'inscription d'un nouvel utilisateur."""
    first_name: str = Field(
        max_length=100,
        min_length=2,
        description="Prénom"
    )
    last_name: str = Field(
        max_length=100,
        min_length=4,
        description="Nom"
    )
    username: str = Field(
        max_length=100,
        min_length=4,
        description="Nom d'utilisateur"
    )
    email: EmailStr = Field( description="Adresse email valide")
    password: str = Field(
        ...,
        min_length=8,
        max_length=100,
        description="Mot de passe (min 8 caractères)"
    )
    confirmation_password: str = Field(
        ...,
        min_length=8,
        max_length=100,
        description="Confirmation du mot de passe (min 8 caractères)"
    )

    @field_validator("email")
    @classmethod
    def email_to_lower(cls, v: str) -> str:
        return v.lower()

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        """Valide la force du mot de passe."""
        if not any(c.isupper() for c in v):
            raise ValueError("Le mot de passe doit contenir au moins une majuscule")
        if not any(c.islower() for c in v):
            raise ValueError("Le mot de passe doit contenir au moins une minuscule")
        if not any(c.isdigit() for c in v):
            raise ValueError("Le mot de passe doit contenir au moins un chiffre")
        return v

    @model_validator(mode='after')
    def verify_password_match(self) -> Self:
        """Vérifie que les deux mots de passe sont identiques."""
        if self.password != self.confirmation_password:
            raise ValueError("Les mots de passe ne correspondent pas")
        return self


class UserRegisterResponse(BaseSchema):
    """Réponse après inscription."""
    message: str = "Compte créé. Vérifiez votre email."
    user_id: UUID
    email: str


# ============================================================================
# LOGIN
# ============================================================================

class UserLogin(BaseSchema):
    """Schema pour la connexion."""
    email: EmailStr
    password: str


class TokenResponse(BaseSchema):
    """Réponse avec tokens JWT."""
    access_token: str
    refresh_token: str
    token_type: str = "Bearer"
    expires_in: int = Field(
        default=900,
        description="Durée de validité en secondes (15 min)"
    )


class LoginResponse(TokenResponse):
    """Réponse complète après connexion."""
    user: "UserBasic"


# ============================================================================
# TOKEN REFRESH
# ============================================================================

class RefreshTokenRequest(BaseSchema):
    """Requête pour rafraîchir le token."""
    refresh_token: str


# ============================================================================
# EMAIL VERIFICATION
# ============================================================================

class EmailVerificationRequest(BaseSchema):
    """Requête de vérification email."""
    email: EmailStr
    code: str = Field(
        ...,
        min_length=6,
        max_length=6,
        pattern=r"^\d{6}$",
        description="Code à 6 chiffres"
    )


class ResendVerificationRequest(BaseSchema):
    """Requête pour renvoyer le code."""
    email: EmailStr


# ============================================================================
# PASSWORD RESET
# ============================================================================

class ForgotPasswordRequest(BaseSchema):
    """Requête de réinitialisation mot de passe."""
    email: EmailStr


class ResetPasswordRequest(BaseSchema):
    """Requête pour appliquer le nouveau mot de passe."""
    token: str = Field(..., min_length=64, max_length=64)
    new_password: str = Field(..., min_length=8, max_length=100)
    
    @field_validator("new_password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        """Valide la force du mot de passe."""
        if not any(c.isupper() for c in v):
            raise ValueError("Le mot de passe doit contenir au moins une majuscule")
        if not any(c.islower() for c in v):
            raise ValueError("Le mot de passe doit contenir au moins une minuscule")
        if not any(c.isdigit() for c in v):
            raise ValueError("Le mot de passe doit contenir au moins un chiffre")
        return v


class ChangePasswordRequest(BaseSchema):
    """Requête pour changer son mot de passe (connecté)."""
    current_password: str
    new_password: str = Field(..., min_length=8, max_length=100)
    
    @field_validator("new_password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        """Valide la force du mot de passe."""
        if not any(c.isupper() for c in v):
            raise ValueError("Le mot de passe doit contenir au moins une majuscule")
        return v


# ============================================================================
# USER RESPONSES
# ============================================================================

class UserBasic(BaseSchema, IDMixin):
    """Informations basiques de l'utilisateur."""
    email: str
    email_verified: bool
    is_active: bool = True


class UserMe(UserBasic):
    """Profil complet de l'utilisateur connecté."""
    id: str  # ou UUID
    email: str
    email_verified: bool
    is_active: bool
    is_admin: bool
    google_id: Optional[str] = None
    github_id: Optional[str] = None
    created_at: datetime
    last_login_at: Optional[datetime] = None

    # Infos métier
    has_profile: bool
    has_subscription: bool
    current_plan: str
    credits_balance: int

    # Onboarding
    needs_onboarding: bool
    onboarding_step: str


# ============================================================================
# OAUTH
# ============================================================================

class OAuthCallbackData(BaseSchema):
    """Données reçues du callback OAuth."""
    code: str
    state: Optional[str] = None


class OAuthUserInfo(BaseSchema):
    """Infos utilisateur depuis OAuth provider."""
    provider: str  # "google" ou "github"
    provider_id: str
    email: EmailStr
    name: Optional[str] = None
    avatar_url: Optional[str] = None


# ============================================================================
# SESSIONS
# ============================================================================

class ActiveSession(BaseSchema):
    """Session active (refresh token)."""
    id: UUID
    device_info: Optional[dict] = None
    created_at: datetime
    expires_at: datetime
    is_current: bool = False


class SessionListResponse(BaseSchema):
    """Liste des sessions actives."""
    sessions: list[ActiveSession]
    total: int


# Mise à jour des forward references
LoginResponse.model_rebuild()
