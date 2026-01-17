# Athena NoteSummarizer

> AI Agent pour les etudiants universitaires - Resume tes notes, cree des flashcards, et connecte-toi a Brightspace & Omnivox

## Features

- **Resume Intelligent**: Transforme tes notes de cours en points cles structures
- **Flashcards Automatiques**: Genere des cartes memoire pour etudier efficacement
- **Quiz Personnalises**: Teste ta comprehension avec des quiz generes automatiquement
- **Integration Brightspace**: Connecte-toi a D2L Brightspace pour synchroniser tes notes
- **Integration Omnivox/Lea**: Acces direct a tes documents de CEGEP

## Architecture

```
AthenaNoteSummarizer/
├── mcp_server/          # MCP Server (FastAPI)
│   ├── main.py          # Serveur principal avec outils MCP
│   ├── requirements.txt
│   └── Dockerfile
├── widget/              # Widget React
│   ├── src/
│   │   ├── components/  # Composants React
│   │   ├── services/    # API services
│   │   └── styles/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## MCP Tools

| Outil | Description |
|-------|-------------|
| `summarize_notes` | Resume des notes en points cles (bullet points, Cornell, mind map) |
| `generate_flashcards` | Cree des flashcards pour memoriser |
| `create_quiz` | Genere un quiz avec 3 niveaux de difficulte |
| `extract_key_concepts` | Extrait les concepts et definitions cles |
| `connect_brightspace` | Integration avec D2L Brightspace |
| `connect_omnivox` | Integration avec Omnivox/Lea (CEGEPs) |

## Quick Start

### Avec Docker

```bash
# Cloner le repo
git clone https://github.com/your-username/AthenaNoteSummarizer.git
cd AthenaNoteSummarizer

# Lancer les services
docker-compose up -d

# Acceder au widget
open http://localhost:3000
```

### Developpement Local

**MCP Server:**
```bash
cd mcp_server
python -m venv venv
source venv/bin/activate  # ou `venv\Scripts\activate` sur Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

**Widget React:**
```bash
cd widget
npm install
npm run dev
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/mcp/tools` | GET | Liste les outils MCP disponibles |
| `/mcp/execute` | POST | Execute un outil MCP |
| `/chat` | POST | Endpoint de chat conversationnel |
| `/upload` | POST | Upload de fichiers (PDF, Word, TXT) |
| `/health` | GET | Health check |

## Exemple d'utilisation MCP

```json
POST /mcp/execute
{
  "tool": "summarize_notes",
  "arguments": {
    "content": "Vos notes de cours ici...",
    "style": "bullet_points",
    "language": "fr"
  }
}
```

## Tech Stack

- **Backend**: FastAPI, Python 3.11
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Containerisation**: Docker

## Athena AI Challenge

Ce projet est concu pour le **Athena AI Challenge** - Best AI Agent for University Students.

### Criteres de jugement

- **Utility & Adoption** (20%): Usage quotidien par les etudiants
- **Creativity** (20%): Idee unique de resume + integration LMS
- **User Experience** (20%): Interface intuitive et moderne
- **Design** (20%): Widget avec glassmorphism et animations fluides
- **Technical** (20%): MCP Server complet avec 6 outils

## Licence

MIT License - Fait avec pour les etudiants!
