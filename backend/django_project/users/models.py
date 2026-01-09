from django.db import models

# Create your models here.

# backend/django_app/apps/core/models.py
"""
AI Code Mentor - Modèles de base de données complets
=====================================================

Tables:
- User (extends AbstractUser)
- UserOnboarding
- SkillCategory
- Skill
- SkillPrerequisite
- Topic
- UserTopicMastery
- SubscriptionPlan
- UserSubscription
- UserCredits
- CreditTransaction
"""

import uuid
from decimal import Decimal
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from django.db.models import F


# =============================================================================
# USER MODEL
# =============================================================================

class User(AbstractUser):
    """
    Utilisateur étendu avec UUID et champs additionnels.
    Les informations d'onboarding sont dans UserOnboarding (OneToOne).
    """
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    email = models.EmailField(
        unique=True,
        db_index=True,
        verbose_name="Adresse email"
    )
    
    # Profil
    avatar_url = models.URLField(blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True)
    github_username = models.CharField(max_length=39, blank=True)
    linkedin_url = models.URLField(blank=True)
    
    # Gamification
    xp_total = models.PositiveIntegerField(default=0)
    current_streak = models.PositiveIntegerField(default=0)
    longest_streak = models.PositiveIntegerField(default=0)
    last_activity_date = models.DateField(null=True, blank=True)
    
    # Préférences
    email_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=True)
    dark_mode = models.BooleanField(default=True)
    
    # Profil public
    profile_public = models.BooleanField(default=False)
    profile_slug = models.SlugField(unique=True, null=True, blank=True, db_index=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        db_table = 'users'
        verbose_name = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['created_at']),
            models.Index(fields=['xp_total']),
        ]
    
    def __str__(self):
        return self.email
    
    def update_streak(self):
        """Met à jour le streak quotidien de l'utilisateur."""
        from datetime import timedelta
        today = timezone.now().date()
        
        if self.last_activity_date is None:
            self.current_streak = 1
        elif self.last_activity_date == today:
            return  # Déjà actif aujourd'hui
        elif self.last_activity_date == today - timedelta(days=1):
            self.current_streak += 1
        else:
            self.current_streak = 1  # Streak cassé
        
        self.last_activity_date = today
        self.longest_streak = max(self.longest_streak, self.current_streak)
        self.save(update_fields=['current_streak', 'longest_streak', 'last_activity_date'])
    
    def add_xp(self, amount: int):
        """Ajoute des XP à l'utilisateur."""
        self.xp_total = F('xp_total') + amount
        self.save(update_fields=['xp_total'])
        self.refresh_from_db()


# =============================================================================
# ONBOARDING MODEL
# =============================================================================

