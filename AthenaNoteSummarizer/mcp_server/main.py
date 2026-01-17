"""
Athena NoteSummarizer - MCP Server
Un agent AI pour aider les etudiants universitaires a resumer leurs notes
et s'integrer avec Brightspace et Omnivox.
"""

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import json
import os
import httpx
from dotenv import load_dotenv

load_dotenv()

# ============== Configuration OpenAI ==============
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")  # gpt-4o-mini est moins cher

app = FastAPI(
    title="Athena NoteSummarizer MCP Server",
    description="AI Agent pour resumer les notes des etudiants universitaires",
    version="1.0.0"
)

# CORS pour le widget
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============== OpenAI Client ==============

async def call_openai(prompt: str, system_prompt: str = None) -> str:
    """Appelle l'API OpenAI pour generer du contenu"""
    if not OPENAI_API_KEY:
        # Fallback vers simulation si pas de cle API
        return None

    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENAI_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": OPENAI_MODEL,
                    "messages": messages,
                    "temperature": 0.7,
                    "max_tokens": 2000
                },
                timeout=30.0
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"OpenAI Error: {e}")
            return None

# ============== MCP Tool Definitions ==============

MCP_TOOLS = {
    "summarize_notes": {
        "name": "summarize_notes",
        "description": "Resume des notes de cours en points cles. Supporte texte, PDF, et documents Word.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "content": {"type": "string", "description": "Le contenu des notes a resumer"},
                "style": {"type": "string", "enum": ["bullet_points", "paragraph", "cornell", "mind_map"], "default": "bullet_points"},
                "language": {"type": "string", "enum": ["fr", "en"], "default": "fr"}
            },
            "required": ["content"]
        }
    },
    "generate_flashcards": {
        "name": "generate_flashcards",
        "description": "Genere des flashcards pour memoriser les concepts cles",
        "inputSchema": {
            "type": "object",
            "properties": {
                "content": {"type": "string", "description": "Le contenu source"},
                "num_cards": {"type": "integer", "default": 10, "description": "Nombre de flashcards"}
            },
            "required": ["content"]
        }
    },
    "create_quiz": {
        "name": "create_quiz",
        "description": "Cree un quiz pour tester la comprehension",
        "inputSchema": {
            "type": "object",
            "properties": {
                "content": {"type": "string", "description": "Le contenu sur lequel baser le quiz"},
                "num_questions": {"type": "integer", "default": 5},
                "difficulty": {"type": "string", "enum": ["easy", "medium", "hard"], "default": "medium"}
            },
            "required": ["content"]
        }
    },
    "extract_key_concepts": {
        "name": "extract_key_concepts",
        "description": "Extrait les concepts cles et definitions d'un texte",
        "inputSchema": {
            "type": "object",
            "properties": {
                "content": {"type": "string", "description": "Le texte a analyser"}
            },
            "required": ["content"]
        }
    },
    "connect_brightspace": {
        "name": "connect_brightspace",
        "description": "Se connecte a Brightspace pour recuperer les notes de cours",
        "inputSchema": {
            "type": "object",
            "properties": {
                "institution_url": {"type": "string", "description": "URL de l'institution Brightspace"},
                "course_id": {"type": "string", "description": "ID du cours (optionnel)"}
            },
            "required": ["institution_url"]
        }
    },
    "connect_omnivox": {
        "name": "connect_omnivox",
        "description": "Se connecte a Omnivox pour recuperer les documents de cours (CEGEP)",
        "inputSchema": {
            "type": "object",
            "properties": {
                "college_code": {"type": "string", "description": "Code du college (ex: bdeb, maisonneuve)"}
            },
            "required": ["college_code"]
        }
    }
}

# ============== Pydantic Models ==============

class MCPRequest(BaseModel):
    tool: str
    arguments: dict

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    context: Optional[str] = None

# ============== MCP Endpoints ==============

@app.get("/mcp/tools")
async def list_tools():
    """Liste tous les outils MCP disponibles"""
    return {"tools": list(MCP_TOOLS.values())}

