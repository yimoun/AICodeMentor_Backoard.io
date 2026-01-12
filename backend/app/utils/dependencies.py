
from typing import Annotated, Optional
from fastapi import Depends, HTTPException, status, Header, Request
from fastapi.security import OAuth2PasswordBearer, HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.config.database import get_db
from app.utils.security import decode_access_token, TokenPayload
from app.models.auth import *
from app.models.billing import *

# ============================================================
# SCHÉMA OAUTH2 - Extraction du token
# ============================================================
"""
OAuth2PasswordBearer est un "security scheme" FastAPI.

fait deux choses :
1. Indique à Swagger/OpenAPI que l'endpoint /api/auth/login 
   est utilisé pour l'authentification
2. Extrait automatiquement le token du header "Authorization: Bearer xxx"

tokenUrl : L'URL où le client peut obtenir un token (pour Swagger UI)
auto_error : Si True, lève une 401 si pas de token. Si False, retourne None.
"""

oauth2_scheme = HTTPBearer()

oauth2_scheme_optional = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login",
    auto_error=False
)


# ============================================================
# DÉPENDANCE : RÉCUPÉRER L'UTILISATEUR COURANT
# ============================================================

async def get_current_user(
        db: Annotated[AsyncSession, Depends(get_db)],
        credentials: HTTPAuthorizationCredentials = Depends(oauth2_scheme)
):
    """
    Récupère l'utilisateur courant à partir du token JWT.

    Cette dépendance :
    1. Extrait le token du header Authorization (via oauth2_scheme)
    2. Décode et valide le JWT
    3. Récupère l'utilisateur depuis la base de données
    4. Retourne l'objet User

    Args:
        token: Le JWT extrait automatiquement du header
        db: La session de base de données

    Returns:
        L'objet User correspondant au token

    Raises:
        HTTPException 401: Si le token est invalide ou l'utilisateur n'existe pas
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Impossible de valider les credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token = credentials.credentials

    # 1. Décoder le token
    payload: Optional[TokenPayload] = decode_access_token(token)

    if payload is None:
        raise credentials_exception

    # 2. Extraire le user_id du payload
    user_id: str = payload.sub

    if user_id is None:
        raise credentials_exception

    # 3. Récupérer l'utilisateur depuis la DB

    from app.models.auth import User
    result = await db.execute(select(User).where(User.id == user_id).options(selectinload(User.profile)))
    user = result.scalar_one_or_none()

    if user is None:
        raise credentials_exception

    return user


async def get_current_active_user(
        current_user: Annotated[dict, Depends(get_current_user)]
):
    """
    Vérifie que l'utilisateur courant est actif.

    Cette dépendance chaîne get_current_user et ajoute
    une vérification supplémentaire.

    Args:
        current_user: L'utilisateur retourné par get_current_user

    Returns:
        L'utilisateur si actif

    Raises:
        HTTPException 403: Si l'utilisateur est désactivé

    """

    # if not current_user.is_active:
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Compte utilisateur désactivé"
        )

    return current_user


async def get_current_user_optional(
        token: Annotated[Optional[str], Depends(oauth2_scheme_optional)],
        db: Annotated[AsyncSession, Depends(get_db)]
) -> Optional[User]:
    """
    Retourne l'utilisateur s'il est connecté, sinon None.
    Ne lève pas d'erreur si le token est absent ou invalide.
    """
    if token is None:
        return None

    try:
        payload = decode_access_token(token)
        if payload is None:
            return None

        user_id = payload.sub

        # Requête
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()

        # On vérifie aussi s'il est actif pour être cohérent
        if user and not user.is_active:
            return None

        return user

    except Exception:
        # En cas d'erreur quelconque (DB, décodage, etc.), on considère l'utilisateur comme invité
        return None

# ============================================================
# DÉPENDANCE : UTILISATEUR VÉRIFIÉ (EMAIL VALIDÉ)
# ============================================================

async def get_current_verified_user(
        current_user: Annotated[User, Depends(get_current_active_user)]
) -> User:
    """
    Vérifie que l'utilisateur a confirmé son adresse email.
    Utile pour empêcher l'accès à certaines fonctionnalités sensibles
    tant que l'email n'est pas validé.
    """
    if not current_user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Veuillez vérifier votre adresse email pour accéder à cette fonctionnalité."
        )
    return current_user

# ============================================================
# DÉPENDANCES DE RÔLES/PERMISSIONS (optionnel mais utile)
# ============================================================

class RoleChecker:
    """
    Vérificateur de rôles réutilisable.

    Permet de créer des dépendances de rôles facilement.

    Usage:
        # Créer les checkers
        require_admin = RoleChecker(["admin"])
        require_instructor = RoleChecker(["admin", "instructor"])

        # Utiliser dans les routes
        @router.delete("/users/{id}")
        async def delete_user(
            user_id: str,
            current_user: User = Depends(require_admin)
        ):
            # Seuls les admins arrivent ici
            ...
    """

    def __init__(self, allowed_roles: list[str]):
        self.allowed_roles = allowed_roles

    async def __call__(
            self,
            current_user: Annotated[dict, Depends(get_current_active_user)]
    ):
        # Note: Adapter selon ton model User
        # user_role = current_user.role
        user_role = current_user.get("role", "user")

        if user_role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Rôle requis: {', '.join(self.allowed_roles)}"
            )

        return current_user


# Instances pré-configurées (à utiliser directement)
require_admin = RoleChecker(["admin"])
require_instructor = RoleChecker(["admin", "instructor"])
require_verified = RoleChecker(["admin", "instructor", "verified_user"])


# ============================================================
# DÉPENDANCES DE PAGINATION
# ============================================================

class PaginationParams:
    """
    Paramètres de pagination réutilisables.

    Usage:
        @router.get("/courses")
        async def list_courses(
            pagination: PaginationParams = Depends()
        ):
            skip = pagination.skip
            limit = pagination.limit
            # Query avec OFFSET et LIMIT
    """

    def __init__(
            self,
            page: int = 1,
            per_page: int = 20,
            max_per_page: int = 100
    ):
        # Validation
        if page < 1:
            page = 1
        if per_page < 1:
            per_page = 20
        if per_page > max_per_page:
            per_page = max_per_page

        self.page = page
        self.per_page = per_page
        self.skip = (page - 1) * per_page
        self.limit = per_page


def get_pagination(
        page: int = 1,
        per_page: int = 20
) -> PaginationParams:
    """
    Fonction de dépendance pour la pagination.

    Alternative à la classe, style fonctionnel.

    Usage:
        @router.get("/users")
        async def list_users(
            pagination: PaginationParams = Depends(get_pagination)
        ):
            ...
    """
    return PaginationParams(page=page, per_page=per_page)


# ============================================================
# DÉPENDANCE : VALIDATION D'ID
# ============================================================

from uuid import UUID


async def validate_uuid(id: str) -> UUID:
    """
    Valide qu'un ID est un UUID valide avec un message d'erreur.
    """
    try:
        return UUID(id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"ID invalide: {id}. Doit être un UUID valide."
        )


# ============================================================
# TYPES ANNOTÉS POUR SIMPLIFIER L'USAGE
# ============================================================
"""
Ces types annotés permettent d'écrire plus simplement les routes.