class UserOnboarding(models.Model):
    """
    Progression et données d'onboarding de l'utilisateur.
    Relation OneToOne avec User.
    """
    
    class ExperienceLevel(models.TextChoices):
        COMPLETE_BEGINNER = 'complete_beginner', 'Débutant complet'
        SOME_EXPERIENCE = 'some_experience', 'Un peu d\'expérience'
        INTERMEDIATE = 'intermediate', 'Intermédiaire'
        ADVANCED = 'advanced', 'Avancé'
        EXPERT = 'expert', 'Expert'
    
    class LearningStyle(models.TextChoices):
        VISUAL = 'visual', 'Visuel (diagrammes, schémas)'
        READING = 'reading', 'Lecture (documentation)'
        HANDS_ON = 'hands_on', 'Pratique (exercices de code)'
        VIDEO = 'video', 'Vidéo (tutoriels)'
        MIXED = 'mixed', 'Mixte'
    
    class LearningPace(models.TextChoices):
        RELAXED = 'relaxed', 'Détendu (à mon rythme)'
        MODERATE = 'moderate', 'Modéré (régulier)'
        INTENSIVE = 'intensive', 'Intensif (rapide)'
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='onboarding'
    )
    
    # Progression onboarding
    completed = models.BooleanField(
        default=False,
        db_index=True,
        help_text="Onboarding terminé"
    )
    current_step = models.PositiveSmallIntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(10)],
        help_text="Étape actuelle (0-7)"
    )
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    # Données collectées - Étape 1: Prénom
    first_name_collected = models.CharField(
        max_length=50,
        blank=True,
        help_text="Prénom collecté à l'étape 1"
    )
    
    # Données collectées - Étape 2: Objectifs
    learning_goals = models.JSONField(
        default=list,
        blank=True,
        help_text="Liste des objectifs: career_change, skill_up, specific_tech, curiosity, interview_prep, freelance, side_project"
    )
    
    # Données collectées - Étape 3: Niveau d'expérience
    experience_level = models.CharField(
        max_length=20,
        choices=ExperienceLevel.choices,
        blank=True,
        db_index=True
    )
    years_of_experience = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        validators=[MaxValueValidator(50)],
        help_text="Années d'expérience en programmation"
    )
    
    # Données collectées - Étape 4: Skills sélectionnés
    selected_skills = models.JSONField(
        default=list,
        blank=True,
        help_text="Liste des skill slugs sélectionnés"
    )
    
    # Données collectées - Étape 5: Style d'apprentissage
    preferred_learning_style = models.CharField(
        max_length=20,
        choices=LearningStyle.choices,
        default=LearningStyle.READING
    )
    
    # Données collectées - Étape 6: Temps quotidien
    daily_time_commitment = models.PositiveSmallIntegerField(
        default=15,
        validators=[MinValueValidator(5), MaxValueValidator(240)],
        help_text="Minutes par jour dédiées à l'apprentissage"
    )
    learning_pace = models.CharField(
        max_length=20,
        choices=LearningPace.choices,
        default=LearningPace.MODERATE
    )
    preferred_session_time = models.CharField(
        max_length=20,
        blank=True,
        help_text="Moment préféré: morning, afternoon, evening, night"
    )
    
    # Données collectées - Étape 7: Profil public
    wants_public_profile = models.BooleanField(
        default=False,
        help_text="Souhaite un profil public avec badges partageables"
    )
    wants_streak_reminders = models.BooleanField(
        default=True,
        help_text="Recevoir des rappels pour maintenir le streak"
    )
    wants_weekly_report = models.BooleanField(
        default=True,
        help_text="Recevoir un rapport hebdomadaire de progression"
    )
    
    # Métadonnées
    source = models.CharField(
        max_length=50,
        blank=True,
        help_text="Source d'acquisition: organic, google, linkedin, referral, etc."
    )
    referral_code = models.CharField(
        max_length=20,
        blank=True
    )
    utm_campaign = models.CharField(max_length=100, blank=True)
    utm_source = models.CharField(max_length=100, blank=True)
    utm_medium = models.CharField(max_length=100, blank=True)
    
    # Timestamps
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_onboarding'
        verbose_name = 'Onboarding utilisateur'
        verbose_name_plural = 'Onboardings utilisateurs'
        indexes = [
            models.Index(fields=['completed']),
            models.Index(fields=['current_step']),
            models.Index(fields=['experience_level']),
        ]
    
    def __str__(self):
        status = "✅" if self.completed else f"Step {self.current_step}/7"
        return f"{self.user.email} - {status}"
    
    def complete_onboarding(self):
        """Marque l'onboarding comme terminé et synchronise les données."""
        self.completed = True
        self.completed_at = timezone.now()
        self.save()
        
        # Synchroniser le prénom avec User
        if self.first_name_collected:
            self.user.first_name = self.first_name_collected
            self.user.profile_public = self.wants_public_profile
            self.user.save(update_fields=['first_name', 'profile_public'])
    
    @property
    def progress_percentage(self) -> int:
        """Retourne le pourcentage de progression."""
        total_steps = 7
        return int((self.current_step / total_steps) * 100)
    
    def get_personalized_greeting(self) -> str:
        """Retourne un message personnalisé selon le niveau."""
        greetings = {
            self.ExperienceLevel.COMPLETE_BEGINNER: "On va commencer en douceur !",
            self.ExperienceLevel.SOME_EXPERIENCE: "Super base pour progresser !",
            self.ExperienceLevel.INTERMEDIATE: "On va approfondir ensemble !",
            self.ExperienceLevel.ADVANCED: "On va challenger vos skills !",
            self.ExperienceLevel.EXPERT: "Prêt pour du contenu avancé !",
        }
        return greetings.get(self.experience_level, "Bienvenue !")