@app.post("/mcp/execute")
async def execute_tool(request: MCPRequest):
    """Execute un outil MCP"""
    if request.tool not in MCP_TOOLS:
        raise HTTPException(status_code=404, detail=f"Outil '{request.tool}' non trouve")

    tool_handlers = {
        "summarize_notes": handle_summarize,
        "generate_flashcards": handle_flashcards,
        "create_quiz": handle_quiz,
        "extract_key_concepts": handle_extract_concepts,
        "connect_brightspace": handle_brightspace,
        "connect_omnivox": handle_omnivox
    }

    handler = tool_handlers.get(request.tool)
    if handler:
        return await handler(request.arguments)

    raise HTTPException(status_code=500, detail="Handler non implemente")

# ============== AI-Powered Tool Handlers ==============

async def handle_summarize(args: dict):
    """Resume les notes avec AI"""
    content = args.get("content", "")
    style = args.get("style", "bullet_points")
    language = args.get("language", "fr")

    lang_instruction = "en francais" if language == "fr" else "in English"

    style_instructions = {
        "bullet_points": "sous forme de points cles (bullet points) clairs et concis",
        "paragraph": "en un paragraphe fluide et bien structure",
        "cornell": "selon la methode Cornell avec: 1) Notes principales, 2) Questions cles, 3) Resume",
        "mind_map": "sous forme de mind map textuelle avec un concept central et des branches"
    }

    system_prompt = f"""Tu es un assistant expert pour etudiants universitaires.
Tu dois resumer les notes de cours de maniere claire et pedagogique {lang_instruction}.
Garde les informations importantes et elimine le superflu."""

    prompt = f"""Resume ces notes de cours {style_instructions.get(style, style_instructions['bullet_points'])}:

---
{content}
---

Resume {lang_instruction}:"""

    # Appel AI
    ai_response = await call_openai(prompt, system_prompt)

    if ai_response:
        summary = ai_response
    else:
        # Fallback simulation si pas d'API key
        summary = generate_smart_summary_fallback(content, style, language)

    return {
        "success": True,
        "result": {
            "summary": summary,
            "word_count_original": len(content.split()),
            "word_count_summary": len(summary.split()),
            "reduction_percent": calculate_reduction(content, summary),
            "ai_powered": ai_response is not None
        }
    }

async def handle_flashcards(args: dict):
    """Genere des flashcards avec AI"""
    content = args.get("content", "")
    num_cards = args.get("num_cards", 10)

    system_prompt = """Tu es un expert en pedagogie et memorisation.
Tu crees des flashcards efficaces pour aider les etudiants a memoriser."""

    prompt = f"""Cree exactement {num_cards} flashcards basees sur ce contenu.

Contenu:
---
{content}
---

Reponds UNIQUEMENT en JSON valide avec ce format exact:
{{
  "flashcards": [
    {{"id": 1, "front": "Question ou concept", "back": "Reponse ou definition"}},
    {{"id": 2, "front": "...", "back": "..."}},
  ]
}}

Les questions doivent tester la comprehension des concepts cles.
Flashcards en JSON:"""

    ai_response = await call_openai(prompt, system_prompt)

    if ai_response:
        try:
            # Nettoyer la reponse JSON
            json_str = ai_response.strip()
            if json_str.startswith("```json"):
                json_str = json_str[7:]
            if json_str.startswith("```"):
                json_str = json_str[3:]
            if json_str.endswith("```"):
                json_str = json_str[:-3]

            data = json.loads(json_str.strip())
            flashcards = data.get("flashcards", [])
        except json.JSONDecodeError:
            flashcards = generate_flashcards_fallback(content, num_cards)
    else:
        flashcards = generate_flashcards_fallback(content, num_cards)

    return {
        "success": True,
        "result": {
            "flashcards": flashcards,
            "total": len(flashcards),
            "ai_powered": ai_response is not None
        }
    }

