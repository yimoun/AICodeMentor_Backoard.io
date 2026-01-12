
from datetime import datetime, timedelta, timezone
from typing import Optional, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel

from app.config.settings import settings
import hashlib
import secrets


# ============================================================
# CONFIGURATION DU HASHING (BCRYPT)
# ============================================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)

# ============================================================
# FONCTIONS DE HASHING DES MOTS DE PASSE
# ============================================================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# ============================================================
# [NOUVEAU] FONCTIONS DE HASHING DES TOKENS OPAQUES
# ============================================================

def hash_token(token: str) -> str:
    """
    Hache un token brut
    """
    return hashlib.sha256(token.encode()).hexdigest()


def generate_random_token(bytes_length: int = 32) -> str:
    return secrets.token_urlsafe(bytes_length)


def verify_token_hash(token: str, hashed_token: str) -> bool:
    """
    Vérifie si un token brut correspond à son hash SHA-256.
    """
    return hash_token(token) == hashed_token


# ============================================================
# MODÈLES PYDANTIC POUR LES TOKENS
# ============================================================

class TokenPayload(BaseModel):
    sub: str  # user_id
    exp: datetime
    iat: datetime
    type: str = "access"


class TokenResponse(BaseModel):
    """
    Réponse retournée lors de la connexion.

    Exemple de réponse JSON:
    {
        "access_token": "eyJhbGciOiJIUzI1NiIs...",
        "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
        "token_type": "bearer"
    }
    """
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


# ============================================================
# CRÉATION DES TOKENS JWT
# ============================================================

def create_access_token(
        subject: str,
        expires_delta: Optional[timedelta] = None,
        extra_data: Optional[dict[str, Any]] = None
) -> str:
    """
    Crée un token d'accès JWT.

    Args:
        subject: L'identifiant de l'utilisateur (généralement user_id)
        expires_delta: Durée de validité personnalisée (optionnel)
        extra_data: Données supplémentaires à inclure dans le payload

    Returns:
        Le token JWT encodé (string)

    Exemple:
        token = create_access_token(subject=str(user.id))
        # Retourne: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

    Le token contient :
        - sub: user_id
        - exp: expiration (maintenant + 30 min par défaut)
        - iat: timestamp de création
        - type: "access"
    """
    # Calcul de l'expiration
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES
        )

    # Construction du payload
    payload = {
        "sub": subject,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "access",
    }

    # Ajout des données supplémentaires si fournies
    if extra_data:
        payload.update(extra_data)

    # Encodage du token
    encoded_jwt = jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )

    return encoded_jwt


def create_refresh_token(
        subject: str,
        expires_delta: Optional[timedelta] = None
) -> str:
    """
    Crée un token de rafraîchissement JWT.

    Le refresh token a une durée de vie plus longue (7 jours par défaut)
    et sert à obtenir un nouveau access token sans re-login.

    Args:
        subject: L'identifiant de l'utilisateur
        expires_delta: Durée de validité personnalisée

    Returns:
        Le refresh token JWT encodé

    Flux de rafraîchissement :
    1. L'access token expire
    2. Le client envoie le refresh token à /api/auth/refresh
    3. Le serveur vérifie le refresh token
    4. Le serveur génère un nouvel access token
    5. L'utilisateur continue sans se reconnecter
    """
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS
        )

    payload = {
        "sub": subject,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "refresh",  # Important pour différencier du access token
    }

    encoded_jwt = jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )

    return encoded_jwt


def create_tokens(user_id: str) -> TokenResponse:
    """
    Crée les deux tokens (access + refresh) en une seule fois.

    Args:
        user_id: L'identifiant de l'utilisateur

    Returns:
        TokenResponse avec access_token et refresh_token

    Exemple:
        tokens = create_tokens(str(user.id))
        return tokens  # Retourne directement comme réponse API
    """
    return TokenResponse(
        access_token=create_access_token(subject=user_id),
        refresh_token=create_refresh_token(subject=user_id),
        token_type="bearer"
    )


# ============================================================
# DÉCODAGE ET VALIDATION DES TOKENS
# ============================================================

def decode_access_token(token: str) -> Optional[TokenPayload]:
    """
    Décode et valide un access token JWT.

    Args:
        token: Le token JWT à décoder

    Returns:
        TokenPayload si le token est valide, None sinon

    Validations effectuées :
    1. Signature valide (non falsifié)
    2. Non expiré
    3. Type = "access"

    Exemple:
        payload = decode_access_token(token)
        if payload:
            user_id = payload.sub
        else:
            raise HTTPException(401, "Token invalide")
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )

        # Vérification du type de token
        if payload.get("type") != "access":
            return None

        # Conversion en Pydantic model pour validation
        token_data = TokenPayload(
            sub=payload.get("sub"),
            exp=datetime.fromtimestamp(payload.get("exp"), tz=timezone.utc),
            iat=datetime.fromtimestamp(payload.get("iat"), tz=timezone.utc),
            type=payload.get("type", "access")
        )

        return token_data

    except JWTError:
        # Token invalide, expiré, ou signature incorrecte
        return None


def decode_refresh_token(token: str) -> Optional[TokenPayload]:
    """
    Décode et valide un refresh token JWT.

    Similaire à decode_access_token mais vérifie que type = "refresh".

    Args:
        token: Le refresh token à décoder

    Returns:
        TokenPayload si valide, None sinon
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )

        # Vérification du type de token
        if payload.get("type") != "refresh":
            return None

        token_data = TokenPayload(
            sub=payload.get("sub"),
            exp=datetime.fromtimestamp(payload.get("exp"), tz=timezone.utc),
            iat=datetime.fromtimestamp(payload.get("iat"), tz=timezone.utc),
            type=payload.get("type")
        )

        return token_data

    except JWTError:
        return None


# ============================================================
# UTILITAIRES SUPPLÉMENTAIRES
# ============================================================

def is_token_expired(token: str) -> bool:
    """
    Vérifie si un token est expiré.

    Args:
        token: Le token JWT à vérifier

    Returns:
        True si expiré ou invalide, False si encore valide
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        exp = datetime.fromtimestamp(payload.get("exp"), tz=timezone.utc)
        return datetime.now(timezone.utc) > exp
    except JWTError:
        return True


def get_token_remaining_time(token: str) -> Optional[timedelta]:
    """
    Retourne le temps restant avant expiration d'un token.

    Args:
        token: Le token JWT

    Returns:
        timedelta du temps restant, ou None si invalide/expiré
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        exp = datetime.fromtimestamp(payload.get("exp"), tz=timezone.utc)
        remaining = exp - datetime.now(timezone.utc)

        if remaining.total_seconds() > 0:
            return remaining
        return None

    except JWTError:
        return None

