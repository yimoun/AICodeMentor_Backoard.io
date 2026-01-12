"""
AI Code Mentor - Skills Router
==============================
Routes pour le catalogue de compétences et les skills utilisateur.
"""

from typing import Annotated, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.utils.dependencies import DBSession, CurrentUser, OptionalUser
from app.schemas.skills import *
from app.models import (
    SkillCategory, 
    Skill, 
    SkillPrerequisite, 
    Topic, 
    SkillTopic,
    UserSkillLevel
)
from app.models.enums import SkillTypeEnum, LevelEnum, PrerequisiteImportanceEnum
import app.services.progres_service

router = APIRouter(prefix="/skills", tags=["Skills"])


# ============================================================================
# CATEGORIES
# ============================================================================

@router.get(
    "/categories",
    response_model=SkillCategoryListResponse,
    summary="Lister les catégories",
    description="Retourne toutes les catégories de compétences."
)
async def list_categories(db: DBSession):
    """Liste toutes les catégories actives."""
    
    stmt = select(SkillCategory).where(
        SkillCategory.is_active == True
    ).order_by(SkillCategory.display_order)
    
    result = await db.execute(stmt)
    categories = result.scalars().all()
    
    # Compter les skills par catégorie
    category_responses = []
    for cat in categories:
        count_stmt = select(func.count(Skill.id)).where(
            Skill.category_id == cat.id,
            Skill.is_active == True
        )
        count_result = await db.execute(count_stmt)
        skills_count = count_result.scalar()
        
        category_responses.append(SkillCategoryResponse(
            id=cat.id,
            name=cat.name,
            slug=cat.slug,
            description=cat.description,
            icon=cat.icon,
            display_order=cat.display_order,
            skills_count=skills_count
        ))
    
    return SkillCategoryListResponse(categories=category_responses)


# ============================================================================
# LIST SKILLS
# ============================================================================