Au lieu de:
    async def route(user: User = Depends(get_current_user)):

Tu peux écrire:
    async def route(user: CurrentUser):
"""

# Utilisateur courant (doit être connecté)
CurrentUser = Annotated[dict, Depends(get_current_user)]

# Utilisateur actif (connecté ET is_active=True)
CurrentActiveUser = Annotated[dict, Depends(get_current_active_user)]

# Utilisateur actif, connecté et vérifié
VerifiedUser = Annotated[dict, Depends(get_current_verified_user)]

# Utilisateur optionnel (peut être None)
OptionalUser = Annotated[Optional[dict], Depends(get_current_user_optional)]

# Session de base de données
DBSession = Annotated[AsyncSession, Depends(get_db)]

# Pagination
Pagination = Annotated[PaginationParams, Depends(get_pagination)]


# ============================================================================
# SUBSCRIPTION & PLAN CHECKS
# ============================================================================

class PlanChecker:
    """
    Dépendance paramétrable pour vérifier le plan de l'utilisateur.

    Usage:
        @router.get("/premium-feature")
        async def premium_feature(user: CurrentUser, _: Annotated[None, Depends(PlanChecker(["pro", "enterprise"]))]):
            ...
    """

    def __init__(self, allowed_plans: list[str]):
        self.allowed_plans = allowed_plans

    async def __call__(self, current_user: CurrentUser, db: DBSession) -> None:
        # Récupérer l'abonnement actif
        from sqlalchemy import select

        stmt = select(UserSubscription).where(
            UserSubscription.user_id == current_user.id,
            UserSubscription.status == "active"
        )
        result = await db.execute(stmt)
        subscription = result.scalar_one_or_none()

        if subscription is None:
            # Plan gratuit par défaut
            if "free" not in self.allowed_plans:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Cette fonctionnalité nécessite un plan: {', '.join(self.allowed_plans)}",
                )
        else:
            # Vérifier le plan
            plan = await db.get(subscription.plan_id)
            if plan.slug not in self.allowed_plans:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Cette fonctionnalité nécessite un plan: {', '.join(self.allowed_plans)}",
                )


# Shortcuts pour les checks de plan courants
RequiresPro = Depends(PlanChecker(["pro", "enterprise"]))
RequiresEnterprise = Depends(PlanChecker(["enterprise"]))
RequiresPaid = Depends(PlanChecker(["starter", "pro", "enterprise"]))


# ============================================================================
# CREDITS CHECK
# ============================================================================

class CreditsChecker:
    """
    Dépendance pour vérifier que l'utilisateur a assez de crédits.

    Usage:
        @router.post("/use-credits")
        async def use_credits(user: CurrentUser, _: Annotated[None, Depends(CreditsChecker(10))]):
            ...
    """

    def __init__(self, required_credits: int):
        self.required_credits = required_credits

    async def __call__(self, current_user: CurrentUser, db: DBSession) -> UserCredits:
        from sqlalchemy import select

        stmt = select(UserCredits).where(UserCredits.user_id == current_user.id)
        result = await db.execute(stmt)
        credits = result.scalar_one_or_none()

        if credits is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Aucun crédit disponible",
            )

        if not credits.can_afford(self.required_credits):
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail=f"Crédits insuffisants. Requis: {self.required_credits}, Disponible: {credits.total_available}",
            )

        return credits


# ============================================================================
# RATE LIMITING
# ============================================================================

class RateLimiter:
    """
    Dépendance simple de rate limiting (en mémoire).
    Pour la production, utiliser Redis.

    Usage:
        @router.post("/send-email")
        async def send_email(_: Annotated[None, Depends(RateLimiter(max_requests=5, window_seconds=60))]):
            ...
    """

    # Stockage en mémoire (pour dev uniquement)
    _requests: dict[str, list[datetime]] = {}

    def __init__(self, max_requests: int = 10, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds

    async def __call__(self, request: Request) -> None:
        # Identifier le client (IP ou user_id si authentifié)
        client_ip = request.client.host if request.client else "unknown"
        key = f"rate_limit:{client_ip}"

        now = datetime.utcnow()
        window_start = now.timestamp() - self.window_seconds

        # Nettoyer les anciennes requêtes
        if key in self._requests:
            self._requests[key] = [
                req_time for req_time in self._requests[key]
                if req_time.timestamp() > window_start
            ]
        else:
            self._requests[key] = []

        # Vérifier la limite
        if len(self._requests[key]) >= self.max_requests:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Trop de requêtes. Réessayez dans {self.window_seconds} secondes.",
            )

        # Enregistrer la requête
        self._requests[key].append(now)


# ============================================================================
# REQUEST CONTEXT
# ============================================================================

async def get_client_info(request: Request) -> dict:
    """
    Récupère les informations du client (IP, User-Agent).
    """
    return {
        "ip_address": request.client.host if request.client else None,
        "user_agent": request.headers.get("user-agent"),
        "origin": request.headers.get("origin"),
    }


ClientInfo = Annotated[dict, Depends(get_client_info)]
