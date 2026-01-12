

from app.utils.security import (
    # Hashing
    hash_password,
    verify_password,
    # Tokens
    create_access_token,
    create_refresh_token,
    create_tokens,
    decode_access_token,
    decode_refresh_token,
    # Utilitaires
    is_token_expired,
    get_token_remaining_time,
    # Models
    TokenPayload,
    TokenResponse,
)

from app.utils.dependencies import (
    # Schémas OAuth2
    oauth2_scheme,
    oauth2_scheme_optional,
    # Dépendances utilisateur
    get_current_user,
    get_current_active_user,
    get_current_user_optional,
    # Rôles
    RoleChecker,
    require_admin,
    require_instructor,
    require_verified,
    # Pagination
    PaginationParams,
    get_pagination,
    # UUID
    validate_uuid,
    # Types annotés (raccourcis)
    CurrentUser,
    CurrentActiveUser,
    OptionalUser,
    DBSession,
    Pagination,
)

__all__ = [
    # Security - Hashing
    "hash_password",
    "verify_password",
    # Security - Tokens
    "create_access_token",
    "create_refresh_token",
    "create_tokens",
    "decode_access_token",
    "decode_refresh_token",
    "is_token_expired",
    "get_token_remaining_time",
    "TokenPayload",
    "TokenResponse",
    # Dependencies - OAuth2
    "oauth2_scheme",
    "oauth2_scheme_optional",
    # Dependencies - User
    "get_current_user",
    "get_current_active_user",
    "get_current_user_optional",
    # Dependencies - Roles
    "RoleChecker",
    "require_admin",
    "require_instructor",
    "require_verified",
    # Dependencies - Pagination
    "PaginationParams",
    "get_pagination",
    # Dependencies - Validation
    "validate_uuid",
    # Type aliases
    "CurrentUser",
    "CurrentActiveUser",
    "OptionalUser",
    "DBSession",
    "Pagination",
]