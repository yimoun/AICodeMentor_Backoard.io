"""
AI Code Mentor - Progress Models
================================
Modèles pour la progression utilisateur (niveaux et maîtrise).
"""

from datetime import datetime, date
from decimal import Decimal
from typing import TYPE_CHECKING, Optional
from uuid import UUID

from sqlalchemy import (
    Boolean, Date, DateTime, ForeignKey, Integer, 
    Numeric, func, Index, UniqueConstraint
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, UUIDMixin, TimestampMixin
from .enums import LevelEnum

if TYPE_CHECKING:
    from .auth import User
    from .skills import Skill, Topic

from app.services import *

class UserSkillLevel(Base, UUIDMixin, TimestampMixin):
    """
    Niveau de l'utilisateur pour chaque compétence (vue MACRO).
    Ex: Python - Intermédiaire, 650 XP, confiance 72%
    """
    
    __tablename__ = "user_skill_levels"
    
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
    
    # ===== Niveau actuel =====
    current_level: Mapped[LevelEnum] = mapped_column(
        default=LevelEnum.BEGINNER,
        nullable=False,
        index=True
    )
    
    # ===== Points d'expérience =====
    xp_points: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    
    # ===== Score de confiance (0-100) =====
    confidence_score: Mapped[Decimal] = mapped_column(
        Numeric(5, 2),
        default=0,
        nullable=False
    )
    
    # ===== Streak spécifique au skill =====
    streak_days: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    last_practiced_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    
    # ===== Dernier test de niveau =====
    assessment_score: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(5, 2),
        nullable=True
    )
    assessment_date: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    
    # ===== Timestamps =====
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=func.now(),
        nullable=False
    )
    
    # ===== Relations =====
    user: Mapped["User"] = relationship(
        "User",
        back_populates="skill_levels"
    )
    skill: Mapped["Skill"] = relationship(
        "Skill",
        back_populates="user_levels"
    )
    
    # ===== Contraintes =====
    __table_args__ = (
        UniqueConstraint("user_id", "skill_id", name="unique_user_skill"),
        Index("idx_user_skills_level", "current_level"),
    )
    
    # ===== XP requis par niveau =====
    XP_REQUIREMENTS = {
        LevelEnum.BEGINNER: 0,
        LevelEnum.INTERMEDIATE: 500,
        LevelEnum.ADVANCED: 1500,
        LevelEnum.EXPERT: 3500,
    }
    
    @property
    def xp_for_current_level(self) -> int:
        """XP requis pour le niveau actuel."""
        return self.XP_REQUIREMENTS[self.current_level]
    
    @property
    def xp_for_next_level(self) -> Optional[int]:
        """XP requis pour le niveau suivant."""
        levels = list(LevelEnum)
        current_idx = levels.index(self.current_level)
        if current_idx < len(levels) - 1:
            next_level = levels[current_idx + 1]
            return self.XP_REQUIREMENTS[next_level]
        return None  # Déjà au max
    
    @property
    def xp_progress_percentage(self) -> float:
        """Pourcentage de progression vers le niveau suivant."""
        next_xp = self.xp_for_next_level
        if next_xp is None:
            return 100.0
        
        current_xp = self.xp_for_current_level
        progress = (self.xp_points - current_xp) / (next_xp - current_xp)
        return min(max(progress * 100, 0), 100)
    
    def add_xp(self, amount: int) -> bool:
        """
        Ajoute de l'XP et vérifie le level up.
        Retourne True si level up.
        """
        self.xp_points += amount
        
        # Vérifier level up
        next_xp = self.xp_for_next_level
        if next_xp and self.xp_points >= next_xp:
            return self._level_up()
        return False
    
    def _level_up(self) -> bool:
        """Passe au niveau suivant."""
        levels = list(LevelEnum)
        current_idx = levels.index(self.current_level)
        if current_idx < len(levels) - 1:
            self.current_level = levels[current_idx + 1]
            return True
        return False
    
    def update_confidence(self, new_score: float) -> None:
        """Met à jour le score de confiance (moyenne pondérée)."""
        if self.confidence_score == 0:
            self.confidence_score = Decimal(str(new_score))
        else:
            # Moyenne pondérée (nouveau score compte 30%)
            weighted = float(self.confidence_score) * 0.7 + new_score * 0.3
            self.confidence_score = Decimal(str(round(weighted, 2)))