@router.get(
    "",
    response_model=SkillListResponse,
    summary="Lister les compétences",
    description="Retourne les compétences avec filtres optionnels."
)
async def list_skills(
    db: DBSession,
    current_user: OptionalUser,
    # Filtres
    type: Optional[str] = Query(None, description="Type: language, framework, etc."),
    category_slug: Optional[str] = Query(None, description="Slug de la catégorie"),
    difficulty: Optional[str] = Query(None, description="Niveau de difficulté de base"),
    is_featured: Optional[bool] = Query(None, description="Seulement les featured"),
    query: Optional[str] = Query(None, max_length=100, description="Recherche par nom"),
    # Pagination
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """Liste les compétences avec filtres."""
    
    stmt = select(Skill).where(Skill.is_active == True)
    
    # Appliquer les filtres
    if type:
        stmt = stmt.where(Skill.type == type)
    
    if category_slug:
        stmt = stmt.join(SkillCategory).where(SkillCategory.slug == category_slug)
    
    if difficulty:
        stmt = stmt.where(Skill.difficulty_base == difficulty)
    
    if is_featured is not None:
        stmt = stmt.where(Skill.is_featured == is_featured)
    
    if query:
        stmt = stmt.where(Skill.name.ilike(f"%{query}%"))
    
    # Compter le total
    count_stmt = select(func.count()).select_from(stmt.subquery())
    total_result = await db.execute(count_stmt)
    total = total_result.scalar()
    
    # Paginer
    stmt = stmt.order_by(Skill.learners_count.desc()).offset(offset).limit(limit)
    
    result = await db.execute(stmt)
    skills = result.scalars().all()
    
    # Charger les prérequis et l'inscription utilisateur
    skill_responses = []
    for skill in skills:
        # Prérequis
        prereq_stmt = select(SkillPrerequisite).where(
            SkillPrerequisite.skill_id == skill.id
        ).options(selectinload(SkillPrerequisite.prerequisite_skill))
        prereq_result = await db.execute(prereq_stmt)
        prerequisites = prereq_result.scalars().all()
        
        prereq_responses = [
            SkillPrerequisiteResponse(
                skill_slug=p.prerequisite_skill.slug,
                skill_name=p.prerequisite_skill.name,
                skill_icon=p.prerequisite_skill.icon,
                importance=p.importance.value,
                min_level=p.min_level.value,
                is_met=False  # À calculer si user connecté
            )
            for p in prerequisites
        ]
        
        # Vérifier si l'utilisateur est inscrit
        user_level = None
        user_xp = None
        is_enrolled = False
        
        if current_user:
            level_stmt = select(UserSkillLevel).where(
                UserSkillLevel.user_id == current_user.id,
                UserSkillLevel.skill_id == skill.id
            )
            level_result = await db.execute(level_stmt)
            user_skill = level_result.scalar_one_or_none()
            
            if user_skill:
                is_enrolled = True
                user_level = user_skill.current_level.value
                user_xp = user_skill.xp_points
                
                # Mettre à jour is_met pour les prérequis
                for prereq in prereq_responses:
                    prereq_level_stmt = select(UserSkillLevel).where(
                        UserSkillLevel.user_id == current_user.id,
                        UserSkillLevel.skill_id == (
                            select(Skill.id).where(Skill.slug == prereq.skill_slug)
                        )
                    )
                    prereq_level_result = await db.execute(prereq_level_stmt)
                    prereq_user_skill = prereq_level_result.scalar_one_or_none()
                    
                    if prereq_user_skill:
                        level_order = ["beginner", "intermediate", "advanced", "expert"]
                        prereq.is_met = (
                            level_order.index(prereq_user_skill.current_level.value) >= 
                            level_order.index(prereq.min_level)
                        )
        
        # Compter les topics
        topics_count_stmt = select(func.count(SkillTopic.id)).where(
            SkillTopic.skill_id == skill.id
        )
        topics_count_result = await db.execute(topics_count_stmt)
        topics_count = topics_count_result.scalar()
        
        skill_responses.append(SkillResponse(
            id=skill.id,
            name=skill.name,
            slug=skill.slug,
            type=skill.type.value,
            icon=skill.icon,
            color=skill.color,
            difficulty_base=skill.difficulty_base.value,
            learners_count=skill.learners_count,
            category_id=skill.category_id,
            description=skill.description,
            is_featured=skill.is_featured,
            prerequisites=prereq_responses,
            topics_count=topics_count,
            user_level=user_level,
            user_xp=user_xp,
            is_enrolled=is_enrolled
        ))
    
    return SkillListResponse(skills=skill_responses, total=total)


# ============================================================================
# GET SKILL DETAIL
# ============================================================================

@router.get(
    "/{slug}",
    response_model=SkillDetailResponse,
    summary="Détail d'une compétence",
    description="Retourne les détails complets d'une compétence."
)
async def get_skill(
    slug: str,
    db: DBSession,
    current_user: OptionalUser
):
    """Obtient le détail d'une compétence."""
    
    stmt = select(Skill).where(
        Skill.slug == slug,
        Skill.is_active == True
    )
    result = await db.execute(stmt)
    skill = result.scalar_one_or_none()
    
    if skill is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Compétence non trouvée"
        )
    
    # Topics
    topics_stmt = select(Topic, SkillTopic).join(
        SkillTopic, SkillTopic.topic_id == Topic.id
    ).where(
        SkillTopic.skill_id == skill.id,
        Topic.is_active == True
    ).order_by(SkillTopic.order_in_skill)
    
    topics_result = await db.execute(topics_stmt)
    topics_data = topics_result.all()
    
    topics = [
        TopicResponse(
            id=t.Topic.id,
            name=t.Topic.name,
            slug=t.Topic.slug,
            description=t.Topic.description,
            difficulty=t.Topic.difficulty.value,
            estimated_time_minutes=t.Topic.estimated_time_minutes,
            learning_order=t.SkillTopic.order_in_skill,
            is_core=t.SkillTopic.is_core
        )
        for t in topics_data
    ]
    
    # Prérequis (même logique que list_skills)
    prereq_stmt = select(SkillPrerequisite).where(
        SkillPrerequisite.skill_id == skill.id
    ).options(selectinload(SkillPrerequisite.prerequisite_skill))
    prereq_result = await db.execute(prereq_stmt)
    prerequisites = [
        SkillPrerequisiteResponse(
            skill_slug=p.prerequisite_skill.slug,
            skill_name=p.prerequisite_skill.name,
            skill_icon=p.prerequisite_skill.icon,
            importance=p.importance.value,
            min_level=p.min_level.value,
            is_met=False
        )
        for p in prereq_result.scalars()
    ]
    
    return SkillDetailResponse(
        id=skill.id,
        name=skill.name,
        slug=skill.slug,
        type=skill.type.value,
        icon=skill.icon,
        color=skill.color,
        difficulty_base=skill.difficulty_base.value,
        learners_count=skill.learners_count,
        category_id=skill.category_id,
        description=skill.description,
        is_featured=skill.is_featured,
        prerequisites=prerequisites,
        topics_count=len(topics),
        topics=topics,
        required_by=[],  # À implémenter
        metadata=skill.metadata_json or {}
    )