# =============================================================================
# SKILLS & CATEGORIES MODELS
# =============================================================================

class SkillCategory(models.Model):
    """
    Catégories de compétences (Backend, Frontend, Database, DevOps, etc.)
    """
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True, db_index=True)
    icon = models.CharField(
        max_length=10,
        help_text="Emoji représentant la catégorie"
    )
    description = models.TextField(blank=True)
    display_order = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'skill_categories'
        verbose_name = 'Catégorie de compétence'
        verbose_name_plural = 'Catégories de compétences'
        ordering = ['display_order', 'name']
    
    def __str__(self):
        return f"{self.icon} {self.name}"


class Skill(models.Model):
    """
    Compétences/Technologies disponibles.
    """
    
    class SkillType(models.TextChoices):
        LANGUAGE = 'language', 'Langage de programmation'
        FRAMEWORK = 'framework', 'Framework'
        LIBRARY = 'library', 'Bibliothèque'
        DATABASE = 'database', 'Base de données'
        TOOL = 'tool', 'Outil'
        PLATFORM = 'platform', 'Plateforme'
        CONCEPT = 'concept', 'Concept'
    
    class DifficultyBase(models.TextChoices):
        BEGINNER = 'beginner', 'Débutant'
        INTERMEDIATE = 'intermediate', 'Intermédiaire'
        ADVANCED = 'advanced', 'Avancé'
        EXPERT = 'expert', 'Expert'
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    category = models.ForeignKey(
        SkillCategory,
        on_delete=models.PROTECT,
        related_name='skills'
    )
    
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True, db_index=True)
    skill_type = models.CharField(
        max_length=20,
        choices=SkillType.choices,
        db_index=True
    )
    icon = models.CharField(max_length=10, help_text="Emoji")
    description = models.TextField()
    
    # Difficulté
    difficulty_base = models.CharField(
        max_length=20,
        choices=DifficultyBase.choices,
        default=DifficultyBase.BEGINNER,
        help_text="Niveau de difficulté de base pour apprendre cette compétence"
    )
    difficulty_order = models.PositiveSmallIntegerField(
        default=0,
        help_text="Ordre de difficulté numérique (pour tri)"
    )
    
    # XP
    xp_per_level = models.JSONField(
        default=dict,
        help_text="XP requis par niveau: {'beginner': 0, 'intermediate': 500, ...}"
    )
    
    # Métadonnées
    official_docs_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    is_premium = models.BooleanField(
        default=False,
        help_text="Nécessite un abonnement payant"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'skills'
        verbose_name = 'Compétence'
        verbose_name_plural = 'Compétences'
        ordering = ['category', 'difficulty_order', 'name']
        indexes = [
            models.Index(fields=['skill_type']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return f"{self.icon} {self.name}"


class SkillPrerequisite(models.Model):
    """
    Dépendances entre compétences.
    Ex: React requiert JavaScript niveau intermédiaire.
    """
    
    class MinLevel(models.TextChoices):
        BEGINNER = 'beginner', 'Débutant'
        INTERMEDIATE = 'intermediate', 'Intermédiaire'
        ADVANCED = 'advanced', 'Avancé'
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name='prerequisites'
    )
    prerequisite = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name='required_for'
    )
    min_level = models.CharField(
        max_length=20,
        choices=MinLevel.choices,
        default=MinLevel.BEGINNER,
        help_text="Niveau minimum requis dans le prérequis"
    )
    is_mandatory = models.BooleanField(
        default=True,
        help_text="Prérequis obligatoire ou recommandé"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'skill_prerequisites'
        verbose_name = 'Prérequis de compétence'
        verbose_name_plural = 'Prérequis de compétences'
        unique_together = ['skill', 'prerequisite']
        constraints = [
            models.CheckConstraint(
                check=~models.Q(skill=models.F('prerequisite')),
                name='skill_cannot_be_its_own_prerequisite'
            )
        ]
    
    def __str__(self):
        mandatory = "⚠️" if self.is_mandatory else "💡"
        return f"{self.skill.name} ← {mandatory} {self.prerequisite.name} ({self.min_level})"


# =============================================================================
# TOPICS & MASTERY MODELS
# =============================================================================

class Topic(models.Model):
    """
    Concepts/sujets d'apprentissage au sein d'une compétence.
    Supporte une hiérarchie (parent_topic_id).
    """
    
    class Difficulty(models.TextChoices):
        EASY = 'easy', 'Facile'
        MEDIUM = 'medium', 'Moyen'
        HARD = 'hard', 'Difficile'
        EXPERT = 'expert', 'Expert'
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name='topics'
    )
    parent_topic = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='subtopics'
    )
    
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, db_index=True)
    description = models.TextField(blank=True)
    difficulty = models.CharField(
        max_length=20,
        choices=Difficulty.choices,
        default=Difficulty.MEDIUM
    )
    
    # Ordre d'apprentissage
    display_order = models.PositiveSmallIntegerField(default=0)
    
    # Métadonnées
    estimated_hours = models.DecimalField(
        max_digits=4,
        decimal_places=1,
        default=Decimal('1.0'),
        help_text="Heures estimées pour maîtriser ce topic"
    )
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'topics'
        verbose_name = 'Topic'
        verbose_name_plural = 'Topics'
        ordering = ['skill', 'display_order', 'name']
        unique_together = ['skill', 'slug']
        indexes = [
            models.Index(fields=['skill', 'difficulty']),
        ]
    
    def __str__(self):
        if self.parent_topic:
            return f"{self.skill.name} > {self.parent_topic.name} > {self.name}"
        return f"{self.skill.name} > {self.name}"


