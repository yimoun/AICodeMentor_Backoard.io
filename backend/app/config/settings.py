from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import Optional
from functools import lru_cache
import os


load_dotenv()

class Settings(BaseSettings):
    # ============================================================
    # APPLICATION
    # ============================================================
    APP_NAME: str = "AI Code Mentor"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = Field(default=False, description="Mode debug (True en dev, False en prod)")
    ENVIRONMENT: str = Field(default="development", description="development | staging | production")
    FRONTEND_URL: str = "localhost:8000/docs"

    # ============================================================
    # BASE DE DONNÉES POSTGRESQL (AWS RDS)
    # ============================================================

    POSTGRES_USER: str = Field(default="postgres", description="Nom d'utilisateur PostgreSQL")
    POSTGRES_PASSWORD: str = Field(description="Mot de passe PostgreSQL")
    POSTGRES_HOST: str = Field(default="localhost", description="Host de la BD (endpoint RDS en prod)")
    POSTGRES_PORT: int = Field(default=5432, description="Port PostgreSQL")
    POSTGRES_DB: str = Field(default="ai_code_mentor", description="Nom de la base de données")

    @property
    def DATABASE_URL(self) -> str:
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    @property
    def DATABASE_URL_SYNC(self) -> str:
        return (
            f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    # ============================================================
    # BACKBOARD.IO - API IA avec mémoire persistante
    # ============================================================

    BACKBOARD_API_KEY: str = Field(description="Clé API Backboard")
    BACKBOARD_API_URL: str = Field(
        default="https://app.backboard.io/api",
        description="URL de base de l'API Backboard"
    )
    BACKBOARD_ASSISTANT_ID: Optional[str] = Field(
        default=None,
        description="ID de l'assistant pré-créé (optionnel, peut être créé dynamiquement)"
    )

    # Configuration du modèle LLM via Backboard
    BACKBOARD_LLM_PROVIDER: str = Field(
        default="anthropic",
        description="Provider LLM: anthropic | openai | google"
    )
    BACKBOARD_LLM_MODEL: str = Field(
        default="claude-sonnet-4-20250514",
        description="Modèle à utiliser"
    )

    # ============================================================
    # AUTHENTIFICATION JWT
    # ============================================================

    JWT_SECRET_KEY: str = Field(
        description="Clé secrète pour signer les tokens JWT"
    )
    JWT_ALGORITHM: str = Field(
        default="HS256",
        description="Algorithme de signature JWT"
    )
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=30,
        description="Durée de vie du token d'accès en minutes"
    )
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = Field(
        default=7,
        description="Durée de vie du refresh token en jours"
    )

    # ============================================================
    # CORS - Cross-Origin Resource Sharing
    # ============================================================
    # Permet au frontend (React sur un autre port/domaine) de communiquer avec l'API

    CORS_ORIGINS: list[str] = Field(
        default=["http://localhost:3000", "http://localhost:5173"],
        description="Liste des origines autorisées (URLs du frontend)"
    )

    # ============================================================
    # CONFIGURATION PYDANTIC SETTINGS
    # ============================================================
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )

    # ============================================================
    # N8N
    # ============================================================
    N8N_URL : str = "https://kampo.app.n8n.cloud/webhook/user-registered"

    # ============================================================
    # GOOGLE OAUTH
    # ============================================================
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str = Field("http://127.0.0.1:8000/auth/google/callback")

    # ============================================================
    # SINGLETON - Instance unique des settings
    # ============================================================


@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()