# ============================================================================
# GET SKILL TOPICS
# ============================================================================

@router.get(
    "/{slug}/topics",
    response_model=TopicListResponse,
    summary="Topics d'une compétence",
    description="Retourne les topics d'une compétence."
)
async def get_skill_topics(
    slug: str,
    db: DBSession,
    current_user: OptionalUser
):
    """Obtient les topics d'une compétence."""
    
    # Vérifier que le skill existe
    stmt = select(Skill).where(Skill.slug == slug, Skill.is_active == True)
    result = await db.execute(stmt)
    skill = result.scalar_one_or_none()
    
    if skill is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Compétence non trouvée"
        )
    
    # Topics
    topics_stmt = select(Topic, SkillTopic).join(
        SkillTopic, SkillTopic.topic_id == Topic.id
    ).where(
        SkillTopic.skill_id == skill.id,
        Topic.is_active == True
    ).order_by(SkillTopic.order_in_skill)
    
    topics_result = await db.execute(topics_stmt)
    topics_data = topics_result.all()
    
    # Charger la maîtrise utilisateur si connecté
    topics = []
    for t in topics_data:
        topic_response = TopicResponse(
            id=t.Topic.id,
            name=t.Topic.name,
            slug=t.Topic.slug,
            description=t.Topic.description,
            difficulty=t.Topic.difficulty.value,
            estimated_time_minutes=t.Topic.estimated_time_minutes,
            learning_order=t.SkillTopic.order_in_skill,
            is_core=t.SkillTopic.is_core
        )
        
        if current_user:
            from app.models import UserTopicMastery
            mastery_stmt = select(UserTopicMastery).where(
                UserTopicMastery.user_id == current_user.id,
                UserTopicMastery.topic_id == t.Topic.id,
                UserTopicMastery.skill_id == skill.id
            )
            mastery_result = await db.execute(mastery_stmt)
            mastery = mastery_result.scalar_one_or_none()
            
            if mastery:
                topic_response.mastery_score = float(mastery.mastery_score)
                topic_response.status = mastery.status
                topic_response.needs_review = mastery.needs_review
        
        topics.append(topic_response)
    
    return TopicListResponse(
        skill_slug=skill.slug,
        skill_name=skill.name,
        topics=topics,
        total=len(topics)
    )


# ============================================================================
# USER SKILLS
# ============================================================================

