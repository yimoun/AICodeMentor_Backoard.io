from datetime import datetime
from typing import Optional, Literal
from uuid import UUID

from pydantic import Field

from app.schemas.base import BaseSchema


# === REQUEST SCHEMAS ===

class AssessmentStartRequest(BaseSchema):
    """Requête pour démarrer un assessment."""
    skill_slug: str
    question_count: int = Field(default=15, ge=5, le=30)


class AnswerSubmit(BaseSchema):
    """Soumission d'une réponse."""
    answer: str
    time_taken_seconds: int = Field(..., ge=0, le=300)
    hints_used: int = Field(default=0, ge=0)


class HintRequest(BaseSchema):
    """Demande d'indice."""
    hint_index: int = Field(default=0, ge=0)


# === RESPONSE SCHEMAS ===

class QuestionOption(BaseSchema):
    """Option de réponse pour QCM."""
    id: str
    text: str


class QuestionForTest(BaseSchema):
    """Question envoyée au client (SANS la réponse)."""
    id: UUID
    type: str
    difficulty: str
    question_text: str
    code_snippet: Optional[str] = None
    code_language: Optional[str] = None
    options: Optional[list[QuestionOption]] = None
    has_hints: bool
    hints_count: int
    time_limit_seconds: int = 120


class AssessmentStartResponse(BaseSchema):
    """Réponse au démarrage d'un assessment."""
    session_id: UUID
    skill_slug: str
    skill_name: str
    total_questions: int
    time_limit_minutes: int
    time_remaining_seconds: int
    first_question: QuestionForTest


class AssessmentResumeResponse(BaseSchema):
    """Réponse pour reprendre un assessment en cours."""
    session_id: UUID
    skill_slug: str
    skill_name: str
    total_questions: int
    current_index: int  # 0-based
    correct_so_far: int
    time_remaining_seconds: int
    current_question: QuestionForTest
    message: str = "Assessment en cours repris"


class AnswerResult(BaseSchema):
    """Résultat d'une réponse."""
    is_correct: bool
    correct_answer: str
    explanation: Optional[str]
    xp_earned: int

    # Mise à jour du score
    questions_answered: int
    correct_answers: int
    current_score_percentage: float


class AnswerResponse(BaseSchema):
    """Réponse complète après soumission."""
    result: AnswerResult
    next_question: Optional[QuestionForTest] = None
    is_complete: bool = False


class HintResponse(BaseSchema):
    """Réponse avec indice."""
    hint: str
    hint_number: int
    hints_remaining: int


# === RESULTS SCHEMAS ===

class TopicResultDetail(BaseSchema):
    """Résultat pour un topic spécifique."""
    topic_slug: str
    topic_name: str
    questions_count: int
    correct_count: int
    score_percentage: float
    status: Literal["passed", "partial", "failed"]


class AssessmentResults(BaseSchema):
    """Résultats complets de l'assessment."""
    session_id: UUID
    skill_slug: str
    skill_name: str

    # Scores
    total_questions: int
    correct_answers: int
    final_score: float

    # Niveau déterminé
    determined_level: str
    previous_level: Optional[str]
    level_changed: bool

    # XP
    xp_earned: int
    total_skill_xp: int

    # Détail par topic
    topics_breakdown: list[TopicResultDetail]
    strong_topics: list[str]
    weak_topics: list[str]

    # Temps
    total_time_seconds: int
    average_time_per_question: float

    # Certification
    certification_earned: bool
    certification_number: Optional[str] = None

    completed_at: datetime


class AssessmentResultsResponse(BaseSchema):
    """Réponse finale avec résultats."""
    results: AssessmentResults
    message: str
    recommendations: list[str]