async def handle_quiz(args: dict):
    """Cree un quiz avec AI"""
    content = args.get("content", "")
    num_questions = args.get("num_questions", 5)
    difficulty = args.get("difficulty", "medium")

    difficulty_instructions = {
        "easy": "simples et directes, testant la memorisation de base",
        "medium": "moderees, testant la comprehension des concepts",
        "hard": "difficiles, testant l'analyse et l'application des concepts"
    }

    system_prompt = """Tu es un professeur expert en creation d'evaluations.
Tu crees des questions de quiz pedagogiques et bien formulees."""

    prompt = f"""Cree exactement {num_questions} questions de quiz basees sur ce contenu.
Les questions doivent etre {difficulty_instructions.get(difficulty, difficulty_instructions['medium'])}.

Contenu:
---
{content}
---

Reponds UNIQUEMENT en JSON valide avec ce format exact:
{{
  "quiz": [
    {{
      "id": 1,
      "question": "La question complete?",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correct_answer": "A",
      "explanation": "Explication de la bonne reponse"
    }}
  ]
}}

Quiz en JSON:"""

    ai_response = await call_openai(prompt, system_prompt)

    if ai_response:
        try:
            json_str = ai_response.strip()
            if json_str.startswith("```json"):
                json_str = json_str[7:]
            if json_str.startswith("```"):
                json_str = json_str[3:]
            if json_str.endswith("```"):
                json_str = json_str[:-3]

            data = json.loads(json_str.strip())
            quiz = data.get("quiz", [])
        except json.JSONDecodeError:
            quiz = generate_quiz_fallback(content, num_questions, difficulty)
    else:
        quiz = generate_quiz_fallback(content, num_questions, difficulty)

    return {
        "success": True,
        "result": {
            "quiz": quiz,
            "total_questions": len(quiz),
            "difficulty": difficulty,
            "ai_powered": ai_response is not None
        }
    }

async def handle_extract_concepts(args: dict):
    """Extrait les concepts cles avec AI"""
    content = args.get("content", "")

    system_prompt = """Tu es un expert en analyse de contenu academique.
Tu identifies les concepts cles et leurs definitions."""

    prompt = f"""Extrais les concepts cles de ce texte avec leurs definitions.

Texte:
---
{content}
---

Reponds UNIQUEMENT en JSON valide avec ce format exact:
{{
  "concepts": [
    {{"term": "Concept 1", "definition": "Definition claire et concise", "importance": "high/medium/low"}},
    {{"term": "Concept 2", "definition": "...", "importance": "..."}}
  ]
}}

Concepts en JSON:"""

    ai_response = await call_openai(prompt, system_prompt)

    if ai_response:
        try:
            json_str = ai_response.strip()
            if json_str.startswith("```json"):
                json_str = json_str[7:]
            if json_str.startswith("```"):
                json_str = json_str[3:]
            if json_str.endswith("```"):
                json_str = json_str[:-3]

            data = json.loads(json_str.strip())
            concepts = data.get("concepts", [])
        except json.JSONDecodeError:
            concepts = extract_concepts_fallback(content)
    else:
        concepts = extract_concepts_fallback(content)

    return {
        "success": True,
        "result": {
            "concepts": concepts,
            "total": len(concepts),
            "ai_powered": ai_response is not None
        }
    }

async def handle_brightspace(args: dict):
    """Integration Brightspace (D2L)

    NOTE: Pour une vraie integration, il faudrait:
    1. Enregistrer une app OAuth sur Brightspace
    2. Obtenir client_id et client_secret
    3. Implementer le flow OAuth 2.0
    4. Utiliser l'API Valence de D2L

    Documentation: https://docs.valence.desire2learn.com/
    """
    institution_url = args.get("institution_url", "")
    course_id = args.get("course_id")

    # Verifier si les credentials Brightspace sont configures
    brightspace_client_id = os.getenv("BRIGHTSPACE_CLIENT_ID")
    brightspace_client_secret = os.getenv("BRIGHTSPACE_CLIENT_SECRET")

    if brightspace_client_id and brightspace_client_secret:
        # Vraie integration (a implementer)
        return {
            "success": True,
            "result": {
                "status": "ready",
                "institution": institution_url,
                "message": "Credentials Brightspace configures. Redirection vers OAuth...",
                "oauth_url": f"{institution_url}/d2l/lp/auth/oauth2/authorize",
                "available_actions": ["authenticate", "sync_notes", "download_materials", "view_grades"]
            }
        }
    else:
        # Mode demo
        return {
            "success": True,
            "result": {
                "status": "demo_mode",
                "institution": institution_url,
                "message": "Mode demo - Configurez BRIGHTSPACE_CLIENT_ID et BRIGHTSPACE_CLIENT_SECRET pour une vraie integration.",
                "setup_instructions": [
                    "1. Allez sur le portail developpeur de votre institution Brightspace",
                    "2. Creez une application OAuth 2.0",
                    "3. Ajoutez les credentials dans votre fichier .env",
                    "4. Redemarrez le serveur"
                ],
                "available_actions": ["sync_notes", "download_materials", "view_grades"]
            }
        }

