"""
AI Code Mentor - Badges Models
==============================
Modèles pour les badges, certifications et gamification.
"""

from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING, Optional, Any
from uuid import UUID
import hashlib
import secrets

from sqlalchemy import (
    Boolean, DateTime, ForeignKey, Integer, 
    Numeric, String, Text, func, Index, UniqueConstraint
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, UUIDMixin
from .enums import BadgeCategoryEnum, LevelEnum

if TYPE_CHECKING:
    from .auth import User
    from .skills import Skill


class Badge(Base, UUIDMixin):
    """
    Définition des badges disponibles.
    Les badges sont décernés automatiquement selon les critères.
    """
    
    __tablename__ = "badges"
    
    # ===== Identification =====
    slug: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
        index=True
    )
    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    
    # ===== Affichage =====
    icon: Mapped[Optional[str]] = mapped_column(
        String(50),  # Emoji
        nullable=True
    )
    color: Mapped[Optional[str]] = mapped_column(
        String(7),  # Hex color
        nullable=True
    )
    
    # ===== Catégorie =====
    category: Mapped[BadgeCategoryEnum] = mapped_column(
        nullable=False,
        index=True
    )
    
    # ===== Critères d'obtention =====
    criteria: Mapped[dict] = mapped_column(
        JSONB,
        nullable=False
    )
    # Structures possibles:
    # {"type": "streak", "value": 7}
    # {"type": "questions_asked", "value": 50}
    # {"type": "skill_level", "skill": "python", "level": "intermediate"}
    # {"type": "xp_total", "value": 1000}
    # {"type": "skills_count", "value": 5}
    # {"type": "ranking", "percentile": 1}
    # {"type": "no_hints_streak", "value": 10}
    # {"type": "special", "condition": "registration_before_launch"}
    
    # ===== Récompense =====
    xp_reward: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    
    # ===== Rareté =====
    is_rare: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )
    is_secret: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )
    
    # ===== Statut =====
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )
    
    # ===== Timestamps =====
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=func.now(),
        nullable=False
    )
    
    # ===== Relations =====
    user_badges: Mapped[list["UserBadge"]] = relationship(
        "UserBadge",
        back_populates="badge"
    )
    
    @property
    def criteria_type(self) -> str:
        """Retourne le type de critère."""
        return self.criteria.get("type", "unknown")
    
    @property
    def target_value(self) -> Optional[int]:
        """Retourne la valeur cible du critère."""
        return self.criteria.get("value")
    
    def check_criteria(self, user_data: dict[str, Any]) -> tuple[bool, Optional[dict]]:
        """
        Vérifie si l'utilisateur remplit les critères.
        
        Args:
            user_data: Données de l'utilisateur pour vérification
            
        Returns:
            Tuple (is_earned, progress_data)
        """
        criteria_type = self.criteria_type
        
        if criteria_type == "streak":
            current = user_data.get("current_streak", 0)
            target = self.target_value
            return (current >= target, {"current": current, "target": target})
        
        elif criteria_type == "questions_asked":
            current = user_data.get("questions_asked", 0)
            target = self.target_value
            return (current >= target, {"current": current, "target": target})
        
        elif criteria_type == "xp_total":
            current = user_data.get("total_xp", 0)
            target = self.target_value
            return (current >= target, {"current": current, "target": target})
        
        elif criteria_type == "skills_count":
            current = user_data.get("skills_count", 0)
            target = self.target_value
            return (current >= target, {"current": current, "target": target})
        
        elif criteria_type == "skill_level":
            skill_slug = self.criteria.get("skill")
            required_level = self.criteria.get("level")
            user_skills = user_data.get("skill_levels", {})
            user_level = user_skills.get(skill_slug)
            
            level_order = ["beginner", "intermediate", "advanced", "expert"]
            if user_level:
                return (
                    level_order.index(user_level) >= level_order.index(required_level),
                    None
                )
            return (False, None)
        
        elif criteria_type == "ranking":
            percentile = self.criteria.get("percentile")
            user_percentile = user_data.get("ranking_percentile")
            return (user_percentile and user_percentile <= percentile, None)
        
        return (False, None)


class UserBadge(Base, UUIDMixin):
    """
    Badges obtenus par les utilisateurs.
    """
    
    __tablename__ = "user_badges"
    
    # ===== Clés étrangères =====
    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    badge_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("badges.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    # ===== Date d'obtention =====
    earned_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=func.now(),
        nullable=False
    )
    
    # ===== Progression (pour badges non encore obtenus) =====
    progress: Mapped[Optional[dict]] = mapped_column(
        JSONB,
        nullable=True
    )
    # Structure: {"current": 7, "target": 30}
    
    # ===== Mise en avant =====
    is_featured: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )
    
    # ===== Notification =====
    notification_seen: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )
    
    # ===== Relations =====
    user: Mapped["User"] = relationship(
        "User",
        back_populates="badges"
    )
    badge: Mapped["Badge"] = relationship(
        "Badge",
        back_populates="user_badges"
    )
    
    # ===== Contraintes =====
    __table_args__ = (
        UniqueConstraint("user_id", "badge_id", name="unique_user_badge"),
        Index("idx_user_badges_featured", "is_featured"),
    )
    
    @property
    def is_earned(self) -> bool:
        """Vérifie si le badge est obtenu (earned_at != NULL)."""
        return self.earned_at is not None
    
    @property
    def progress_percentage(self) -> Optional[float]:
        """Calcule le pourcentage de progression."""
        if not self.progress:
            return None
        current = self.progress.get("current", 0)
        target = self.progress.get("target", 1)
        return min((current / target) * 100, 100)
    
    def update_progress(self, current: int, target: int) -> None:
        """Met à jour la progression."""
        self.progress = {"current": current, "target": target}
    
    def mark_as_earned(self) -> None:
        """Marque le badge comme obtenu."""
        self.earned_at = datetime.utcnow()
        self.progress = None
    
    def mark_seen(self) -> None:
        """Marque la notification comme vue."""
        self.notification_seen = True
    
    def toggle_featured(self) -> None:
        """Toggle la mise en avant."""
        self.is_featured = not self.is_featured


