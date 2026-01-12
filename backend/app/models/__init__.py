
# Base et mixins
from .base import (
    Base,
    UUIDMixin,
    TimestampMixin,
    SoftDeleteMixin,
    TableNameMixin,
)

# Enums
from .enums import (
    LevelEnum,
    SkillTypeEnum,
    PrerequisiteImportanceEnum,
    QuestionTypeEnum,
    DifficultyEnum,
    SubscriptionStatusEnum,
    PlanTypeEnum,
    CreditTransactionTypeEnum,
    LearningStyleEnum,
    SessionStatusEnum,
    MessageRoleEnum,
    LLMProviderEnum,
    BadgeCategoryEnum,
    SocialPlatformEnum,
)

# Auth
from .auth import (
    User,
    EmailVerificationToken,
    PasswordResetToken,
    RefreshToken,
)

# Profile
from .profile import (
    UserProfile,
    UserLearningGoal,
)

# Skills
from .skills import (
    SkillCategory,
    Skill,
    SkillPrerequisite,
    Topic,
    SkillTopic,
)

# Progress
from .progress import (
    UserSkillLevel,
    UserTopicMastery,
)

# Questions
from .questions import (
    Question,
    QuestionTopic,
    UserQuestionHistory,
)

# Mentoring
from .mentoring import (
    MentoringSession,
    SessionMessage,
)

# Billing
from .billing import (
    SubscriptionPlan,
    UserSubscription,
    UserCredits,
    CreditTransaction,
)

# Badges
from .badges import (
    Badge,
    UserBadge,
    SkillCertification,
)

# Public
from .public import (
    PublicProfile,
    ProfileView,
    SocialShare,
)

# Analytics
from .analytics import (
    DailyActivity,
    EventLog,
)


# Liste complète des modèles pour Alembic
__all__ = [
    # Base
    "Base",
    "UUIDMixin",
    "TimestampMixin",
    "SoftDeleteMixin",
    "TableNameMixin",
    
    # Enums
    "LevelEnum",
    "SkillTypeEnum",
    "PrerequisiteImportanceEnum",
    "QuestionTypeEnum",
    "DifficultyEnum",
    "SubscriptionStatusEnum",
    "PlanTypeEnum",
    "CreditTransactionTypeEnum",
    "LearningStyleEnum",
    "SessionStatusEnum",
    "MessageRoleEnum",
    "LLMProviderEnum",
    "BadgeCategoryEnum",
    "SocialPlatformEnum",
    
    # Auth
    "User",
    "EmailVerificationToken",
    "PasswordResetToken",
    "RefreshToken",
    
    # Profile
    "UserProfile",
    "UserLearningGoal",
    
    # Skills
    "SkillCategory",
    "Skill",
    "SkillPrerequisite",
    "Topic",
    "SkillTopic",
    
    # Progress
    "UserSkillLevel",
    "UserTopicMastery",
    
    # Questions
    "Question",
    "QuestionTopic",
    "UserQuestionHistory",
    
    # Mentoring
    "MentoringSession",
    "SessionMessage",
    
    # Billing
    "SubscriptionPlan",
    "UserSubscription",
    "UserCredits",
    "CreditTransaction",
    
    # Badges
    "Badge",
    "UserBadge",
    "SkillCertification",
    
    # Public
    "PublicProfile",
    "ProfileView",
    "SocialShare",
    
    # Analytics
    "DailyActivity",
    "EventLog",
]


# Mapping des tables par catégorie (utile pour documentation)
MODEL_CATEGORIES = {
    "auth": [
        User,
        EmailVerificationToken,
        PasswordResetToken,
        RefreshToken,
    ],
    "profile": [
        UserProfile,
        UserLearningGoal,
    ],
    "skills": [
        SkillCategory,
        Skill,
        SkillPrerequisite,
        Topic,
        SkillTopic,
    ],
    "progress": [
        UserSkillLevel,
        UserTopicMastery,
    ],
    "questions": [
        Question,
        QuestionTopic,
        UserQuestionHistory,
    ],
    "mentoring": [
        MentoringSession,
        SessionMessage,
    ],
    "billing": [
        SubscriptionPlan,
        UserSubscription,
        UserCredits,
        CreditTransaction,
    ],
    "badges": [
        Badge,
        UserBadge,
        SkillCertification,
    ],
    "public": [
        PublicProfile,
        ProfileView,
        SocialShare,
    ],
    "analytics": [
        DailyActivity,
        EventLog,
    ],
}


def get_all_models() -> list:
    """Retourne la liste de tous les modèles."""
    models = []
    for category_models in MODEL_CATEGORIES.values():
        models.extend(category_models)
    return models


def get_models_by_category(category: str) -> list:
    """Retourne les modèles d'une catégorie."""
    return MODEL_CATEGORIES.get(category, [])
