"""
AI Code Mentor - Skills Models
==============================
Modèles pour le catalogue de compétences, prérequis et topics.
"""

from datetime import datetime
from typing import TYPE_CHECKING, Optional
from uuid import UUID

from sqlalchemy import (
    Boolean, DateTime, ForeignKey, Integer, 
    String, Text, func, Index, UniqueConstraint
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, UUIDMixin, TimestampMixin
from .enums import SkillTypeEnum, PrerequisiteImportanceEnum, LevelEnum, DifficultyEnum

if TYPE_CHECKING:
    from .progress import UserSkillLevel, UserTopicMastery
    from .mentoring import MentoringSession
    from .badges import SkillCertification
    from .questions import QuestionTopic


class SkillCategory(Base, UUIDMixin):
    """
    Catégories de compétences.
    Ex: Langages, Frameworks Frontend, Frameworks Backend, etc.
    """
    
    __tablename__ = "skill_categories"
    
    # ===== Identification =====
    name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False
    )
    slug: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True
    )
    
    # ===== Affichage =====
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    icon: Mapped[Optional[str]] = mapped_column(
        String(50),  # Emoji
        nullable=True
    )
    display_order: Mapped[int] = mapped_column(
        Integer,
        default=0,
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
    skills: Mapped[list["Skill"]] = relationship(
        "Skill",
        back_populates="category",
        order_by="Skill.name"
    )


class Skill(Base, UUIDMixin, TimestampMixin):
    """
    Compétences (langages, frameworks, outils).
    CRUCIAL: Distinction via skill_type entre language, framework, etc.
    """
    
    __tablename__ = "skills"
    
    # ===== Clé étrangère =====
    category_id: Mapped[Optional[UUID]] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("skill_categories.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    
    # ===== Identification =====
    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )
    slug: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True
    )
    
    # ===== Type (CRUCIAL pour prérequis) =====
    type: Mapped[SkillTypeEnum] = mapped_column(
        nullable=False,
        index=True
    )
    
    # ===== Affichage =====
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    icon: Mapped[Optional[str]] = mapped_column(
        String(50),  # Emoji
        nullable=True
    )
    color: Mapped[Optional[str]] = mapped_column(
        String(7),  # Hex color #RRGGBB
        nullable=True
    )
    
    # ===== Difficulté de base =====
    difficulty_base: Mapped[LevelEnum] = mapped_column(
        default=LevelEnum.BEGINNER,
        nullable=False
    )
    
    # ===== Statistiques =====
    learners_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    
    # ===== Statut =====
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )
    is_featured: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )
    
    # ===== Métadonnées =====
    metadata_json: Mapped[dict] = mapped_column(
        "metadata",
        JSONB,
        default={},
        nullable=False
    )
    # Structure: {"docs_url": "...", "official_site": "...", "version": "..."}
    
    # ===== Relations =====
    category: Mapped[Optional["SkillCategory"]] = relationship(
        "SkillCategory",
        back_populates="skills"
    )
    
    # Prérequis (ce skill REQUIERT ces autres skills)
    prerequisites: Mapped[list["SkillPrerequisite"]] = relationship(
        "SkillPrerequisite",
        back_populates="skill",
        foreign_keys="SkillPrerequisite.skill_id",
        cascade="all, delete-orphan"
    )
    
    # Skills qui requièrent celui-ci
    required_by: Mapped[list["SkillPrerequisite"]] = relationship(
        "SkillPrerequisite",
        back_populates="prerequisite_skill",
        foreign_keys="SkillPrerequisite.prerequisite_skill_id"
    )
    
    # Topics de ce skill
    skill_topics: Mapped[list["SkillTopic"]] = relationship(
        "SkillTopic",
        back_populates="skill",
        cascade="all, delete-orphan"
    )
    
    # Niveaux des utilisateurs
    user_levels: Mapped[list["UserSkillLevel"]] = relationship(
        "UserSkillLevel",
        back_populates="skill"
    )
    
    # Sessions de mentorat
    mentoring_sessions: Mapped[list["MentoringSession"]] = relationship(
        "MentoringSession",
        back_populates="skill"
    )
    
    # Certifications
    certifications: Mapped[list["SkillCertification"]] = relationship(
        "SkillCertification",
        back_populates="skill"
    )
    
    # ===== Index =====
    __table_args__ = (
        Index("idx_skills_type", "type"),
    )
    
    @property
    def has_prerequisites(self) -> bool:
        """Vérifie si le skill a des prérequis."""
        return len(self.prerequisites) > 0
    
    @property
    def required_prerequisites(self) -> list["SkillPrerequisite"]:
        """Retourne uniquement les prérequis obligatoires."""
        return [
            p for p in self.prerequisites 
            if p.importance == PrerequisiteImportanceEnum.REQUIRED
        ]
    
    def increment_learners(self) -> None:
        """Incrémente le compteur d'apprenants."""
        self.learners_count += 1
    
    def decrement_learners(self) -> None:
        """Décrémente le compteur d'apprenants."""
        if self.learners_count > 0:
            self.learners_count -= 1