class UserTopicMastery(models.Model):
    """
    Maîtrise d'un utilisateur sur un topic spécifique.
    Permet un suivi granulaire de la progression.
    """
    
    class MasteryLevel(models.TextChoices):
        NOT_STARTED = 'not_started', 'Non commencé'
        LEARNING = 'learning', 'En apprentissage'
        PRACTICING = 'practicing', 'En pratique'
        MASTERED = 'mastered', 'Maîtrisé'
        EXPERT = 'expert', 'Expert'
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='topic_masteries'
    )
    topic = models.ForeignKey(
        Topic,
        on_delete=models.CASCADE,
        related_name='user_masteries'
    )
    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name='user_topic_masteries',
        help_text="Dénormalisé pour requêtes rapides"
    )
    
    # Score de maîtrise (0-100)
    mastery_score = models.PositiveSmallIntegerField(
        default=0,
        validators=[MaxValueValidator(100)],
        db_index=True
    )
    mastery_level = models.CharField(
        max_length=20,
        choices=MasteryLevel.choices,
        default=MasteryLevel.NOT_STARTED
    )
    
    # Spaced Repetition
    needs_review = models.BooleanField(
        default=False,
        db_index=True,
        help_text="Topic à réviser (spaced repetition)"
    )
    next_review_date = models.DateField(
        null=True,
        blank=True,
        db_index=True
    )
    review_count = models.PositiveSmallIntegerField(default=0)
    consecutive_correct = models.PositiveSmallIntegerField(
        default=0,
        help_text="Réponses correctes consécutives"
    )
    
    # Statistiques
    questions_asked = models.PositiveIntegerField(default=0)
    questions_correct = models.PositiveIntegerField(default=0)
    time_spent_minutes = models.PositiveIntegerField(default=0)
    
    # Timestamps
    first_interaction_at = models.DateTimeField(null=True, blank=True)
    last_interaction_at = models.DateTimeField(null=True, blank=True)
    last_review_at = models.DateTimeField(null=True, blank=True)
    mastered_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_topic_mastery'
        verbose_name = 'Maîtrise de topic'
        verbose_name_plural = 'Maîtrises de topics'
        unique_together = ['user', 'topic']
        indexes = [
            models.Index(fields=['user', 'skill']),
            models.Index(fields=['user', 'needs_review']),
            models.Index(fields=['user', 'mastery_score']),
            models.Index(fields=['next_review_date']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.topic.name}: {self.mastery_score}%"
    
    def update_mastery(self, is_correct: bool, difficulty_factor: float = 1.0):
        """
        Met à jour le score de maîtrise après une interaction.
        Utilise un algorithme de spaced repetition simplifié.
        """
        from datetime import timedelta
        
        self.questions_asked += 1
        now = timezone.now()
        
        if self.first_interaction_at is None:
            self.first_interaction_at = now
        self.last_interaction_at = now
        
        if is_correct:
            self.questions_correct += 1
            self.consecutive_correct += 1
            
            # Augmentation du score (plus petit si déjà élevé)
            increase = int(10 * difficulty_factor * (1 - self.mastery_score / 100))
            self.mastery_score = min(100, self.mastery_score + max(1, increase))
            
            # Calcul de la prochaine révision (spaced repetition)
            intervals = [1, 3, 7, 14, 30, 60, 90]
            interval_index = min(self.consecutive_correct - 1, len(intervals) - 1)
            self.next_review_date = (now + timedelta(days=intervals[interval_index])).date()
            self.needs_review = False
        else:
            self.consecutive_correct = 0
            
            # Diminution du score
            decrease = int(5 * difficulty_factor)
            self.mastery_score = max(0, self.mastery_score - decrease)
            
            # Révision nécessaire bientôt
            self.next_review_date = (now + timedelta(days=1)).date()
            self.needs_review = True
        
        # Mise à jour du niveau
        self._update_mastery_level()
        self.save()
    
    def _update_mastery_level(self):
        """Met à jour le niveau de maîtrise basé sur le score."""
        if self.mastery_score >= 90:
            self.mastery_level = self.MasteryLevel.EXPERT
            if self.mastered_at is None:
                self.mastered_at = timezone.now()
        elif self.mastery_score >= 70:
            self.mastery_level = self.MasteryLevel.MASTERED
        elif self.mastery_score >= 40:
            self.mastery_level = self.MasteryLevel.PRACTICING
        elif self.mastery_score > 0:
            self.mastery_level = self.MasteryLevel.LEARNING
        else:
            self.mastery_level = self.MasteryLevel.NOT_STARTED


# =============================================================================
# SUBSCRIPTION & BILLING MODELS
# =============================================================================

class SubscriptionPlan(models.Model):
    """
    Plans d'abonnement disponibles.
    """
    
    class PlanType(models.TextChoices):
        FREE = 'free', 'Gratuit'
        STARTER = 'starter', 'Starter'
        PRO = 'pro', 'Pro'
        ENTERPRISE = 'enterprise', 'Enterprise'
    
    class BillingInterval(models.TextChoices):
        MONTHLY = 'monthly', 'Mensuel'
        YEARLY = 'yearly', 'Annuel'
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    
    name = models.CharField(max_length=50)
    slug = models.SlugField(max_length=50, unique=True)
    plan_type = models.CharField(
        max_length=20,
        choices=PlanType.choices,
        unique=True,
        db_index=True
    )
    description = models.TextField(blank=True)
    
    # Tarification
    price_monthly = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=Decimal('0.00')
    )
    price_yearly = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=Decimal('0.00')
    )
    
    # Crédits
    credits_per_month = models.PositiveIntegerField(
        default=50,
        help_text="Crédits alloués chaque mois"
    )
    credits_rollover = models.BooleanField(
        default=False,
        help_text="Les crédits non utilisés sont reportés"
    )
    max_credits_rollover = models.PositiveIntegerField(
        default=0,
        help_text="Maximum de crédits reportables"
    )
    
    # Limites
    max_skills = models.PositiveSmallIntegerField(
        default=2,
        help_text="Nombre max de skills (-1 = illimité)"
    )
    max_sessions_per_day = models.PositiveSmallIntegerField(
        default=3,
        help_text="Sessions max par jour (-1 = illimité)"
    )
    
    # Fonctionnalités (JSON pour flexibilité)
    features = models.JSONField(
        default=dict,
        help_text="Fonctionnalités incluses: code_review, premium_llms, analytics, etc."
    )
    
    # Stripe
    stripe_price_id_monthly = models.CharField(max_length=100, blank=True)
    stripe_price_id_yearly = models.CharField(max_length=100, blank=True)
    stripe_product_id = models.CharField(max_length=100, blank=True)
    
    # Métadonnées
    is_active = models.BooleanField(default=True)
    is_popular = models.BooleanField(
        default=False,
        help_text="Afficher le badge 'Populaire'"
    )
    display_order = models.PositiveSmallIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'subscription_plans'
        verbose_name = 'Plan d\'abonnement'
        verbose_name_plural = 'Plans d\'abonnement'
        ordering = ['display_order', 'price_monthly']
    
    def __str__(self):
        return f"{self.name} - ${self.price_monthly}/mois"
    
    def has_feature(self, feature_name: str) -> bool:
        """Vérifie si le plan inclut une fonctionnalité."""
        return self.features.get(feature_name, False)


