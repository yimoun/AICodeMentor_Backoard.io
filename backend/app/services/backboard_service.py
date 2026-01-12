# services/backboard_service.py

import httpx
from typing import Optional, AsyncGenerator
from uuid import UUID

from app.config.settings import settings


class BackboardService:
    """Service pour interagir avec Backboard.io API."""

    def __init__(self):
        self.base_url = settings.BACKBOARD_API_URL
        self.headers = {
            "Authorization": f"Bearer {settings.BACKBOARD_API_KEY}",
            "Content-Type": "application/json"
        }
        self.assistant_id = settings.BACKBOARD_ASSISTANT_ID

    async def create_thread(
            self,
            user_id: str,
            metadata: dict = None
    ) -> dict:
        """
        Crée un nouveau thread de conversation.

        Args:
            user_id: ID de l'utilisateur (pour contexte)
            metadata: Métadonnées additionnelles (skill, topic, etc.)

        Returns:
            {"thread_id": "...", "created_at": "..."}
        """
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/threads",
                headers=self.headers,
                json={
                    "assistant_id": self.assistant_id,
                    "metadata": {
                        "user_id": user_id,
                        **(metadata or {})
                    }
                }
            )
            response.raise_for_status()
            return response.json()

    async def send_message(
            self,
            thread_id: str,
            content: str,
            user_context: dict = None
    ) -> dict:
        """
        Envoie un message et reçoit la réponse de l'IA.

        Args:
            thread_id: ID du thread Backboard
            content: Message de l'utilisateur
            user_context: Contexte additionnel (niveau, skill actuel, etc.)

        Returns:
            {
                "message_id": "...",
                "content": "Réponse de l'IA...",
                "tokens_used": 150,
                "model": "claude-3-sonnet"
            }
        """
        payload = {
            "content": content,
            "memory": "Auto"
        }

        if user_context:
            payload["context"] = user_context

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{self.base_url}/threads/{thread_id}/messages",
                headers=self.headers,
                json=payload
            )
            response.raise_for_status()
            return response.json()

    async def send_message_stream(
            self,
            thread_id: str,
            content: str,
            user_context: dict = None
    ) -> AsyncGenerator[str, None]:
        """
        Envoie un message et stream la réponse (Server-Sent Events).

        Yields:
            Chunks de texte au fur et à mesure
        """
        payload = {
            "content": content,
            "stream": True,
            "memory": "Auto"
        }

        if user_context:
            payload["context"] = user_context

        async with httpx.AsyncClient(timeout=120.0) as client:
            async with client.stream(
                    "POST",
                    f"{self.base_url}/threads/{thread_id}/messages",
                    headers=self.headers,
                    json=payload
            ) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        chunk = line[6:]  # Enlever "data: "
                        if chunk != "[DONE]":
                            yield chunk

    async def get_thread_messages(
            self,
            thread_id: str,
            limit: int = 50
    ) -> list[dict]:
        """
        Récupère l'historique des messages d'un thread.

        Returns:
            Liste de messages [{"role": "user", "content": "..."}, ...]
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/threads/{thread_id}/messages",
                headers=self.headers,
                params={"limit": limit}
            )
            response.raise_for_status()
            return response.json()["messages"]

    async def delete_thread(self, thread_id: str) -> bool:
        """Supprime un thread."""
        async with httpx.AsyncClient() as client:
            response = await client.delete(
                f"{self.base_url}/threads/{thread_id}",
                headers=self.headers
            )
            return response.status_code == 204

    async def update_thread_metadata(
            self,
            thread_id: str,
            metadata: dict
    ) -> dict:
        """Met à jour les métadonnées d'un thread."""
        async with httpx.AsyncClient() as client:
            response = await client.patch(
                f"{self.base_url}/threads/{thread_id}",
                headers=self.headers,
                json={"metadata": metadata}
            )
            response.raise_for_status()
            return response.json()


# Singleton
backboard_service = BackboardService()