async def handle_omnivox(args: dict):
    """Integration Omnivox/Lea

    NOTE: Omnivox n'a pas d'API publique officielle.
    Options pour integration reelle:
    1. Web scraping avec Playwright/Selenium (necessite credentials etudiant)
    2. Extension navigateur qui envoie les donnees
    3. L'etudiant copie/colle manuellement ses notes

    Cette implementation est un placeholder.
    """
    college_code = args.get("college_code", "")

    colleges = {
        "bdeb": {"name": "College de Bois-de-Boulogne", "url": "https://bdeb.omnivox.ca"},
        "maisonneuve": {"name": "College de Maisonneuve", "url": "https://maisonneuve.omnivox.ca"},
        "ahuntsic": {"name": "College Ahuntsic", "url": "https://ahuntsic.omnivox.ca"},
        "vieux": {"name": "Vieux Montreal", "url": "https://vieuxmontreal.omnivox.ca"},
        "rosemont": {"name": "College de Rosemont", "url": "https://rosemont.omnivox.ca"},
        "lasalle": {"name": "College LaSalle", "url": "https://lasalle.omnivox.ca"}
    }

    college_info = colleges.get(college_code.lower(), {
        "name": f"College {college_code}",
        "url": f"https://{college_code}.omnivox.ca"
    })

    return {
        "success": True,
        "result": {
            "status": "ready",
            "college": college_info["name"],
            "portal_url": college_info["url"],
            "message": "Omnivox n'a pas d'API publique. Utilisez une de ces methodes:",
            "integration_options": [
                {
                    "method": "manual",
                    "description": "Copiez-collez vos notes depuis Lea/Omnivox",
                    "difficulty": "Facile"
                },
                {
                    "method": "browser_extension",
                    "description": "Installez notre extension Chrome pour synchroniser automatiquement",
                    "difficulty": "Moyen",
                    "status": "coming_soon"
                },
                {
                    "method": "file_upload",
                    "description": "Telechargez vos documents PDF depuis Omnivox et uploadez-les ici",
                    "difficulty": "Facile"
                }
            ],
            "available_actions": ["paste_notes", "upload_pdf", "install_extension"]
        }
    }

# ============== Fallback Functions (sans AI) ==============

def generate_smart_summary_fallback(content: str, style: str, language: str) -> str:
    """Fallback: Resume simple sans AI"""
    sentences = [s.strip() for s in content.split('.') if s.strip()]
    key_sentences = sentences[:min(5, len(sentences))]

    if style == "bullet_points":
        summary = "\n".join([f"• {s}" for s in key_sentences])
    elif style == "cornell":
        summary = f"**Notes principales:**\n"
        summary += "\n".join([f"- {s}" for s in key_sentences[:3]])
        summary += f"\n\n**Resume:**\n{'. '.join(key_sentences)}"
    elif style == "mind_map":
        summary = "**Concept Central:** " + (key_sentences[0] if key_sentences else "")
        summary += "\n**Branches:**\n"
        summary += "\n".join([f"  └─ {s}" for s in key_sentences[1:]])
    else:
        summary = '. '.join(key_sentences)

    summary += "\n\n⚠️ Resume genere sans AI (configurez OPENAI_API_KEY pour de meilleurs resultats)"
    return summary

