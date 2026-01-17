import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Copy, Download, CheckCircle, Sparkles, BookOpen } from 'lucide-react'

interface NotesPanelProps {
  notes: string
  setNotes: (notes: string) => void
  summaryResult: any
}

function NotesPanel({ notes, setNotes, summaryResult }: NotesPanelProps) {
  const [copied, setCopied] = useState(false)
  const [activeView, setActiveView] = useState<'input' | 'summary'>('input')

  const handleCopy = () => {
    const textToCopy = activeView === 'input' ? notes : summaryResult?.summary
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    const text = activeView === 'input' ? notes : summaryResult?.summary
    if (!text) return

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = activeView === 'input' ? 'mes-notes.txt' : 'resume.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-full p-4">
      {/* Toggle Buttons */}
      <div className="flex gap-2 mb-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveView('input')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-all ${
            activeView === 'input'
              ? 'bg-white text-purple-600'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <FileText size={18} />
          Notes Originales
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveView('summary')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-all ${
            activeView === 'summary'
              ? 'bg-white text-purple-600'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <Sparkles size={18} />
          Resume
        </motion.button>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {activeView === 'input' ? (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Colle tes notes ici ou upload un fichier dans le chat...

Exemple:
- Notes de cours de biologie
- Chapitres de manuel
- Slides de presentation
- Documents PDF/Word"
                className="w-full h-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-white/30 resize-none focus:outline-none focus:border-white/30 transition-colors"
              />

              {notes && (
                <div className="absolute bottom-4 right-4 text-white/40 text-sm">
                  {notes.split(/\s+/).filter(Boolean).length} mots
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="summary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              {summaryResult?.summary ? (
                <div className="h-full bg-white/5 border border-white/10 rounded-2xl p-4 overflow-y-auto">
                  <div className="prose prose-invert max-w-none">
                    <div className="text-white whitespace-pre-line">
                      {summaryResult.summary}
                    </div>
                  </div>

                  {/* Stats */}
                  {summaryResult.reduction_percent && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-4 text-sm text-white/60">
                        <span className="flex items-center gap-1">
                          <CheckCircle size={14} className="text-green-400" />
                          Reduction: {summaryResult.reduction_percent}%
                        </span>
                        <span>
                          {summaryResult.word_count_original} → {summaryResult.word_count_summary} mots
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-white/40">
                  <BookOpen size={48} className="mb-4 opacity-50" />
                  <p className="text-center">
                    Pas encore de resume.<br />
                    Colle tes notes et demande un resume dans le chat!
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCopy}
          disabled={activeView === 'input' ? !notes : !summaryResult?.summary}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          {copied ? <CheckCircle size={18} className="text-green-400" /> : <Copy size={18} />}
          {copied ? 'Copie!' : 'Copier'}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDownload}
          disabled={activeView === 'input' ? !notes : !summaryResult?.summary}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <Download size={18} />
          Telecharger
        </motion.button>
      </div>
    </div>
  )
}

export default NotesPanel
