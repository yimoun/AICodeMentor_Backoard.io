import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layers, Brain, ClipboardList, Link2,
  ChevronRight, Loader2, CheckCircle, RefreshCw,
  GraduationCap, BookOpen
} from 'lucide-react'
import { executeMCPTool } from '../services/api'

interface ToolsPanelProps {
  notes: string
  summaryResult: any
  setSummaryResult: (result: any) => void
}

interface Tool {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
}

const tools: Tool[] = [
  {
    id: 'summarize_notes',
    name: 'Resume Intelligent',
    description: 'Cree un resume structure de tes notes',
    icon: <Layers size={24} />,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'generate_flashcards',
    name: 'Flashcards',
    description: 'Genere des cartes pour memoriser',
    icon: <Brain size={24} />,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'create_quiz',
    name: 'Quiz',
    description: 'Teste ta comprehension avec un quiz',
    icon: <ClipboardList size={24} />,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'connect_brightspace',
    name: 'Brightspace',
    description: 'Connecte ton compte D2L Brightspace',
    icon: <GraduationCap size={24} />,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'connect_omnivox',
    name: 'Omnivox / Lea',
    description: 'Connecte ton compte CEGEP',
    icon: <BookOpen size={24} />,
    color: 'from-indigo-500 to-purple-500'
  }
]

function ToolsPanel({ notes, summaryResult, setSummaryResult }: ToolsPanelProps) {
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [toolResult, setToolResult] = useState<any>(null)

  const handleToolClick = async (toolId: string) => {
    if (!notes && !['connect_brightspace', 'connect_omnivox'].includes(toolId)) {
      alert('Ajoute des notes dans l\'onglet "Mes Notes" d\'abord!')
      return
    }

    setActiveTool(toolId)
    setIsLoading(true)
    setToolResult(null)

    try {
      const args: any = { content: notes }

      if (toolId === 'connect_brightspace') {
        args.institution_url = 'https://university.brightspace.com'
      } else if (toolId === 'connect_omnivox') {
        args.college_code = 'bdeb'
      }

      const result = await executeMCPTool(toolId, args)
      setToolResult(result.result)

      if (toolId === 'summarize_notes' && result.result) {
        setSummaryResult(result.result)
      }
    } catch (error) {
      console.error('Tool error:', error)
      setToolResult({ error: 'Une erreur est survenue' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-full">
      {/* Tools List */}
      <div className="w-1/2 border-r border-white/10 p-4 overflow-y-auto">
        <h3 className="text-white/60 text-sm font-medium mb-4 uppercase tracking-wider">
          Outils MCP Disponibles
        </h3>
        <div className="space-y-2">
          {tools.map((tool) => (
            <motion.button
              key={tool.id}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleToolClick(tool.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                activeTool === tool.id
                  ? 'bg-white/20 border border-white/30'
                  : 'bg-white/5 hover:bg-white/10 border border-transparent'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center text-white`}>
                {tool.icon}
              </div>
              <div className="flex-1 text-left">
                <h4 className="text-white font-medium text-sm">{tool.name}</h4>
                <p className="text-white/50 text-xs">{tool.description}</p>
              </div>
              <ChevronRight size={16} className="text-white/30" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Result Panel */}
      <div className="w-1/2 p-4 overflow-y-auto">
        <h3 className="text-white/60 text-sm font-medium mb-4 uppercase tracking-wider">
          Resultat
        </h3>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-64"
            >
              <Loader2 size={40} className="text-white/50 animate-spin mb-4" />
              <p className="text-white/50">Traitement en cours...</p>
            </motion.div>
          ) : toolResult ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Summary Result */}
              {toolResult.summary && (
                <ResultCard title="Resume" icon={<Layers size={18} />}>
                  <p className="text-white/80 text-sm whitespace-pre-line">
                    {toolResult.summary}
                  </p>
                  {toolResult.reduction_percent && (
                    <div className="mt-3 flex items-center gap-2 text-green-400 text-xs">
                      <CheckCircle size={14} />
                      Reduit de {toolResult.reduction_percent}%
                    </div>
                  )}
                </ResultCard>
              )}

              {/* Flashcards Result */}
              {toolResult.flashcards && (
                <ResultCard title={`${toolResult.total} Flashcards`} icon={<Brain size={18} />}>
                  <div className="space-y-2">
                    {toolResult.flashcards.slice(0, 5).map((card: any) => (
                      <FlashcardItem key={card.id} card={card} />
                    ))}
                  </div>
                </ResultCard>
              )}

              {/* Quiz Result */}
              {toolResult.quiz && (
                <ResultCard title={`Quiz (${toolResult.total_questions} questions)`} icon={<ClipboardList size={18} />}>
                  <div className="space-y-3">
                    {toolResult.quiz.slice(0, 3).map((q: any) => (
                      <div key={q.id} className="bg-white/5 rounded-lg p-3">
                        <p className="text-white/80 text-sm mb-1">{q.question}</p>
                        <p className="text-white/40 text-xs">Difficulte: {q.difficulty}</p>
                      </div>
                    ))}
                  </div>
                </ResultCard>
              )}

              {/* LMS Connection Result */}
              {toolResult.status === 'connected' && (
                <ResultCard title="Connexion" icon={<Link2 size={18} />}>
                  <div className="flex items-center gap-2 text-green-400 mb-2">
                    <CheckCircle size={16} />
                    <span className="text-sm">{toolResult.message}</span>
                  </div>
                  {toolResult.available_actions && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {toolResult.available_actions.map((action: string) => (
                        <span key={action} className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/70">
                          {action}
                        </span>
                      ))}
                    </div>
                  )}
                </ResultCard>
              )}

              {/* Concepts Result */}
              {toolResult.concepts && (
                <ResultCard title={`${toolResult.total} Concepts Cles`} icon={<Layers size={18} />}>
                  <div className="flex flex-wrap gap-2">
                    {toolResult.concepts.map((c: any, i: number) => (
                      <span key={i} className="px-2 py-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full text-xs text-white">
                        {c.term}
                      </span>
                    ))}
                  </div>
                </ResultCard>
              )}

              {/* Error */}
              {toolResult.error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm">
                  {toolResult.error}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-64 text-white/30"
            >
              <RefreshCw size={40} className="mb-4" />
              <p className="text-center text-sm">
                Selectionne un outil pour commencer
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

interface ResultCardProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}

function ResultCard({ title, icon, children }: ResultCardProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="flex items-center gap-2 text-white font-medium mb-3">
        {icon}
        <span>{title}</span>
      </div>
      {children}
    </div>
  )
}

interface FlashcardItemProps {
  card: { id: number; front: string; back: string }
}

function FlashcardItem({ card }: FlashcardItemProps) {
  const [flipped, setFlipped] = useState(false)

  return (
    <motion.div
      onClick={() => setFlipped(!flipped)}
      className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-3 cursor-pointer hover:from-purple-500/30 hover:to-pink-500/30 transition-all"
    >
      <div className="text-xs text-white/40 mb-1">Carte #{card.id}</div>
      <p className="text-white/90 text-sm">
        {flipped ? card.back : card.front}
      </p>
      <div className="text-xs text-white/40 mt-2">
        {flipped ? 'Cliquer pour voir la question' : 'Cliquer pour voir la reponse'}
      </div>
    </motion.div>
  )
}

export default ToolsPanel
