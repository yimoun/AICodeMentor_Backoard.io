"""
AI Code Mentor - Public Profile Models
======================================
Modèles pour les profils publics partageables et analytics.
"""

from datetime import datetime
from typing import TYPE_CHECKING, Optional, Any
from uuid import UUID

from sqlalchemy import (
    Boolean, DateTime, ForeignKey, Integer, 
    String, Text, func, Index
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, UUIDMixin, TimestampMixin
from .enums import SocialPlatformEnum

if TYPE_CHECKING:
    from .auth import User


class PublicProfile(Base, UUIDMixin, TimestampMixin):
    """
    Profil public partageable.
    URL: aicodementor.io/p/{username}
    """
    
    __tablename__ = "public_profiles"
    
    # ===== Clé étrangère =====
    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True
    )
    
    # ===== URL publique =====
    username: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
        index=True
    )
    custom_url: Mapped[Optional[str]] = mapped_column(
        String(100),
        unique=True,
        nullable=True
    )
    
    # ===== Affichage =====
    display_name: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True
    )
    bio: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    avatar_url: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True
    )
    
    # ===== Liens externes =====
    website_url: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True
    )
    linkedin_url: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True
    )
    github_url: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True
    )
    twitter_url: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True
    )
    
    # ===== Paramètres de visibilité =====
    is_public: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )
    show_email: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )
    show_streak: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )
    show_xp: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )
    show_ranking: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )
    show_activity_heatmap: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )
    
    # ===== Badges mis en avant =====
    featured_badge_ids: Mapped[list[str]] = mapped_column(
        ARRAY(PG_UUID(as_uuid=True)),
        default=[],
        nullable=False
    )
    
    # ===== Certifications mises en avant =====
    featured_certification_ids: Mapped[list[str]] = mapped_column(
        ARRAY(PG_UUID(as_uuid=True)),
        default=[],
        nullable=False
    )
    
    # ===== Statistiques =====
    views_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    last_viewed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    
    # ===== SEO =====
    meta_title: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True
    )
    meta_description: Mapped[Optional[str]] = mapped_column(
        String(200),
        nullable=True
    )
    
    # ===== Relations =====
    user: Mapped["User"] = relationship(
        "User",
        back_populates="public_profile"
    )
    views: Mapped[list["ProfileView"]] = relationship(
        "ProfileView",
        back_populates="profile",
        cascade="all, delete-orphan"
    )
    
    @property
    def profile_url(self) -> str:
        """Retourne l'URL complète du profil."""
        if self.custom_url:
            return f"https://aicodementor.io/{self.custom_url}"
        return f"https://aicodementor.io/p/{self.username}"
    
    @property
    def short_url(self) -> str:
        """Retourne l'URL courte."""
        return f"acm.io/p/{self.username}"
    
    @property
    def has_social_links(self) -> bool:
        """Vérifie si le profil a des liens sociaux."""
        return any([
            self.linkedin_url,
            self.github_url,
            self.twitter_url,
            self.website_url
        ])
    
    @property
    def social_links(self) -> dict[str, Optional[str]]:
        """Retourne tous les liens sociaux."""
        return {
            "linkedin": self.linkedin_url,
            "github": self.github_url,
            "twitter": self.twitter_url,
            "website": self.website_url
        }
    
    def record_view(self) -> None:
        """Enregistre une vue du profil."""
        self.views_count += 1
        self.last_viewed_at = datetime.utcnow()
    
    def add_featured_badge(self, badge_id: UUID, max_featured: int = 4) -> bool:
        """
        Ajoute un badge en vedette.
        Retourne False si limite atteinte.
        """
        if len(self.featured_badge_ids) >= max_featured:
            return False
        if str(badge_id) not in [str(b) for b in self.featured_badge_ids]:
            self.featured_badge_ids = self.featured_badge_ids + [badge_id]
        return True
    
    def remove_featured_badge(self, badge_id: UUID) -> None:
        """Retire un badge des vedettes."""
        self.featured_badge_ids = [
            b for b in self.featured_badge_ids 
            if str(b) != str(badge_id)
        ]
    
    def add_featured_certification(self, cert_id: UUID, max_featured: int = 3) -> bool:
        """
        Ajoute une certification en vedette.
        Retourne False si limite atteinte.
        """
        if len(self.featured_certification_ids) >= max_featured:
            return False
        if str(cert_id) not in [str(c) for c in self.featured_certification_ids]:
            self.featured_certification_ids = self.featured_certification_ids + [cert_id]
        return True
    
    def to_public_dict(self, include_stats: bool = True) -> dict[str, Any]:
        """Retourne les données publiques."""
        data = {
            "username": self.username,
            "display_name": self.display_name,
            "bio": self.bio,
            "avatar_url": self.avatar_url,
            "profile_url": self.profile_url,
            "social_links": {
                k: v for k, v in self.social_links.items() if v
            }
        }
        
        if include_stats:
            data["views_count"] = self.views_count
        
        return data