class UserSubscription(models.Model):
    """
    Abonnement actif d'un utilisateur.
    """
    
    class Status(models.TextChoices):
        ACTIVE = 'active', 'Actif'
        TRIALING = 'trialing', 'Période d\'essai'
        PAST_DUE = 'past_due', 'Paiement en retard'
        CANCELED = 'canceled', 'Annulé'
        PAUSED = 'paused', 'En pause'
        INCOMPLETE = 'incomplete', 'Incomplet'
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='subscription'
    )
    plan = models.ForeignKey(
        SubscriptionPlan,
        on_delete=models.PROTECT,
        related_name='subscriptions'
    )
    
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
        db_index=True
    )
    billing_interval = models.CharField(
        max_length=20,
        choices=SubscriptionPlan.BillingInterval.choices,
        default=SubscriptionPlan.BillingInterval.MONTHLY
    )
    
    # Stripe
    stripe_customer_id = models.CharField(
        max_length=100,
        blank=True,
        db_index=True
    )
    stripe_subscription_id = models.CharField(
        max_length=100,
        blank=True,
        unique=True,
        null=True,
        db_index=True
    )
    
    # Période
    current_period_start = models.DateTimeField(null=True, blank=True)
    current_period_end = models.DateTimeField(null=True, blank=True)
    trial_end = models.DateTimeField(null=True, blank=True)
    canceled_at = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_subscriptions'
        verbose_name = 'Abonnement utilisateur'
        verbose_name_plural = 'Abonnements utilisateurs'
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['current_period_end']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.plan.name} ({self.status})"
    
    @property
    def is_active(self) -> bool:
        """Vérifie si l'abonnement est actif."""
        return self.status in [self.Status.ACTIVE, self.Status.TRIALING]
    
    @property
    def is_trial(self) -> bool:
        """Vérifie si l'utilisateur est en période d'essai."""
        if self.trial_end is None:
            return False
        return timezone.now() < self.trial_end


