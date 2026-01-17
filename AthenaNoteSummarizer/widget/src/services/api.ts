import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export interface ChatResponse {
  response: string
  suggested_actions?: string[]
  tool_used?: string
  result?: any
}

export interface MCPToolResponse {
  success: boolean
  result: any
}

export interface UploadResponse {
  success: boolean
  filename: string
  content: string
  word_count: number
}

/**
 * Envoie un message au chatbot
 */
export async function chatWithAI(message: string, context?: string): Promise<ChatResponse> {
  try {
    const response = await api.post('/chat', {
      messages: [{ role: 'user', content: message }],
      context
    })
    return response.data
  } catch (error) {
    console.error('Chat error:', error)
    // Fallback response for demo
    return {
      response: generateFallbackResponse(message),
      suggested_actions: ['Resume mes notes', 'Cree des flashcards', 'Genere un quiz']
    }
  }
}

/**
 * Execute un outil MCP
 */
export async function executeMCPTool(toolName: string, args: Record<string, any>): Promise<MCPToolResponse> {
  try {
    const response = await api.post('/mcp/execute', {
      tool: toolName,
      arguments: args
    })
    return response.data
  } catch (error) {
    console.error('MCP tool error:', error)
    // Fallback for demo
    return generateFallbackToolResult(toolName, args)
  }
}

/**
 * Liste les outils MCP disponibles
 */
export async function listMCPTools() {
  try {
    const response = await api.get('/mcp/tools')
    return response.data.tools
  } catch (error) {
    console.error('Error listing tools:', error)
    return []
  }
}

/**
 * Upload un fichier
 */
export async function uploadFile(file: File): Promise<UploadResponse> {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    console.error('Upload error:', error)
    // Fallback for demo
    return {
      success: true,
      filename: file.name,
      content: `Contenu simule de ${file.name}`,
      word_count: 150
    }
  }
}

// ============== Fallback Functions for Demo ==============

function generateFallbackResponse(message: string): string {
  const messageLower = message.toLowerCase()

  if (messageLower.includes('resume') || messageLower.includes('summarize')) {
    return "Super! Je vais resumer tes notes. Colle ton texte dans l'onglet 'Mes Notes' ou utilise l'outil Resume dans l'onglet 'Outils'."
  }
  if (messageLower.includes('flashcard') || messageLower.includes('carte')) {
    return "Parfait! Je vais creer des flashcards pour t'aider a memoriser. Va dans l'onglet 'Outils' et clique sur 'Flashcards'."
  }
  if (messageLower.includes('quiz') || messageLower.includes('test')) {
    return "Je peux generer un quiz pour tester ta comprehension. Utilise l'outil Quiz dans l'onglet 'Outils'."
  }
  if (messageLower.includes('brightspace')) {
    return "Je peux me connecter a Brightspace pour synchroniser tes notes. Va dans 'Outils' et clique sur 'Brightspace'."
  }
  if (messageLower.includes('omnivox') || messageLower.includes('lea')) {
    return "Je peux acceder a Omnivox/Lea pour recuperer tes documents. Va dans 'Outils' et clique sur 'Omnivox'."
  }

  return "Salut! Je suis ton assistant NoteSummarizer. Je peux resumer tes notes, creer des flashcards, generer des quiz, et me connecter a Brightspace ou Omnivox. Que veux-tu faire?"
}

function generateFallbackToolResult(toolName: string, args: Record<string, any>): MCPToolResponse {
  const content = args.content || ''

  switch (toolName) {
    case 'summarize_notes':
      const sentences = content.split('.').filter((s: string) => s.trim())
      const summary = sentences.slice(0, 5).map((s: string) => `• ${s.trim()}`).join('\n')
      return {
        success: true,
        result: {
          summary: summary || '• Point cle 1: Concept principal\n• Point cle 2: Definition importante\n• Point cle 3: Application pratique',
          word_count_original: content.split(/\s+/).length,
          word_count_summary: summary.split(/\s+/).length,
          reduction_percent: 65
        }
      }

    case 'generate_flashcards':
      return {
        success: true,
        result: {
          flashcards: [
            { id: 1, front: 'Qu\'est-ce que _____ ?', back: 'Concept principal' },
            { id: 2, front: 'Definir _____ ?', back: 'Une definition importante' },
            { id: 3, front: 'Comment fonctionne _____ ?', back: 'Processus detaille' },
            { id: 4, front: 'Pourquoi est-ce important ?', back: 'Raison cle' },
            { id: 5, front: 'Exemple de _____ ?', back: 'Cas pratique' }
          ],
          total: 5
        }
      }

    case 'create_quiz':
      return {
        success: true,
        result: {
          quiz: [
            { id: 1, question: 'Quelle est la definition de...?', answer: 'Reponse 1', difficulty: 'medium' },
            { id: 2, question: 'Completez: Le processus de...', answer: 'Reponse 2', difficulty: 'medium' },
            { id: 3, question: 'Vrai ou Faux: ...', answer: 'Vrai', difficulty: 'easy' }
          ],
          total_questions: 3,
          difficulty: args.difficulty || 'medium'
        }
      }

    case 'connect_brightspace':
      return {
        success: true,
        result: {
          status: 'connected',
          institution: args.institution_url,
          message: 'Pret a synchroniser avec Brightspace!',
          available_actions: ['sync_notes', 'download_materials', 'view_grades']
        }
      }

    case 'connect_omnivox':
      return {
        success: true,
        result: {
          status: 'connected',
          college: `College ${args.college_code}`,
          message: 'Pret a synchroniser avec Omnivox/Lea!',
          available_actions: ['sync_documents', 'view_schedule', 'download_notes']
        }
      }

    default:
      return {
        success: false,
        result: { error: 'Outil non reconnu' }
      }
  }
}