class SkillPrerequisite(Base, UUIDMixin):
    """
    Prérequis entre compétences.
    Ex: React REQUIERT JavaScript (niveau intermédiaire).
    """
    
    __tablename__ = "skill_prerequisites"
    
    # ===== Clés étrangères =====
    skill_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("skills.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    prerequisite_skill_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("skills.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    # ===== Importance =====
    importance: Mapped[PrerequisiteImportanceEnum] = mapped_column(
        default=PrerequisiteImportanceEnum.REQUIRED,
        nullable=False
    )
    
    # ===== Niveau minimum requis =====
    min_level: Mapped[LevelEnum] = mapped_column(
        default=LevelEnum.BEGINNER,
        nullable=False
    )
    
    # ===== Timestamps =====
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=func.now(),
        nullable=False
    )
    
    # ===== Relations =====
    skill: Mapped["Skill"] = relationship(
        "Skill",
        back_populates="prerequisites",
        foreign_keys=[skill_id]
    )
    prerequisite_skill: Mapped["Skill"] = relationship(
        "Skill",
        back_populates="required_by",
        foreign_keys=[prerequisite_skill_id]
    )
    
    # ===== Contraintes =====
    __table_args__ = (
        UniqueConstraint("skill_id", "prerequisite_skill_id", name="unique_prerequisite"),
        Index("idx_skill_prereqs_skill", "skill_id"),
        Index("idx_skill_prereqs_prereq", "prerequisite_skill_id"),
    )


class Topic(Base, UUIDMixin):
    """
    Topics = sous-sujets granulaires.
    Ex: "async/await" dans Python, "Hooks" dans React.
    """
    
    __tablename__ = "topics"
    
    # ===== Identification =====
    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )
    slug: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True
    )
    
    # ===== Description =====
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    
    # ===== Apprentissage =====
    learning_order: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    difficulty: Mapped[DifficultyEnum] = mapped_column(
        default=DifficultyEnum.MEDIUM,
        nullable=False
    )
    estimated_time_minutes: Mapped[int] = mapped_column(
        Integer,
        default=30,
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
    skill_topics: Mapped[list["SkillTopic"]] = relationship(
        "SkillTopic",
        back_populates="topic",
        cascade="all, delete-orphan"
    )
    question_topics: Mapped[list["QuestionTopic"]] = relationship(
        "QuestionTopic",
        back_populates="topic"
    )
    user_masteries: Mapped[list["UserTopicMastery"]] = relationship(
        "UserTopicMastery",
        back_populates="topic"
    )


class SkillTopic(Base, UUIDMixin):
    """
    Association Many-to-Many entre Skills et Topics.
    Un topic peut appartenir à plusieurs skills.
    """
    
    __tablename__ = "skill_topics"
    
    # ===== Clés étrangères =====
    skill_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("skills.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    topic_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("topics.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    # ===== Ordre dans ce skill =====
    order_in_skill: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    
    # ===== Core topic =====
    is_core: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )
    # is_core = True: Topic fondamental (obligatoire pour certification)
    # is_core = False: Topic avancé (optionnel)
    
    # ===== Relations =====
    skill: Mapped["Skill"] = relationship(
        "Skill",
        back_populates="skill_topics"
    )
    topic: Mapped["Topic"] = relationship(
        "Topic",
        back_populates="skill_topics"
    )
    
    # ===== Contraintes =====
    __table_args__ = (
        UniqueConstraint("skill_id", "topic_id", name="unique_skill_topic"),
    )