def generate_flashcards_fallback(content: str, num_cards: int) -> list:
    """Fallback: Flashcards simples sans AI"""
    sentences = [s.strip() for s in content.split('.') if s.strip() and len(s.split()) > 3]
    flashcards = []

    for i, sentence in enumerate(sentences[:num_cards]):
        words = sentence.split()
        key_word = words[len(words)//2]
        question = sentence.replace(key_word, "_____")
        flashcards.append({
            "id": i + 1,
            "front": question,
            "back": key_word,
            "note": "Genere sans AI"
        })

    return flashcards

def generate_quiz_fallback(content: str, num_questions: int, difficulty: str) -> list:
    """Fallback: Quiz simple sans AI"""
    sentences = [s.strip() for s in content.split('.') if s.strip() and len(s.split()) > 5]
    quiz = []

    for i, sentence in enumerate(sentences[:num_questions]):
        quiz.append({
            "id": i + 1,
            "question": f"Completez cette phrase: {sentence[:len(sentence)//2]}...",
            "options": [
                f"A) {sentence}",
                "B) [Autre option]",
                "C) [Autre option]",
                "D) [Autre option]"
            ],
            "correct_answer": "A",
            "explanation": "La phrase complete est la bonne reponse.",
            "note": "Genere sans AI"
        })

    return quiz

def extract_concepts_fallback(content: str) -> list:
    """Fallback: Extraction simple sans AI"""
    words = content.split()
    concepts = []
    seen = set()

    for i, word in enumerate(words):
        clean_word = word.strip('.,!?:;()[]"\'')
        if clean_word and clean_word[0].isupper() and len(clean_word) > 3 and clean_word not in seen:
            context = ' '.join(words[max(0,i-5):min(len(words),i+6)])
            concepts.append({
                "term": clean_word,
                "definition": f"Voir contexte: {context}",
                "importance": "medium",
                "note": "Genere sans AI"
            })
            seen.add(clean_word)

    return concepts[:15]

def calculate_reduction(original: str, summary: str) -> int:
    """Calcule le pourcentage de reduction"""
    orig_len = len(original.split())
    sum_len = len(summary.split())
    if orig_len == 0:
        return 0
    return int((1 - sum_len / orig_len) * 100)

# ============== Chat Endpoint ==============

@app.post("/chat")
async def chat(request: ChatRequest):
    """Endpoint de chat intelligent avec AI"""
    messages_history = request.messages
    last_message = messages_history[-1].content if messages_history else ""
    context = request.context

    # Utiliser AI pour repondre si disponible
    if OPENAI_API_KEY:
        system_prompt = """Tu es NoteSummarizer, un assistant AI pour etudiants universitaires.
Tu aides a:
- Resumer des notes de cours
- Creer des flashcards et quiz
- Te connecter a Brightspace et Omnivox

Sois amical, concis et pedagogique. Reponds en francais."""

        # Construire l'historique pour l'AI
        ai_messages = [{"role": "system", "content": system_prompt}]
        for msg in messages_history[-5:]:  # Garder les 5 derniers messages
            ai_messages.append({"role": msg.role, "content": msg.content})

        if context:
            ai_messages[-1]["content"] += f"\n\nContexte des notes:\n{context[:1000]}"

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {OPENAI_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": OPENAI_MODEL,
                        "messages": ai_messages,
                        "temperature": 0.7,
                        "max_tokens": 500
                    },
                    timeout=30.0
                )
                response.raise_for_status()
                data = response.json()
                ai_response = data["choices"][0]["message"]["content"]

                return {
                    "response": ai_response,
                    "suggested_actions": detect_suggested_actions(last_message),
                    "ai_powered": True
                }
            except Exception as e:
                print(f"Chat AI Error: {e}")

    # Fallback sans AI
    response = process_chat_message_fallback(last_message, context)
    return {
        "response": response["message"],
        "suggested_actions": response.get("actions", []),
        "ai_powered": False
    }

def detect_suggested_actions(message: str) -> list:
    """Detecte les actions suggerees basees sur le message"""
    message_lower = message.lower()

    if any(word in message_lower for word in ["resume", "summarize", "résumé"]):
        return ["upload_file", "paste_text"]
    elif any(word in message_lower for word in ["flashcard", "carte", "memoriser"]):
        return ["paste_text", "use_last_summary"]
    elif any(word in message_lower for word in ["quiz", "test", "question"]):
        return ["easy", "medium", "hard"]
    elif any(word in message_lower for word in ["brightspace", "d2l"]):
        return ["connect_lms"]
    elif any(word in message_lower for word in ["omnivox", "lea", "cegep"]):
        return ["select_college", "paste_notes", "upload_pdf"]
    else:
        return ["summarize", "flashcards", "quiz", "connect_lms"]

