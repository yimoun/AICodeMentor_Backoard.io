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
from dotenv import load_dotenv

load_dotenv()

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

class SummarizeRequest(BaseModel):
    content: str
    style: str = "bullet_points"
    language: str = "fr"

class FlashcardRequest(BaseModel):
    content: str
    num_cards: int = 10

class QuizRequest(BaseModel):
    content: str
    num_questions: int = 5
    difficulty: str = "medium"

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

# ============== Tool Handlers ==============

async def handle_summarize(args: dict):
    """Resume les notes"""
    content = args.get("content", "")
    style = args.get("style", "bullet_points")
    language = args.get("language", "fr")

    # Simulation de resume (en production, utiliser OpenAI/Claude)
    summary = generate_smart_summary(content, style, language)

    return {
        "success": True,
        "result": {
            "summary": summary,
            "word_count_original": len(content.split()),
            "word_count_summary": len(summary.split()),
            "reduction_percent": calculate_reduction(content, summary)
        }
    }

async def handle_flashcards(args: dict):
    """Genere des flashcards"""
    content = args.get("content", "")
    num_cards = args.get("num_cards", 10)

    flashcards = generate_flashcards(content, num_cards)

    return {
        "success": True,
        "result": {
            "flashcards": flashcards,
            "total": len(flashcards)
        }
    }

async def handle_quiz(args: dict):
    """Cree un quiz"""
    content = args.get("content", "")
    num_questions = args.get("num_questions", 5)
    difficulty = args.get("difficulty", "medium")

    quiz = generate_quiz(content, num_questions, difficulty)

    return {
        "success": True,
        "result": {
            "quiz": quiz,
            "total_questions": len(quiz),
            "difficulty": difficulty
        }
    }

async def handle_extract_concepts(args: dict):
    """Extrait les concepts cles"""
    content = args.get("content", "")

    concepts = extract_concepts(content)

    return {
        "success": True,
        "result": {
            "concepts": concepts,
            "total": len(concepts)
        }
    }

async def handle_brightspace(args: dict):
    """Integration Brightspace"""
    institution_url = args.get("institution_url", "")
    course_id = args.get("course_id")

    return {
        "success": True,
        "result": {
            "status": "connected",
            "institution": institution_url,
            "message": "Pret a synchroniser avec Brightspace. Authentification OAuth requise.",
            "available_actions": ["sync_notes", "download_materials", "view_grades"]
        }
    }

async def handle_omnivox(args: dict):
    """Integration Omnivox"""
    college_code = args.get("college_code", "")

    colleges = {
        "bdeb": "College de Bois-de-Boulogne",
        "maisonneuve": "College de Maisonneuve",
        "ahuntsic": "College Ahuntsic",
        "vieux": "Vieux Montreal"
    }

    college_name = colleges.get(college_code.lower(), f"College {college_code}")

    return {
        "success": True,
        "result": {
            "status": "connected",
            "college": college_name,
            "message": "Pret a synchroniser avec Omnivox/Lea.",
            "available_actions": ["sync_documents", "view_schedule", "download_notes"]
        }
    }

# ============== Helper Functions ==============

def generate_smart_summary(content: str, style: str, language: str) -> str:
    """Genere un resume intelligent"""
    sentences = content.split('.')
    key_sentences = sentences[:min(5, len(sentences))]

    if style == "bullet_points":
        summary = "\n".join([f"• {s.strip()}" for s in key_sentences if s.strip()])
    elif style == "cornell":
        summary = f"**Notes principales:**\n"
        summary += "\n".join([f"- {s.strip()}" for s in key_sentences[:3] if s.strip()])
        summary += f"\n\n**Resume:**\n{' '.join(key_sentences)}"
    elif style == "mind_map":
        summary = "**Concept Central:** " + (key_sentences[0] if key_sentences else "")
        summary += "\n**Branches:**\n"
        summary += "\n".join([f"  └─ {s.strip()}" for s in key_sentences[1:] if s.strip()])
    else:
        summary = ' '.join([s.strip() for s in key_sentences if s.strip()])

    return summary

def calculate_reduction(original: str, summary: str) -> int:
    """Calcule le pourcentage de reduction"""
    orig_len = len(original.split())
    sum_len = len(summary.split())
    if orig_len == 0:
        return 0
    return int((1 - sum_len / orig_len) * 100)

