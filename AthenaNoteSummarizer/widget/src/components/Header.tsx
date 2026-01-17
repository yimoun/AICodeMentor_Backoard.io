import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, GraduationCap } from 'lucide-react'

function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-8"
    >
      <div className="flex items-center justify-center gap-3 mb-3">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center"
        >
          <GraduationCap size={32} className="text-white" />
        </motion.div>
        <div className="text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-2">
            NoteSummarizer
            <Sparkles size={24} className="text-yellow-300" />
          </h1>
          <p className="text-white/70 text-sm">Powered by Athena AI</p>
        </div>
      </div>
      <p className="text-white/80 text-lg max-w-xl mx-auto">
        Ton assistant IA pour resumer tes notes, creer des flashcards,
        et te connecter a Brightspace & Omnivox
      </p>
    </motion.div>
  )
}

export default Header