class UserTopicMastery(Base, UUIDMixin):
    """
    Maîtrise par topic (vue MICRO).
    Permet le spaced repetition et l'identification des faiblesses.
    """
    
    __tablename__ = "user_topic_mastery"
    
    # ===== Clés étrangères =====
    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    topic_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("topics.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    skill_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("skills.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    # ===== Score de maîtrise (0-100) =====
    mastery_score: Mapped[Decimal] = mapped_column(
        Numeric(5, 2),
        default=0,
        nullable=False
    )
    
    # ===== Compteurs =====
    times_practiced: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    times_correct: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    times_incorrect: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    
    # ===== Spaced Repetition (Algorithme SM-2) =====
    needs_review: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )
    next_review_date: Mapped[Optional[date]] = mapped_column(
        Date,
        nullable=True
    )
    ease_factor: Mapped[Decimal] = mapped_column(
        Numeric(3, 2),
        default=Decimal("2.5"),
        nullable=False
    )
    interval_days: Mapped[int] = mapped_column(
        Integer,
        default=1,
        nullable=False
    )
    
    # ===== Timestamps =====
    first_seen_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=func.now(),
        nullable=False
    )
    last_practiced_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    mastered_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    
    # ===== Relations =====
    user: Mapped["User"] = relationship(
        "User",
        back_populates="topic_masteries"
    )
    topic: Mapped["Topic"] = relationship(
        "Topic",
        back_populates="user_masteries"
    )
    skill: Mapped["Skill"] = relationship("Skill")
    
    # ===== Contraintes =====
    __table_args__ = (
        UniqueConstraint("user_id", "topic_id", "skill_id", name="unique_user_topic"),
        Index("idx_user_topics_review", "needs_review", "next_review_date"),
    )
    
    # ===== Seuils =====
    MASTERY_THRESHOLD = 80  # Score pour considérer un topic "maîtrisé"
    WEAK_THRESHOLD = 50     # Score en-dessous duquel le topic est "faible"
    
    @property
    def is_mastered(self) -> bool:
        """Vérifie si le topic est maîtrisé."""
        return float(self.mastery_score) >= self.MASTERY_THRESHOLD
    
    @property
    def is_weak(self) -> bool:
        """Vérifie si le topic est faible."""
        return float(self.mastery_score) < self.WEAK_THRESHOLD
    
    @property
    def status(self) -> str:
        """Retourne le statut du topic."""
        score = float(self.mastery_score)
        if score >= 90:
            return "excellent"
        elif score >= 80:
            return "mastered"
        elif score >= 65:
            return "learning"
        elif score >= 50:
            return "needs_practice"
        else:
            return "weak"
    
    @property
    def accuracy(self) -> float:
        """Calcule le taux de réussite."""
        total = self.times_correct + self.times_incorrect
        if total == 0:
            return 0.0
        return (self.times_correct / total) * 100
    
    def record_practice(self, is_correct: bool, quality: int = 3) -> None:
        """
        Enregistre une pratique et met à jour le spaced repetition.
        
        Args:
            is_correct: Si la réponse était correcte
            quality: Qualité de la réponse (0-5 pour SM-2)
                    0 = échec total, 5 = réponse parfaite immédiate
        """
        self.times_practiced += 1
        self.last_practiced_at = datetime.utcnow()
        
        if is_correct:
            self.times_correct += 1
        else:
            self.times_incorrect += 1
        
        # Mettre à jour le score de maîtrise
        self._update_mastery_score()
        
        # Mettre à jour le spaced repetition (SM-2)
        self._update_spaced_repetition(quality)
        
        # Vérifier si maîtrisé
        if self.is_mastered and self.mastered_at is None:
            self.mastered_at = datetime.utcnow()
    
    def _update_mastery_score(self) -> None:
        """Met à jour le score de maîtrise basé sur l'accuracy."""
        self.mastery_score = Decimal(str(round(self.accuracy, 2)))
    
    def _update_spaced_repetition(self, quality: int) -> None:
        """
        Met à jour les paramètres de spaced repetition (SM-2).
        
        Quality:
            0 - Échec complet
            1 - Mauvaise réponse, se souvient à peine
            2 - Mauvaise réponse, mais proche
            3 - Bonne réponse avec difficulté
            4 - Bonne réponse après réflexion
            5 - Réponse parfaite immédiate
        """
        quality = max(0, min(5, quality))  # Clamp 0-5
        
        if quality < 3:
            # Réponse incorrecte ou difficile - reset interval
            self.interval_days = 1
            self.needs_review = True
        else:
            # Réponse correcte - augmenter interval
            if self.interval_days == 1:
                self.interval_days = 6
            else:
                self.interval_days = int(self.interval_days * float(self.ease_factor))
            self.needs_review = False
        
        # Mettre à jour ease factor
        new_ease = float(self.ease_factor) + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
        self.ease_factor = Decimal(str(max(1.3, new_ease)))  # Minimum 1.3
        
        # Calculer prochaine date de révision
        from datetime import timedelta
        self.next_review_date = date.today() + timedelta(days=self.interval_days)
    
    def mark_for_review(self) -> None:
        """Marque le topic pour révision urgente."""
        self.needs_review = True
        self.next_review_date = date.today()
