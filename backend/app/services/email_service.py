import secrets
import string
import httpx
from fastapi import FastAPI

def generate_verification_code():
    return ''.join(secrets.choice(string.digits) for _ in range(6))

async def send_n8n_webhook(data: dict, url: str):
    async with httpx.AsyncClient() as client:
        try:
            print("Appel à n8n" + url)
            await client.post(url, json=data)
            print("appel effectué")
        except Exception as e:
            print(f"Erreur lors de l'envoi à n8n: {e}")