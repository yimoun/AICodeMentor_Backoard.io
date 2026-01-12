"""
AI Code Mentor - Pydantic Schemas Base
======================================
Configuration de base pour tous les schemas Pydantic.
"""

from datetime import datetime, date
from typing import Any, Generic, TypeVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field

# Type générique pour la pagination
T = TypeVar("T")


class BaseSchema(BaseModel):
    """
    Schema de base avec configuration commune.
    Tous les schemas héritent de celui-ci.
    """
    model_config = ConfigDict(
        from_attributes=True,  # Permet la conversion depuis SQLAlchemy
        populate_by_name=True,
        str_strip_whitespace=True,
        json_schema_extra={"examples": []},
    )


# ============================================================================
# MIXINS RÉUTILISABLES
# ============================================================================

class IDMixin(BaseModel):
    """Mixin ajoutant un champ ID."""
    id: UUID


class TimestampMixin(BaseModel):
    """Mixin ajoutant les timestamps."""
    created_at: datetime
    updated_at: datetime


# ============================================================================
# RÉPONSES GÉNÉRIQUES
# ============================================================================

class MessageResponse(BaseSchema):
    """Réponse simple avec message."""
    message: str


class ErrorResponse(BaseSchema):
    """Réponse d'erreur standardisée."""
    detail: str
    code: str | None = None




# ============================================================================
# PAGINATION
# ============================================================================

class PaginationParams(BaseSchema):
    """Paramètres de pagination."""
    page: int = Field(default=1, ge=1)
    per_page: int = Field(default=20, ge=1, le=100)

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.per_page


class PaginatedResponse(BaseSchema, Generic[T]):
    """Réponse paginée générique."""
    items: list[T]
    total: int
    page: int
    per_page: int
    total_pages: int
    has_next: bool
    has_prev: bool

    @classmethod
    def create(
            cls,
            items: list[T],
            total: int,
            page: int,
            per_page: int
    ) -> "PaginatedResponse[T]":
        total_pages = (total + per_page - 1) // per_page
        return cls(
            items=items,
            total=total,
            page=page,
            per_page=per_page,
            total_pages=total_pages,
            has_next=page < total_pages,
            has_prev=page > 1
        )


# ============================================================================
# FILTRES ET TRI
# ============================================================================

class SortOrder(BaseSchema):
    """Paramètres de tri."""
    field: str
    direction: str = Field(default="asc", pattern="^(asc|desc)$")


class DateRangeFilter(BaseSchema):
    """Filtre par plage de dates."""
    start_date: date | None = None
    end_date: date | None = None


# ============================================================================
# HEALTH CHECK
# ============================================================================

class HealthCheckResponse(BaseSchema):
    """Réponse du health check."""
    status: str = "healthy"
    version: str
    database: str = "connected"
    timestamp: datetime = Field(default_factory=datetime.utcnow)