class SkillCertification(Base, UUIDMixin):
    """
    Certifications de compétence vérifiables.
    Générées après réussite d'un test de niveau.
    """
    
    __tablename__ = "skill_certifications"
    
    # ===== Clés étrangères =====
    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    skill_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("skills.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    # ===== Niveau certifié =====
    level: Mapped[LevelEnum] = mapped_column(
        nullable=False
    )
    
    # ===== Score =====
    score: Mapped[Decimal] = mapped_column(
        Numeric(5, 2),
        nullable=False
    )
    
    # ===== Topics =====
    topics_passed: Mapped[list[str]] = mapped_column(
        ARRAY(String),
        default=[],
        nullable=False
    )
    topics_partial: Mapped[list[str]] = mapped_column(
        ARRAY(String),
        default=[],
        nullable=False
    )
    topics_failed: Mapped[list[str]] = mapped_column(
        ARRAY(String),
        default=[],
        nullable=False
    )
    
    # ===== Numéro unique =====
    cert_number: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
        index=True
    )
    # Format: ACM-PY-2025-7842
    
    # ===== Validité =====
    issued_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=func.now(),
        nullable=False
    )
    expires_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    
    # ===== Visibilité =====
    is_public: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )
    
    # ===== Vérification =====
    verification_hash: Mapped[Optional[str]] = mapped_column(
        String(64),
        nullable=True
    )
    
    # ===== Relations =====
    user: Mapped["User"] = relationship(
        "User",
        back_populates="certifications"
    )
    skill: Mapped["Skill"] = relationship(
        "Skill",
        back_populates="certifications"
    )
    
    # ===== Contraintes =====
    __table_args__ = (
        UniqueConstraint("user_id", "skill_id", "level", name="unique_user_skill_level"),
    )
    
    @property
    def is_valid(self) -> bool:
        """Vérifie si la certification est encore valide."""
        if self.expires_at is None:
            return True
        return self.expires_at > datetime.utcnow()
    
    @property
    def level_display(self) -> str:
        """Retourne le niveau formaté."""
        level_names = {
            LevelEnum.BEGINNER: "Débutant",
            LevelEnum.INTERMEDIATE: "Intermédiaire",
            LevelEnum.ADVANCED: "Avancé",
            LevelEnum.EXPERT: "Expert"
        }
        return level_names.get(self.level, self.level.value)
    
    @property
    def verification_url(self) -> str:
        """Retourne l'URL de vérification."""
        return f"https://aicodementor.io/verify/{self.cert_number}"
    
    @staticmethod
    def generate_cert_number(skill_slug: str) -> str:
        """
        Génère un numéro de certificat unique.
        Format: ACM-XX-YYYY-NNNN
        """
        prefix = skill_slug[:2].upper()
        year = datetime.now().year
        random_part = secrets.randbelow(10000)
        return f"ACM-{prefix}-{year}-{random_part:04d}"
    
    def generate_verification_hash(self) -> str:
        """
        Génère un hash de vérification pour le QR code.
        """
        data = f"{self.cert_number}:{self.user_id}:{self.skill_id}:{self.score}"
        self.verification_hash = hashlib.sha256(data.encode()).hexdigest()
        return self.verification_hash
    
    def verify(self, hash_to_verify: str) -> bool:
        """Vérifie un hash de certification."""
        return self.verification_hash == hash_to_verify
    
    @classmethod
    def create(
        cls,
        user_id: UUID,
        skill_id: UUID,
        skill_slug: str,
        level: LevelEnum,
        score: float,
        topics_passed: list[str],
        topics_partial: list[str] = None,
        topics_failed: list[str] = None
    ) -> "SkillCertification":
        """Factory pour créer une certification."""
        cert = cls(
            user_id=user_id,
            skill_id=skill_id,
            level=level,
            score=Decimal(str(score)),
            topics_passed=topics_passed,
            topics_partial=topics_partial or [],
            topics_failed=topics_failed or [],
            cert_number=cls.generate_cert_number(skill_slug)
        )
        cert.generate_verification_hash()
        return cert
    
    def to_public_dict(self) -> dict[str, Any]:
        """Retourne les données publiques pour le profil."""
        return {
            "cert_number": self.cert_number,
            "skill_id": str(self.skill_id),
            "level": self.level.value,
            "level_display": self.level_display,
            "score": float(self.score),
            "topics_passed": self.topics_passed,
            "issued_at": self.issued_at.isoformat(),
            "is_valid": self.is_valid,
            "verification_url": self.verification_url
        }