def process_chat_message_fallback(message: str, context: str = None) -> dict:
    """Fallback pour le chat sans AI"""
    message_lower = message.lower()

    if any(word in message_lower for word in ["resume", "summarize", "résumé"]):
        return {
            "message": "Je peux resumer vos notes! Collez votre texte ou uploadez un fichier PDF/Word.",
            "actions": ["upload_file", "paste_text"],
            "tool": "summarize_notes"
        }
    elif any(word in message_lower for word in ["flashcard", "carte", "memoriser"]):
        return {
            "message": "Je vais creer des flashcards pour vous. Partagez le contenu a etudier.",
            "actions": ["paste_text", "use_last_summary"],
            "tool": "generate_flashcards"
        }
    elif any(word in message_lower for word in ["quiz", "test", "question"]):
        return {
            "message": "Je genere un quiz! Quel niveau: facile, moyen ou difficile?",
            "actions": ["easy", "medium", "hard"],
            "tool": "create_quiz"
        }
    elif any(word in message_lower for word in ["brightspace", "d2l"]):
        return {
            "message": "Pour Brightspace, j'ai besoin de l'URL de votre institution.",
            "actions": ["connect_lms"],
            "tool": "connect_brightspace"
        }
    elif any(word in message_lower for word in ["omnivox", "lea", "cegep"]):
        return {
            "message": "Pour Omnivox, quel est le code de votre CEGEP? (ex: bdeb, maisonneuve)",
            "actions": ["select_college"],
            "tool": "connect_omnivox"
        }
    else:
        return {
            "message": "👋 Bonjour! Je suis NoteSummarizer, votre assistant d'etude.\n\nJe peux:\n• 📝 Resumer vos notes\n• 🎴 Creer des flashcards\n• 📋 Generer des quiz\n• 🔗 Me connecter a Brightspace/Omnivox\n\nQue souhaitez-vous faire?",
            "actions": ["summarize", "flashcards", "quiz", "connect_lms"]
        }

# ============== File Upload ==============

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload et traite un fichier (PDF, Word, TXT)"""
    content = await file.read()
    filename = file.filename.lower()

    try:
        if filename.endswith('.txt'):
            text = content.decode('utf-8')
        elif filename.endswith('.pdf'):
            # Pour PDF, utiliser PyPDF2
            try:
                from PyPDF2 import PdfReader
                import io
                reader = PdfReader(io.BytesIO(content))
                text = ""
                for page in reader.pages:
                    text += page.extract_text() + "\n"
            except Exception as e:
                text = f"[Erreur extraction PDF: {str(e)}]"
        elif filename.endswith('.docx'):
            # Pour Word, utiliser python-docx
            try:
                from docx import Document
                import io
                doc = Document(io.BytesIO(content))
                text = "\n".join([para.text for para in doc.paragraphs])
            except Exception as e:
                text = f"[Erreur extraction DOCX: {str(e)}]"
        else:
            text = content.decode('utf-8', errors='ignore')

        return {
            "success": True,
            "filename": file.filename,
            "content": text,
            "word_count": len(text.split())
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erreur de traitement: {str(e)}")

# ============== Health Check ==============

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Athena NoteSummarizer MCP",
        "ai_enabled": OPENAI_API_KEY is not None,
        "model": OPENAI_MODEL if OPENAI_API_KEY else "none"
    }

@app.get("/")
async def root():
    return {
        "name": "Athena NoteSummarizer",
        "version": "2.0.0",
        "description": "AI Agent pour les etudiants universitaires",
        "ai_powered": OPENAI_API_KEY is not None,
        "endpoints": {
            "mcp_tools": "/mcp/tools",
            "mcp_execute": "/mcp/execute",
            "chat": "/chat",
            "upload": "/upload",
            "health": "/health"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