@router.get(
    "/user",
    response_model=UserSkillsListResponse,
    summary="Mes compétences",
    description="Retourne les compétences de l'utilisateur connecté."
)
async def get_user_skills(
    current_user: CurrentUser,
    db: DBSession
):
    """Obtient les compétences de l'utilisateur."""
    
    stmt = select(UserSkillLevel, Skill).join(
        Skill, Skill.id == UserSkillLevel.skill_id
    ).where(
        UserSkillLevel.user_id == current_user.id
    ).order_by(UserSkillLevel.started_at.desc())
    
    result = await db.execute(stmt)
    user_skills = result.all()
    
    from app.schemas.skills import SkillBasic
    
    skills = []
    total_xp = 0
    
    for us in user_skills:
        user_skill = us.UserSkillLevel
        skill = us.Skill
        
        total_xp += user_skill.xp_points
        
        skills.append(UserSkillResponse(
            skill=SkillBasic(
                id=skill.id,
                name=skill.name,
                slug=skill.slug,
                type=skill.type.value,
                icon=skill.icon,
                color=skill.color,
                difficulty_base=skill.difficulty_base.value,
                learners_count=skill.learners_count
            ),
            current_level=user_skill.current_level.value,
            xp_points=user_skill.xp_points,
            xp_for_next_level=user_skill.xp_for_next_level,
            xp_progress_percentage=user_skill.xp_progress_percentage,
            confidence_score=float(user_skill.confidence_score),
            streak_days=user_skill.streak_days,
            last_practiced_at=user_skill.last_practiced_at,
            started_at=user_skill.started_at,
            assessment_score=float(user_skill.assessment_score) if user_skill.assessment_score else None,
            assessment_date=user_skill.assessment_date
        ))
    
    return UserSkillsListResponse(
        skills=skills,
        total=len(skills),
        total_xp=total_xp
    )


@router.post(
    "/user",
    response_model=UserSkillAddResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Ajouter des compétences",
    description="Ajoute des compétences au profil utilisateur."
)
async def add_user_skills(
    data: UserSkillAdd,
    current_user: CurrentUser,
    db: DBSession
):
    """Ajoute des compétences au profil."""
    
    added_skills = []
    auto_added_prerequisites = []
    skipped_already_enrolled = []
    
    for slug in data.skill_slugs:
        # Trouver le skill
        stmt = select(Skill).where(Skill.slug == slug, Skill.is_active == True)
        result = await db.execute(stmt)
        skill = result.scalar_one_or_none()
        
        if skill is None:
            continue
        
        # Vérifier si déjà inscrit
        existing_stmt = select(UserSkillLevel).where(
            UserSkillLevel.user_id == current_user.id,
            UserSkillLevel.skill_id == skill.id
        )
        existing_result = await db.execute(existing_stmt)
        if existing_result.scalar_one_or_none():
            skipped_already_enrolled.append(slug)
            continue
        
        # Auto-ajouter les prérequis requis
        if data.auto_add_prerequisites:
            prereq_stmt = select(SkillPrerequisite).where(
                SkillPrerequisite.skill_id == skill.id,
                SkillPrerequisite.importance == PrerequisiteImportanceEnum.REQUIRED
            ).options(selectinload(SkillPrerequisite.prerequisite_skill))
            prereq_result = await db.execute(prereq_stmt)
            
            for prereq in prereq_result.scalars():
                prereq_skill = prereq.prerequisite_skill
                
                # Vérifier si déjà inscrit au prérequis
                prereq_existing_stmt = select(UserSkillLevel).where(
                    UserSkillLevel.user_id == current_user.id,
                    UserSkillLevel.skill_id == prereq_skill.id
                )
                prereq_existing_result = await db.execute(prereq_existing_stmt)
                
                if not prereq_existing_result.scalar_one_or_none():
                    # Ajouter le prérequis
                    prereq_level = UserSkillLevel(
                        user_id=current_user.id,
                        skill_id=prereq_skill.id,
                        current_level=LevelEnum.BEGINNER
                    )
                    db.add(prereq_level)
                    prereq_skill.increment_learners()
                    auto_added_prerequisites.append(prereq_skill.slug)
        
        # Ajouter le skill
        user_level = UserSkillLevel(
            user_id=current_user.id,
            skill_id=skill.id,
            current_level=LevelEnum.BEGINNER
        )
        db.add(user_level)
        skill.increment_learners()
        added_skills.append(slug)
    
    await db.commit()
    
    return UserSkillAddResponse(
        added_skills=added_skills,
        auto_added_prerequisites=auto_added_prerequisites,
        skipped_already_enrolled=skipped_already_enrolled,
        message=f"{len(added_skills)} compétence(s) ajoutée(s)"
    )


