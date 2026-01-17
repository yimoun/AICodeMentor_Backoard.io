import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Paperclip, Mic, Bot, User, Loader2 } from 'lucide-react'
import { chatWithAI, uploadFile } from '../services/api'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestedActions?: string[]
}

interface ChatWidgetProps {
  notes: string
  onSummaryGenerated: (result: any) => void
  isProcessing: boolean
  setIsProcessing: (v: boolean) => void
}

function ChatWidget({ notes, onSummaryGenerated, isProcessing, setIsProcessing }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Salut! Je suis ton assistant NoteSummarizer. Je peux t'aider a:\n\n• Resumer tes notes de cours\n• Creer des flashcards pour etudier\n• Generer des quiz\n• Te connecter a Brightspace ou Omnivox\n\nQu'est-ce que tu veux faire aujourd'hui?",
      timestamp: new Date(),
      suggestedActions: ['Resume mes notes', 'Cree des flashcards', 'Connecter Brightspace']
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const response = await chatWithAI(input, notes)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        suggestedActions: response.suggested_actions
      }

      setMessages(prev => [...prev, aiMessage])

      if (response.result) {
        onSummaryGenerated(response.result)
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Desole, j'ai eu un probleme. Peux-tu reessayer?",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleActionClick = (action: string) => {
    setInput(action)
    setTimeout(() => handleSend(), 100)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    try {
      const result = await uploadFile(file)

      const uploadMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: `J'ai uploade: ${file.name}`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, uploadMessage])

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Parfait! J'ai recu ton fichier "${file.name}" (${result.word_count} mots). Que veux-tu que je fasse avec?`,
        timestamp: new Date(),
        suggestedActions: ['Resume ce document', 'Cree des flashcards', 'Genere un quiz']
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'assistant'
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                  : 'bg-gradient-to-br from-blue-500 to-cyan-500'
              }`}>
                {message.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                <div className={`rounded-2xl px-4 py-3 ${
                  message.role === 'assistant'
                    ? 'bg-white/10 text-white'
                    : 'bg-white text-gray-800'
                }`}>
                  <p className="whitespace-pre-line text-sm">{message.content}</p>
                </div>

                {/* Suggested Actions */}
                {message.suggestedActions && message.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {message.suggestedActions.map((action, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleActionClick(action)}
                        className="px-3 py-1.5 text-xs font-medium rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                      >
                        {action}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="bg-white/10 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span className="typing-dot w-2 h-2 bg-white/60 rounded-full"></span>
                <span className="typing-dot w-2 h-2 bg-white/60 rounded-full"></span>
                <span className="typing-dot w-2 h-2 bg-white/60 rounded-full"></span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".txt,.pdf,.docx,.doc"
          />

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all"
            disabled={isProcessing}
          >
            {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <Paperclip size={20} />}
          </motion.button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ecris ton message..."
            className="flex-1 bg-white/10 border border-white/10 rounded-full px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
          />

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default ChatWidget
