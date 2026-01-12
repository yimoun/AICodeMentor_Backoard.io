from uuid import UUID
from app.utils.dependencies import DBSession

from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.utils.dependencies import DBSession

from app.models.skills import SkillPrerequisite
from app.models.progress import UserSkillLevel
from app.models.enums import PrerequisiteImportanceEnum

async def check_prerequisites(
        user_id: UUID,
        skill_id: UUID,
        db: DBSession
) -> dict:
    """Vérifie si l'user peut s'inscrire à ce skill."""

    # 1. Récupérer les prérequis du skill
    stmt = select(SkillPrerequisite).where(
        SkillPrerequisite.skill_id == skill_id
    ).options(selectinload(SkillPrerequisite.prerequisite_skill))

    result = await db.execute(stmt)
    prerequisites = result.scalars().all()

    if not prerequisites:
        return {"can_enroll": True, "missing": [], "warnings": []}

    # 2. Récupérer les niveaux de l'user
    stmt = select(UserSkillLevel).where(UserSkillLevel.user_id == user_id)
    result = await db.execute(stmt)
    user_skills = {us.skill_id: us for us in result.scalars()}

    missing_required = []
    warnings = []

    level_order = ["beginner", "intermediate", "advanced", "expert"]

    # 3. Vérifier chaque prérequis
    for prereq in prerequisites:
        user_skill = user_skills.get(prereq.prerequisite_skill_id)

        has_skill = user_skill is not None
        has_level = False

        if has_skill:
            user_level_idx = level_order.index(user_skill.current_level.value)
            required_level_idx = level_order.index(prereq.min_level.value)
            has_level = user_level_idx >= required_level_idx

        if not has_level:
            prereq_info = {
                "skill_slug": prereq.prerequisite_skill.slug,
                "skill_name": prereq.prerequisite_skill.name,
                "required_level": prereq.min_level.value,
                "current_level": user_skill.current_level.value if has_skill else None
            }

            if prereq.importance == PrerequisiteImportanceEnum.REQUIRED:
                missing_required.append(prereq_info)
            elif prereq.importance == PrerequisiteImportanceEnum.RECOMMENDED:
                warnings.append(prereq_info)

    return {
        "can_enroll": len(missing_required) == 0,
        "missing": missing_required,
        "warnings": warnings
    }


async def _remove_skill_enrollment(user_id: UUID, skill_id: UUID, db: AsyncSession):
    """Supprime complètement une inscription (helper)."""

    # Supprimer UserSkillLevel
    stmt = delete(UserSkillLevel).where(
        UserSkillLevel.user_id == user_id,
        UserSkillLevel.skill_id == skill_id
    )
    await db.execute(stmt)

    # Supprimer UserTopicMastery
    stmt = delete(UserTopicMastery).where(
        UserTopicMastery.user_id == user_id,
        UserTopicMastery.skill_id == skill_id
    )
    await db.execute(stmt)

    # Décrémenter compteur
    stmt = update(Skill).where(Skill.id == skill_id).values(
        learners_count=Skill.learners_count - 1
    )
    await db.execute(stmt)


def calculate_mastery_score(
        times_correct: int,
        times_incorrect: int,
        current_score: float,
        is_correct: bool
) -> float:
    """
    Calcule le nouveau score de maîtrise.
    Moyenne pondérée : 70% historique, 30% nouvelle réponse.
    """
    new_result = 100.0 if is_correct else 0.0

    if times_correct + times_incorrect == 0:
        # Premier essai
        return new_result

    # Moyenne pondérée
    new_score = (current_score * 0.7) + (new_result * 0.3)

    return round(min(100, max(0, new_score)), 2)


def calculate_question_xp(
        difficulty: DifficultyEnum,
        is_correct: bool,
        is_first_attempt: bool,
        current_streak: int
) -> int:
    """Calcule l'XP gagné pour une question."""

    # Base XP selon difficulté
    base_xp = {
        DifficultyEnum.EASY: 5,
        DifficultyEnum.MEDIUM: 10,
        DifficultyEnum.HARD: 15,
        DifficultyEnum.EXPERT: 20
    }[difficulty]

    xp = base_xp

    # Bonus correct (+50%)
    if is_correct:
        xp = int(xp * 1.5)

    # Bonus première fois (+25 flat)
    if is_first_attempt:
        xp += 25

    # Bonus streak (+10% par jour, max +50%)
    streak_bonus = min(current_streak * 0.10, 0.50)
    xp = int(xp * (1 + streak_bonus))

    return xp


async def award_xp(
        user: User,
        skill_id: UUID,
        xp_amount: int,
        db: AsyncSession
) -> dict:
    """Distribue l'XP au profil et au skill."""

    # 1. Ajouter au profil global
    user.profile.total_xp += xp_amount
    user.profile.update_streak()

    # 2. Ajouter au skill spécifique
    stmt = select(UserSkillLevel).where(
        UserSkillLevel.user_id == user.id,
        UserSkillLevel.skill_id == skill_id
    )
    result = await db.execute(stmt)
    user_skill = result.scalar_one()

    level_up = user_skill.add_xp(xp_amount)

    await db.commit()

    return {
        "xp_earned": xp_amount,
        "new_total_xp": user.profile.total_xp,
        "skill_xp": user_skill.xp_points,
        "level_up": level_up,
        "new_level": user_skill.current_level.value if level_up else None,
        "current_streak": user.profile.current_streak
    }