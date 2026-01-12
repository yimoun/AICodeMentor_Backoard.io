from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from app.models import UserCredits


async def check_credits(user_id: UUID, required: int, db: AsyncSession) -> bool:
    """Vérifie si l'utilisateur a assez de crédits."""
    stmt = select(UserCredits).where(UserCredits.user_id == user_id)
    result = await db.execute(stmt)
    credits = result.scalar_one_or_none()

    if not credits:
        return False

    return credits.total_available >= required


async def consume_credits(
        user_id: UUID,
        amount: int,
        description: str,
        session_id: UUID = None,
        db: AsyncSession = None
) -> int:
    """
    Consomme des crédits et retourne le solde restant.
    Raise HTTPException si pas assez de crédits.
    """
    stmt = select(UserCredits).where(UserCredits.user_id == user_id)
    result = await db.execute(stmt)
    credits = result.scalar_one_or_none()

    if not credits or credits.total_available < amount:
        raise HTTPException(
            status_code=402,
            detail={
                "message": "Crédits insuffisants",
                "required": amount,
                "available": credits.total_available if credits else 0
            }
        )

    # Utiliser d'abord les bonus, puis les crédits normaux
    if credits.bonus_credits >= amount:
        credits.bonus_credits -= amount
    elif credits.bonus_credits > 0:
        remaining = amount - credits.bonus_credits
        credits.bonus_credits = 0
        credits.credits_balance -= remaining
    else:
        credits.credits_balance -= amount

    credits.total_credits_used += amount

    # TODO: Créer une transaction dans credit_transactions

    await db.commit()

    return credits.total_available


async def get_credits_balance(user_id: UUID, db: AsyncSession) -> int:
    """Retourne le solde total de crédits."""
    stmt = select(UserCredits).where(UserCredits.user_id == user_id)
    result = await db.execute(stmt)
    credits = result.scalar_one_or_none()

    return credits.total_available if credits else 0