@router.delete(
    "/user/{skill_id}",
    response_model=dict,
    summary="Retirer une compétence",
    description="Retire une compétence du profil utilisateur."
)
async def remove_user_skill(
    skill_id: UUID,
    current_user: CurrentUser,
    db: DBSession
):
    """Retire une compétence du profil."""
    
    stmt = select(UserSkillLevel).where(
        UserSkillLevel.user_id == current_user.id,
        UserSkillLevel.skill_id == skill_id
    )
    result = await db.execute(stmt)
    user_skill = result.scalar_one_or_none()
    
    if user_skill is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Compétence non trouvée dans votre profil"
        )
    
    # Décrémenter le compteur
    skill = await db.get(Skill, skill_id)
    if skill:
        skill.decrement_learners()
    
    await db.delete(user_skill)
    await db.commit()
    
    return {"message": "Compétence retirée"}


# ============================================================================
# ENROLLEMENT IN SKILLS
# ============================================================================

@router.post("/skills/enroll/{skill_slug}", response_model=EnrollResponse)
async def enroll_in_skill(
        skill_slug: str,
        current_user: CurrentUser,
        db: DBSession,
        auto_add_prerequisites: bool = Query(
            default=True,
            description="Ajouter auto les prérequis recommandés"
        )
):
    """S'inscrit à un skill."""

    # 1. Trouver le skill
    stmt = select(Skill).where(Skill.slug == skill_slug, Skill.is_active == True)
    result = await db.execute(stmt)
    skill = result.scalar_one_or_none()

    if not skill:
        raise HTTPException(404, "Skill non trouvé")

    # 2. Vérifier pas déjà inscrit
    stmt = select(UserSkillLevel).where(
        UserSkillLevel.user_id == current_user.id,
        UserSkillLevel.skill_id == skill.id
    )
    result = await db.execute(stmt)
    if result.scalar_one_or_none():
        raise HTTPException(409, "Déjà inscrit à ce skill")

    # 3. Vérifier prérequis
    prereq_check = await check_prerequisites(current_user.id, skill.id, db)

    if not prereq_check["can_enroll"]:
        raise HTTPException(
            status_code=403,
            detail={
                "message": "Prérequis non remplis",
                "missing": prereq_check["missing"]
            }
        )

    # 4. Créer l'inscription
    user_skill = UserSkillLevel(
        user_id=current_user.id,
        skill_id=skill.id,
        current_level=LevelEnum.BEGINNER,
        xp_points=0
    )
    db.add(user_skill)

    # 5. Incrémenter le compteur
    skill.learners_count += 1

    # 6. Retourner les warnings (prérequis recommandés manquants)
    await db.commit()

    return EnrollResponse(
        message=f"Inscrit à {skill.name}",
        skill_slug=skill.slug,
        current_level="beginner",
        warnings=prereq_check["warnings"]
    )


@router.delete("/skills/enroll/{skill_slug}")
async def unenroll_from_skill(
        skill_slug: str,
        current_user: CurrentUser,
        db: DBSession
):
    """Se désinscrire d'un skill."""

    # 1. Trouver l'inscription
    stmt = select(UserSkillLevel, Skill).join(Skill).where(
        UserSkillLevel.user_id == current_user.id,
        Skill.slug == skill_slug
    )
    result = await db.execute(stmt)
    data = result.first()

    if not data:
        raise HTTPException(404, "Inscription non trouvée")

    user_skill, skill = data

    # 2. Vérifier qu'aucun autre skill ne dépend de celui-ci
    # (Optionnel : empêcher de se désinscrire de Python si inscrit à FastAPI)

    # 3. Supprimer l'inscription
    await db.delete(user_skill)

    # 4. Décrémenter le compteur
    skill.learners_count = max(0, skill.learners_count - 1)

    # 5. Supprimer les topic masteries associées (optionnel)
    stmt = delete(UserTopicMastery).where(
        UserTopicMastery.user_id == current_user.id,
        UserTopicMastery.skill_id == skill.id
    )
    await db.execute(stmt)

    await db.commit()

    return {"message": f"Désinscrit de {skill.name}"}