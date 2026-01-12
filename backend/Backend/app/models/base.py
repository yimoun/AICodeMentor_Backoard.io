"""
AI Code Mentor - Base SQLAlchemy Configuration
===============================================
Configuration de base pour SQLAlchemy 2.0 avec mixins réutilisables.
"""

from datetime import datetime
from typing import Any
from uuid import uuid4

from sqlalchemy import DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, declared_attr


class Base(DeclarativeBase):
    """
    Classe de base pour tous les modèles SQLAlchemy.
    Utilise le style déclaratif SQLAlchemy 2.0.
    """
    
    # Configuration pour la sérialisation
    def to_dict(self) -> dict[str, Any]:
        """Convertit le modèle en dictionnaire."""
        return {
            column.name: getattr(self, column.name)
            for column in self.__table__.columns
        }
    
    def __repr__(self) -> str:
        """Représentation string du modèle."""
        class_name = self.__class__.__name__
        attrs = ", ".join(
            f"{k}={v!r}" 
            for k, v in self.to_dict().items() 
            if not k.startswith("_")
        )
        return f"{class_name}({attrs})"


class UUIDMixin:
    """
    Mixin pour ajouter un ID UUID comme clé primaire.
    """
    
    id: Mapped[uuid4] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
        index=True
    )


class TimestampMixin:
    """
    Mixin pour ajouter created_at et updated_at automatiques.
    """
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=func.now(),
        nullable=False
    )
    
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=func.now(),
        onupdate=func.now(),
        nullable=False
    )


class SoftDeleteMixin:
    """
    Mixin pour le soft delete (désactivation au lieu de suppression).
    """
    
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)
    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        default=None
    )


class TableNameMixin:
    """
    Mixin pour générer automatiquement le nom de table en snake_case.
    """
    
    @declared_attr.directive
    def __tablename__(cls) -> str:
        """Génère le nom de table à partir du nom de classe."""
        import re
        # CamelCase to snake_case
        name = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', cls.__name__)
        return re.sub('([a-z0-9])([A-Z])', r'\1_\2', name).lower()
