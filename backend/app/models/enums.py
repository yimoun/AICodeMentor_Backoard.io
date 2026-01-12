"""
AI Code Mentor - Enums
======================
Tous les types énumérés correspondant aux ENUM PostgreSQL.
"""

from enum import Enum


class LevelEnum(str, Enum):
    """Niveaux de compétence."""
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class SkillTypeEnum(str, Enum):
    """Types de compétences (distinction langage/framework)."""
    LANGUAGE = "language"
    FRAMEWORK = "framework"
    LIBRARY = "library"
    TOOL = "tool"
    CONCEPT = "concept"


class PrerequisiteImportanceEnum(str, Enum):
    """Importance des prérequis."""
    REQUIRED = "required"
    RECOMMENDED = "recommended"
    OPTIONAL = "optional"


class QuestionTypeEnum(str, Enum):
    """Types de questions."""
    MULTIPLE_CHOICE = "multiple_choice"
    TRUE_FALSE = "true_false"
    CODE_COMPLETION = "code_completion"
    CODE_REVIEW = "code_review"
    OPEN_ENDED = "open_ended"


class DifficultyEnum(str, Enum):
    """Difficulté des questions."""
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"
    EXPERT = "expert"


class SubscriptionStatusEnum(str, Enum):
    """Statut d'abonnement."""
    ACTIVE = "active"
    CANCELED = "canceled"
    PAST_DUE = "past_due"
    PAUSED = "paused"
    TRIALING = "trialing"
    EXPIRED = "expired"


class PlanTypeEnum(str, Enum):
    """Types de plans d'abonnement."""
    FREE = "free"
    STARTER = "starter"
    PRO = "pro"
    ENTERPRISE = "enterprise"


class CreditTransactionTypeEnum(str, Enum):
    """Types de transactions de crédits."""
    SUBSCRIPTION_REFILL = "subscription_refill"  # Recharge mensuelle automatique
    PURCHASE = "purchase"                         # Achat de pack de crédits
    USAGE = "usage"                               # Consommation (valeur négative)
    BONUS = "bonus"                               # Bonus promotionnel
    REFUND = "refund"                             # Remboursement
    ADJUSTMENT = "adjustment"                     # Ajustement manuel admin


class LearningStyleEnum(str, Enum):
    """Styles d'apprentissage."""
    VISUAL = "visual"
    READING = "reading"
    HANDS_ON = "hands_on"
    AUDITORY = "auditory"


class SessionStatusEnum(str, Enum):
    """Statut de session de mentorat."""
    ACTIVE = "active"
    COMPLETED = "completed"
    ABANDONED = "abandoned"


class MessageRoleEnum(str, Enum):
    """Rôle des messages dans une conversation."""
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class LLMProviderEnum(str, Enum):
    """LLM utilisés pour les réponses."""
    CLAUDE = "claude"
    GPT4 = "gpt4"
    GPT35 = "gpt35"
    MISTRAL = "mistral"
    CODESTRAL = "codestral"


class BadgeCategoryEnum(str, Enum):
    """Catégories de badges."""
    STREAK = "streak"
    LEARNING = "learning"
    SKILL = "skill"
    SOCIAL = "social"
    SPECIAL = "special"


class SocialPlatformEnum(str, Enum):
    """Plateformes de partage social."""
    LINKEDIN = "linkedin"
    TWITTER = "twitter"
    GITHUB = "github"
    EMAIL = "email"
    EMBED = "embed"
    COPY = "copy"


class GoalTypeEnum(str, Enum):
    CAREER_CHANGE = "career_change"      # Reconversion professionnelle
    SKILL_UP = "skill_up"                # Monter en compétences
    INTERVIEW_PREP = "interview_prep"    # Préparer des entrevues
    CERTIFICATION = "certification"      # Obtenir une certification
    HOBBY = "hobby"                      # Projet personnel
    SCHOOL = "school"                    # Cours / études
    JOB_REQUIREMENT = "job_requirement"  # Exigence du travail