class UserCredits(models.Model):
    """
    Solde de crédits d'un utilisateur.
    """
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='credits'
    )
    
    credits_balance = models.PositiveIntegerField(
        default=0,
        db_index=True
    )
    credits_used_this_month = models.PositiveIntegerField(default=0)
    credits_purchased_total = models.PositiveIntegerField(
        default=0,
        help_text="Total des crédits achetés (hors plan)"
    )
    
    # Recharge
    last_refill_date = models.DateField(
        null=True,
        blank=True,
        db_index=True
    )
    next_refill_date = models.DateField(
        null=True,
        blank=True
    )
    
    # Bonus
    bonus_credits = models.PositiveIntegerField(
        default=0,
        help_text="Crédits bonus (parrainage, promo, etc.)"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_credits'
        verbose_name = 'Crédits utilisateur'
        verbose_name_plural = 'Crédits utilisateurs'
    
    def __str__(self):
        return f"{self.user.email}: {self.credits_balance} crédits"
    
    def has_credits(self, amount: int = 1) -> bool:
        """Vérifie si l'utilisateur a assez de crédits."""
        return self.credits_balance >= amount
    
    def deduct_credits(self, amount: int, reason: str = "") -> bool:
        """
        Déduit des crédits si possible.
        Retourne True si la déduction a réussi.
        """
        if not self.has_credits(amount):
            return False
        
        self.credits_balance = F('credits_balance') - amount
        self.credits_used_this_month = F('credits_used_this_month') + amount
        self.save(update_fields=['credits_balance', 'credits_used_this_month', 'updated_at'])
        self.refresh_from_db()
        
        # Créer la transaction
        CreditTransaction.objects.create(
            user=self.user,
            amount=-amount,
            transaction_type=CreditTransaction.TransactionType.USAGE,
            reason=reason,
            balance_after=self.credits_balance
        )
        
        return True
    
    def add_credits(
        self,
        amount: int,
        transaction_type: str,
        reason: str = ""
    ):
        """Ajoute des crédits au solde."""
        self.credits_balance = F('credits_balance') + amount
        
        if transaction_type == CreditTransaction.TransactionType.PURCHASE:
            self.credits_purchased_total = F('credits_purchased_total') + amount
        elif transaction_type == CreditTransaction.TransactionType.BONUS:
            self.bonus_credits = F('bonus_credits') + amount
        
        self.save()
        self.refresh_from_db()
        
        CreditTransaction.objects.create(
            user=self.user,
            amount=amount,
            transaction_type=transaction_type,
            reason=reason,
            balance_after=self.credits_balance
        )
    
    def refill_monthly_credits(self):
        """Recharge les crédits mensuels selon le plan."""
        from datetime import timedelta
        
        subscription = getattr(self.user, 'subscription', None)
        if not subscription or not subscription.is_active:
            return
        
        plan = subscription.plan
        
        # Calcul des crédits à ajouter
        credits_to_add = plan.credits_per_month
        
        # Rollover si activé
        if plan.credits_rollover:
            rollover = min(self.credits_balance, plan.max_credits_rollover)
            self.credits_balance = rollover + credits_to_add
        else:
            self.credits_balance = credits_to_add
        
        self.credits_used_this_month = 0
        self.last_refill_date = timezone.now().date()
        self.next_refill_date = self.last_refill_date + timedelta(days=30)
        self.save()
        
        CreditTransaction.objects.create(
            user=self.user,
            amount=credits_to_add,
            transaction_type=CreditTransaction.TransactionType.REFILL,
            reason=f"Recharge mensuelle - Plan {plan.name}",
            balance_after=self.credits_balance
        )


class CreditTransaction(models.Model):
    """
    Historique de toutes les transactions de crédits.
    """
    
    class TransactionType(models.TextChoices):
        USAGE = 'usage', 'Utilisation'
        PURCHASE = 'purchase', 'Achat'
        REFILL = 'refill', 'Recharge mensuelle'
        BONUS = 'bonus', 'Bonus'
        REFUND = 'refund', 'Remboursement'
        ADJUSTMENT = 'adjustment', 'Ajustement'
        REFERRAL = 'referral', 'Parrainage'
        PROMO = 'promo', 'Code promo'
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='credit_transactions'
    )
    
    amount = models.IntegerField(
        help_text="Positif = ajout, Négatif = déduction"
    )
    transaction_type = models.CharField(
        max_length=20,
        choices=TransactionType.choices,
        db_index=True
    )
    reason = models.CharField(
        max_length=255,
        blank=True,
        help_text="Description de la transaction"
    )
    balance_after = models.PositiveIntegerField(
        help_text="Solde après la transaction"
    )
    
    # Métadonnées optionnelles
    related_session_id = models.UUIDField(
        null=True,
        blank=True,
        help_text="ID de la session de chat liée"
    )
    stripe_payment_id = models.CharField(
        max_length=100,
        blank=True,
        help_text="ID du paiement Stripe si achat"
    )
    promo_code = models.CharField(
        max_length=50,
        blank=True
    )
    
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    
    class Meta:
        db_table = 'credit_transactions'
        verbose_name = 'Transaction de crédits'
        verbose_name_plural = 'Transactions de crédits'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['transaction_type', '-created_at']),
        ]
    
    def __str__(self):
        sign = "+" if self.amount > 0 else ""
        return f"{self.user.email}: {sign}{self.amount} ({self.transaction_type})"


# =============================================================================
# SIGNALS
# =============================================================================

from django.db.models.signals import post_save
from django.dispatch import receiver


@receiver(post_save, sender=User)
def create_user_related_objects(sender, instance, created, **kwargs):
    """
    Crée les objets liés à l'utilisateur lors de sa création.
    """
    if created:
        # Créer l'objet Onboarding
        UserOnboarding.objects.create(user=instance)
        
        # Créer l'objet Credits avec les crédits de bienvenue
        UserCredits.objects.create(
            user=instance,
            credits_balance=50,  # Crédits de bienvenue
            bonus_credits=50
        )
        
        # Créer une transaction pour les crédits de bienvenue
        CreditTransaction.objects.create(
            user=instance,
            amount=50,
            transaction_type=CreditTransaction.TransactionType.BONUS,
            reason="Crédits de bienvenue",
            balance_after=50
        )