class ProfileView(Base, UUIDMixin):
    """
    Vue d'un profil public.
    Pour analytics et tracking.
    """
    
    __tablename__ = "profile_views"
    
    # ===== Clé étrangère =====
    profile_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("public_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    # ===== Tracking =====
    viewer_user_id: Mapped[Optional[UUID]] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True
    )
    viewer_ip_hash: Mapped[Optional[str]] = mapped_column(
        String(64),  # Hash pour anonymisation
        nullable=True
    )
    
    # ===== Source =====
    referrer: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True
    )
    utm_source: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True
    )
    utm_medium: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True
    )
    utm_campaign: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True
    )
    
    # ===== Device =====
    user_agent: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    device_type: Mapped[Optional[str]] = mapped_column(
        String(20),  # mobile, desktop, tablet
        nullable=True
    )
    
    # ===== Timestamps =====
    viewed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=func.now(),
        nullable=False
    )
    
    # ===== Relations =====
    profile: Mapped["PublicProfile"] = relationship(
        "PublicProfile",
        back_populates="views"
    )
    viewer: Mapped[Optional["User"]] = relationship("User")
    
    # ===== Index =====
    __table_args__ = (
        Index("idx_profile_views_date", "viewed_at"),
    )
    
    @staticmethod
    def hash_ip(ip: str) -> str:
        """Hash une adresse IP pour anonymisation."""
        import hashlib
        return hashlib.sha256(ip.encode()).hexdigest()
    
    @staticmethod
    def detect_device_type(user_agent: str) -> str:
        """Détecte le type de device depuis le user agent."""
        ua_lower = user_agent.lower()
        if "mobile" in ua_lower or "android" in ua_lower:
            return "mobile"
        elif "tablet" in ua_lower or "ipad" in ua_lower:
            return "tablet"
        return "desktop"
    
    @classmethod
    def create_from_request(
        cls,
        profile_id: UUID,
        viewer_user_id: Optional[UUID] = None,
        ip_address: Optional[str] = None,
        referrer: Optional[str] = None,
        user_agent: Optional[str] = None,
        utm_params: Optional[dict] = None
    ) -> "ProfileView":
        """Factory pour créer une vue depuis une requête HTTP."""
        view = cls(
            profile_id=profile_id,
            viewer_user_id=viewer_user_id,
            referrer=referrer,
            user_agent=user_agent
        )
        
        if ip_address:
            view.viewer_ip_hash = cls.hash_ip(ip_address)
        
        if user_agent:
            view.device_type = cls.detect_device_type(user_agent)
        
        if utm_params:
            view.utm_source = utm_params.get("utm_source")
            view.utm_medium = utm_params.get("utm_medium")
            view.utm_campaign = utm_params.get("utm_campaign")
        
        return view


class SocialShare(Base, UUIDMixin):
    """
    Partages sur réseaux sociaux.
    Tracking des partages pour analytics et viralité.
    """
    
    __tablename__ = "social_shares"
    
    # ===== Clé étrangère =====
    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    # ===== Ce qui est partagé =====
    item_type: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )
    # Types: 'certification', 'badge', 'profile'
    
    item_id: Mapped[Optional[UUID]] = mapped_column(
        PG_UUID(as_uuid=True),
        nullable=True
    )
    
    # ===== Plateforme =====
    platform: Mapped[SocialPlatformEnum] = mapped_column(
        nullable=False
    )
    
    # ===== Liens =====
    share_url: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True
    )
    short_url: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True
    )
    
    # ===== Tracking =====
    clicks_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    
    # ===== Timestamps =====
    shared_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=func.now(),
        nullable=False
    )
    
    # ===== Relations =====
    user: Mapped["User"] = relationship(
        "User",
        back_populates="social_shares"
    )
    
    # ===== Index =====
    __table_args__ = (
        Index("idx_social_shares_item", "item_type", "item_id"),
    )
    
    @property
    def platform_display_name(self) -> str:
        """Retourne le nom d'affichage de la plateforme."""
        names = {
            SocialPlatformEnum.LINKEDIN: "LinkedIn",
            SocialPlatformEnum.TWITTER: "Twitter/X",
            SocialPlatformEnum.GITHUB: "GitHub",
            SocialPlatformEnum.EMAIL: "Email",
            SocialPlatformEnum.EMBED: "Embed",
            SocialPlatformEnum.COPY: "Copie du lien"
        }
        return names.get(self.platform, self.platform.value)
    
    def record_click(self) -> None:
        """Enregistre un clic sur le lien partagé."""
        self.clicks_count += 1
    
    @classmethod
    def create_certification_share(
        cls,
        user_id: UUID,
        certification_id: UUID,
        platform: SocialPlatformEnum,
        share_url: str
    ) -> "SocialShare":
        """Factory pour créer un partage de certification."""
        return cls(
            user_id=user_id,
            item_type="certification",
            item_id=certification_id,
            platform=platform,
            share_url=share_url
        )
    
    @classmethod
    def create_badge_share(
        cls,
        user_id: UUID,
        badge_id: UUID,
        platform: SocialPlatformEnum,
        share_url: str
    ) -> "SocialShare":
        """Factory pour créer un partage de badge."""
        return cls(
            user_id=user_id,
            item_type="badge",
            item_id=badge_id,
            platform=platform,
            share_url=share_url
        )
    
    @classmethod
    def create_profile_share(
        cls,
        user_id: UUID,
        platform: SocialPlatformEnum,
        share_url: str
    ) -> "SocialShare":
        """Factory pour créer un partage de profil."""
        return cls(
            user_id=user_id,
            item_type="profile",
            item_id=None,
            platform=platform,
            share_url=share_url
        )
