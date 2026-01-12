
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from sqlalchemy import select

from app.models import UserSkillLevel, UserTopicMastery, Skill, Topic

from app.utils.dependencies import (
    DBSession,
    CurrentUser,
    RateLimiter,
    ClientInfo,
    get_current_user_optional,
)


async def handle_tool_call(
        tool_name: str,
        tool_args: dict,
        user_id: UUID,
        db: DBSession
) -> dict:
    """
    Gère les appels de tools depuis Backboard.

    Backboard envoie un webhook quand l'IA veut utiliser un tool.
    On exécute et on renvoie le résultat.
    """

    match tool_name:

        case "get_user_progress":
            return await _get_user_progress(
                user_id=user_id,
                skill_slug=tool_args["skill_slug"],
                db=db
            )

        case "suggest_exercise":
            return await _suggest_exercise(
                topic_slug=tool_args["topic_slug"],
                difficulty=tool_args.get("difficulty", "medium"),
                db=db
            )

        case "check_code":
            return await _check_code(
                code=tool_args["code"],
                language=tool_args["language"],
                expected_output=tool_args.get("expected_output")
            )

        case "record_topic_practice":
            return await _record_topic_practice(
                user_id=user_id,
                topic_slug=tool_args["topic_slug"],
                quality=int(tool_args["quality"]),  # cast string -> int
                db=db
            )

        case "evaluate_user_answer":
            return await _evaluate_user_answer(
                user_id=user_id,
                topic_slug=tool_args["topic_slug"],
                scores=tool_args["scores"],
                feedback=tool_args["feedback"],
                db=db
            )

        case _:
            return {"error": f"Unknown tool: {tool_name}"}


async def _get_user_progress(
        user_id: UUID,
        skill_slug: str,
        db: DBSession
) -> dict:
    """Récupère la progression de l'utilisateur."""

    # Trouver le skill
    stmt = select(Skill).where(Skill.slug == skill_slug)
    result = await db.execute(stmt)
    skill = result.scalar_one_or_none()

    if not skill:
        return {"error": f"Skill '{skill_slug}' not found"}

    # Progression du skill
    stmt = select(UserSkillLevel).where(
        UserSkillLevel.user_id == user_id,
        UserSkillLevel.skill_id == skill.id
    )
    result = await db.execute(stmt)
    user_skill = result.scalar_one_or_none()

    if not user_skill:
        return {
            "enrolled": False,
            "message": f"L'utilisateur n'est pas inscrit à {skill.name}"
        }

    # Topics maîtrisés et faibles
    stmt = select(UserTopicMastery, Topic).join(Topic).where(
        UserTopicMastery.user_id == user_id,
        UserTopicMastery.skill_id == skill.id
    )
    result = await db.execute(stmt)
    masteries = result.all()

    mastered_topics = []
    weak_topics = []

    for mastery, topic in masteries:
        if mastery.mastery_score >= 80:
            mastered_topics.append(topic.name)
        elif mastery.mastery_score < 50:
            weak_topics.append(topic.name)

    return {
        "enrolled": True,
        "skill_name": skill.name,
        "current_level": user_skill.current_level.value,
        "xp_points": user_skill.xp_points,
        "confidence_score": float(user_skill.confidence_score),
        "mastered_topics": mastered_topics,
        "weak_topics": weak_topics,
        "last_practiced": user_skill.last_practiced_at.isoformat() if user_skill.last_practiced_at else None
    }


async def _record_topic_practice(
        user_id: UUID,
        topic_slug: str,
        quality: int,
        db: DBSession
) -> dict:
    """Enregistre une pratique de topic."""

    # Conversion de la quality en int

    quality = int(quality)
    quality = max(0, min(5, quality))

    # Trouver le topic
    stmt = select(Topic).where(Topic.slug == topic_slug)
    result = await db.execute(stmt)
    topic = result.scalar_one_or_none()

    if not topic:
        return {"error": f"Topic '{topic_slug}' not found"}

    # Trouver ou créer le mastery
    stmt = select(UserTopicMastery).where(
        UserTopicMastery.user_id == user_id,
        UserTopicMastery.topic_id == topic.id
    )
    result = await db.execute(stmt)
    mastery = result.scalar_one_or_none()

    if not mastery:
        return {"error": "User has no mastery record for this topic"}

    # Enregistrer la pratique
    is_correct = quality >= 3
    mastery.record_practice(is_correct=is_correct, quality=quality)

    await db.commit()

    return {
        "recorded": True,
        "topic": topic.name,
        "new_mastery_score": float(mastery.mastery_score),
        "status": mastery.status,
        "next_review_date": mastery.next_review_date.isoformat() if mastery.next_review_date else None
    }


async def _suggest_exercise(
        topic_slug: str,
        difficulty: str,
        db: DBSession
) -> dict:
    """Suggère un exercice. (Simplifié - à enrichir)"""

    # Pour le MVP, retourne un exercice template
    # Plus tard : base de données d'exercices

    exercises = {
        "variables": {
            "easy": "Crée une variable `age` avec ta valeur d'âge et affiche-la.",
            "medium": "Crée un programme qui échange les valeurs de deux variables sans utiliser une troisième variable.",
            "hard": "Implémente un système de cache simple utilisant un dictionnaire avec expiration."
        },
        "async-await": {
            "easy": "Écris une fonction async qui attend 2 secondes puis retourne 'Hello'.",
            "medium": "Crée deux fonctions async qui s'exécutent en parallèle avec asyncio.gather().",
            "hard": "Implémente un rate limiter async qui limite à 5 requêtes par seconde."
        }
    }

    topic_exercises = exercises.get(topic_slug, {})
    exercise = topic_exercises.get(difficulty, "Aucun exercice disponible pour ce topic.")

    return {
        "topic": topic_slug,
        "difficulty": difficulty,
        "exercise": exercise
    }


async def _check_code(
        code: str,
        language: str,
        expected_output: str = None
) -> dict:
    """
    Vérifie du code.
    Pour le MVP : analyse statique simple.
    Plus tard : exécution sandboxée.
    """

    # Vérifications basiques
    issues = []

    if language == "python":
        if "import os" in code and "system" in code:
            issues.append("Attention: os.system() peut être dangereux")
        if "eval(" in code:
            issues.append("Attention: eval() peut être dangereux")
        if "    " not in code and "def " in code:
            issues.append("Indentation manquante après def")

    elif language == "javascript":
        if "var " in code:
            issues.append("Préfère 'let' ou 'const' à 'var'")
        if "==" in code and "===" not in code:
            issues.append("Préfère '===' pour les comparaisons strictes")

    return {
        "language": language,
        "syntax_ok": len(issues) == 0,
        "issues": issues,
        "note": "Analyse statique uniquement. L'exécution n'est pas disponible dans cette version."
    }

async def _evaluate_user_answer(
    user_id: UUID,
    topic_slug: str,
    scores: dict,
    feedback: dict,
    db: AsyncSession
) -> dict:
    """
    Évalue une réponse utilisateur (scoring + feedback).
    """

    stmt = select(Topic).where(Topic.slug == topic_slug)
    result = await db.execute(stmt)
    topic = result.scalar_one_or_none()

    if not topic:
        return {"error": f"Topic '{topic_slug}' not found"}

    avg_score = (
        int(scores["understanding"]) +
        int(scores.get("autonomy", 3))
    ) / 2

    return {
        "evaluated": True,
        "topic": topic.name,
        "average_score": avg_score,
        "strengths": feedback["strengths"],
        "improvements": feedback.get("improvements"),
        "next_step": feedback["next_step"]
    }