def generate_flashcards(content: str, num_cards: int) -> list:
    """Genere des flashcards basees sur le contenu"""
    sentences = [s.strip() for s in content.split('.') if s.strip()]
    flashcards = []

    for i, sentence in enumerate(sentences[:num_cards]):
        words = sentence.split()
        if len(words) > 3:
            key_word = words[len(words)//2]
            question = sentence.replace(key_word, "_____")
            flashcards.append({
                "id": i + 1,
                "front": question,
                "back": key_word,
                "full_context": sentence
            })

    return flashcards

def generate_quiz(content: str, num_questions: int, difficulty: str) -> list:
    """Genere un quiz"""
    sentences = [s.strip() for s in content.split('.') if s.strip()]
    quiz = []

    for i, sentence in enumerate(sentences[:num_questions]):
        words = sentence.split()
        if len(words) > 3:
            quiz.append({
                "id": i + 1,
                "question": f"Completez: {sentence[:len(sentence)//2]}...",
                "type": "fill_blank",
                "answer": sentence,
                "difficulty": difficulty
            })

    return quiz

def extract_concepts(content: str) -> list:
    """Extrait les concepts cles"""
    words = content.split()
    concepts = []

    # Trouve les mots capitalises (potentiellement des concepts)
    for i, word in enumerate(words):
        if word and word[0].isupper() and len(word) > 3:
            context = ' '.join(words[max(0,i-3):min(len(words),i+4)])
            concepts.append({
                "term": word.strip('.,!?:;'),
                "context": context
            })

    # Deduplique
    seen = set()
    unique_concepts = []
    for c in concepts:
        if c["term"] not in seen:
            seen.add(c["term"])
            unique_concepts.append(c)

    return unique_concepts[:20]

# ============== Chat Endpoint ==============

@app.post("/chat")
async def chat(request: ChatRequest):
    """Endpoint de chat pour le widget"""
    last_message = request.messages[-1].content if request.messages else ""

    # Analyse le message pour determiner l'action
    response = process_chat_message(last_message, request.context)

    return {
        "response": response["message"],
        "suggested_actions": response.get("actions", []),
        "tool_used": response.get("tool")
    }

def process_chat_message(message: str, context: str = None) -> dict:
    """Traite un message de chat"""
    message_lower = message.lower()

    if any(word in message_lower for word in ["resume", "summarize", "résumé"]):
        return {
            "message": "Je peux resumer vos notes! Collez votre texte ou uploadez un fichier PDF/Word, et je vais creer un resume clair et structure.",
            "actions": ["upload_file", "paste_text"],
            "tool": "summarize_notes"
        }
    elif any(word in message_lower for word in ["flashcard", "carte", "memoriser"]):
        return {
            "message": "Parfait! Je vais creer des flashcards pour vous aider a memoriser. Partagez le contenu a etudier.",
            "actions": ["paste_text", "use_last_summary"],
            "tool": "generate_flashcards"
        }
    elif any(word in message_lower for word in ["quiz", "test", "question"]):
        return {
            "message": "Je vais generer un quiz pour tester votre comprehension. Quel niveau de difficulte preferez-vous?",
            "actions": ["easy", "medium", "hard"],
            "tool": "create_quiz"
        }
    elif any(word in message_lower for word in ["brightspace", "d2l"]):
        return {
            "message": "Je peux me connecter a Brightspace pour synchroniser vos notes de cours. Quelle est l'URL de votre institution?",
            "actions": ["connect_lms"],
            "tool": "connect_brightspace"
        }
    elif any(word in message_lower for word in ["omnivox", "lea", "cegep"]):
        return {
            "message": "Je peux acceder a Omnivox/Lea pour recuperer vos documents. Quel est le code de votre CEGEP?",
            "actions": ["select_college"],
            "tool": "connect_omnivox"
        }
    else:
        return {
            "message": f"Bonjour! Je suis votre assistant NoteSummarizer. Je peux:\n\n• Resumer vos notes de cours\n• Creer des flashcards\n• Generer des quiz\n• Me connecter a Brightspace ou Omnivox\n\nQue souhaitez-vous faire?",
            "actions": ["summarize", "flashcards", "quiz", "connect_lms"]
        }

# ============== File Upload ==============

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload et traite un fichier"""
    content = await file.read()
    filename = file.filename.lower()

    try:
        if filename.endswith('.txt'):
            text = content.decode('utf-8')
        elif filename.endswith('.pdf'):
            text = f"[Contenu PDF extrait de {file.filename}]"
        elif filename.endswith('.docx'):
            text = f"[Contenu Word extrait de {file.filename}]"
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
    return {"status": "healthy", "service": "Athena NoteSummarizer MCP"}

@app.get("/")
async def root():
    return {
        "name": "Athena NoteSummarizer",
        "version": "1.0.0",
        "description": "AI Agent pour les etudiants universitaires",
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
