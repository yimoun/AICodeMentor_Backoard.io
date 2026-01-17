import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ChatWidget from './components/ChatWidget'
import NotesPanel from './components/NotesPanel'
import ToolsPanel from './components/ToolsPanel'
import Header from './components/Header'
import { BookOpen, MessageSquare, Sparkles, GraduationCap } from 'lucide-react'

interface SummaryResult {
  summary: string
  flashcards?: Array<{ id: number; front: string; back: string }>
  quiz?: Array<{ id: number; question: string; answer: string }>
}

function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'notes' | 'tools'>('chat')
  const [notes, setNotes] = useState<string>('')
  const [summaryResult, setSummaryResult] = useState<SummaryResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Header />

        {/* Main Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Tab Navigation */}
          <div className="flex border-b border-white/10">
            <TabButton
              active={activeTab === 'chat'}
              onClick={() => setActiveTab('chat')}
              icon={<MessageSquare size={18} />}
              label="Chat AI"
            />
            <TabButton
              active={activeTab === 'notes'}
              onClick={() => setActiveTab('notes')}
              icon={<BookOpen size={18} />}
              label="Mes Notes"
            />
            <TabButton
              active={activeTab === 'tools'}
              onClick={() => setActiveTab('tools')}
              icon={<Sparkles size={18} />}
              label="Outils"
            />
          </div>

          {/* Tab Content */}
          <div className="h-[600px]">
            <AnimatePresence mode="wait">
              {activeTab === 'chat' && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="h-full"
                >
                  <ChatWidget
                    notes={notes}
                    onSummaryGenerated={setSummaryResult}
                    isProcessing={isProcessing}
                    setIsProcessing={setIsProcessing}
                  />
                </motion.div>
              )}
              {activeTab === 'notes' && (
                <motion.div
                  key="notes"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="h-full"
                >
                  <NotesPanel
                    notes={notes}
                    setNotes={setNotes}
                    summaryResult={summaryResult}
                  />
                </motion.div>
              )}
              {activeTab === 'tools' && (
                <motion.div
                  key="tools"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="h-full"
                >
                  <ToolsPanel
                    notes={notes}
                    summaryResult={summaryResult}
                    setSummaryResult={setSummaryResult}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Features Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <FeatureCard
            icon={<BookOpen className="text-blue-300" />}
            title="Resume Intelligent"
            description="Transforme tes notes en points cles faciles a retenir"
          />
          <FeatureCard
            icon={<GraduationCap className="text-purple-300" />}
            title="Integration LMS"
            description="Connecte Brightspace et Omnivox directement"
          />
          <FeatureCard
            icon={<Sparkles className="text-pink-300" />}
            title="Quiz & Flashcards"
            description="Genere des outils d'etude automatiquement"
          />
        </div>
      </div>
    </div>
  )
}

interface TabButtonProps {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}

function TabButton({ active, onClick, icon, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-300 ${
        active
          ? 'text-white bg-white/10 border-b-2 border-white'
          : 'text-white/60 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="glass rounded-2xl p-5 cursor-pointer"
    >
      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      <p className="text-white/60 text-sm">{description}</p>
    </motion.div>
  )
}

export default App
