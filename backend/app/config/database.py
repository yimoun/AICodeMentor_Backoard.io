from sqlalchemy.ext.asyncio import (
    create_async_engine,
    AsyncSession,
    async_sessionmaker,
    AsyncEngine
)
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.pool import NullPool
from typing import AsyncGenerator

from app.config.settings import settings



# ============================================================
# ENGINE - Moteur de connexion à PostgreSQL
# ============================================================
engine: AsyncEngine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,

    # Pool de connexions
    # En production avec AWS RDS, on peut garder le pool par défaut
    # Pour les tests, on utilise NullPool (pas de réutilisation)
    # poolclass=NullPool,  # Décommenter pour les tests

    # Taille du pool de connexions
    pool_size=5,
    max_overflow=10,
    pool_timeout=30,
    pool_recycle=1800,

    # Options de connexion PostgreSQL
    connect_args={
        # Timeout de commande SQL (en secondes)
        "command_timeout": 60,
        # SSL requis pour AWS RDS
        "ssl": "require",
    },
)

# ============================================================
# SESSION FACTORY - Fabrique de sessions
# ============================================================

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


# ============================================================
# BASE - Classe de base pour tous les models
# ============================================================
from sqlalchemy import Column, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
import uuid


class Base(DeclarativeBase):
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            # Si tout va bien, on commit les changements
            await session.commit()
        except Exception:
            # Si erreur, on annule tous les changements
            await session.rollback()
            raise
        finally:
            # Dans tous les cas, on ferme la session
            await session.close()


# ============================================================
# FONCTIONS UTILITAIRES
# ============================================================

async def create_all_tables() -> None:
    async with engine.begin() as conn:
        from app.models import auth, profile
        await conn.run_sync(Base.metadata.create_all)


async def drop_all_tables() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


async def dispose_engine() -> None:
    await engine.dispose()