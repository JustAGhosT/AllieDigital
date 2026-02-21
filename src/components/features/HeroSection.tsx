'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { NEURODIVERGENT_CONDITIONS } from '@/lib/constants'
import { useEnhancedAnimations } from '@/hooks/useEnhancedAnimations'
import { cn } from '@/utils'

interface HeroSectionProps {
  onQuizStart: () => void
}

export function HeroSection({ onQuizStart }: HeroSectionProps) {
  const { enabled: animationsEnabled, logoFloat, logoRotation, logoScale, statusPulse, wavesVisible } = useEnhancedAnimations()

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden"
    >
      {/* Animated Wave Background Elements */}
      {animationsEnabled && wavesVisible && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
              x: [0, 10, -5, 0],
              y: [0, -15, 10, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div 
            className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl"
            animate={{
              scale: [1, 0.8, 1.1, 1],
              opacity: [0.4, 0.7, 0.2, 0.4],
              x: [0, -20, 15, 0],
              y: [0, 10, -25, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 w-80 h-80 bg-accent-200/30 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 0.9, 1],
              opacity: [0.2, 0.5, 0.8, 0.2],
              x: [0, 25, -10, 0],
              y: [0, -20, 30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4,
            }}
          />
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <div className="space-y-8">
            {/* Status Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
              <Sparkles 
                className="w-4 h-4 mr-2" 
                style={{
                  opacity: animationsEnabled ? statusPulse : 1,
                  transform: animationsEnabled ? `scale(${1 + (1 - statusPulse) * 0.5})` : 'scale(1)'
                }}
              />
              Status: Pre-Launch
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <div className="text-6xl font-bold bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
                ✦ Your Digital Ally ✦
              </div>
              
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white">
                  Allie Digital
                </h1>
                <h2 className="text-2xl lg:text-3xl font-semibold text-primary-600 dark:text-primary-400">
                  Revolutionising Learning Support
                </h2>
              </motion.div>
            </div>

            {/* Description */}
            <motion.p 
              className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              A personalised digital learning platform designed specifically, but not 'exclusively' 
              for learners with ADHD, apraxia, autism spectrum conditions, and comorbid learning difficulties.
            </motion.p>

            {/* Coming Soon Badge */}
            <motion.div
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-accent-500 to-purple-500 text-white rounded-full text-lg font-medium shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              ✦ Coming Soon ✦
            </motion.div>

            {/* Condition Tags */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex flex-wrap gap-3">
                {NEURODIVERGENT_CONDITIONS.map((condition, index) => (
                  <motion.div
                    key={condition.id}
                    className="condition-tag inline-flex items-center px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + (index * 0.1) }}
                    whileHover={{ scale: 1.05 }}
                    title={condition.description}
                  >
                    <span className="mr-2">{condition.icon}</span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {condition.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <Button 
                size="lg" 
                onClick={onQuizStart}
                className="px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-shadow"
              >
                Learn More
              </Button>
            </motion.div>
          </div>

          {/* Visual Side - Animated Brain Logo */}
          <div className="flex items-center justify-center">
            <motion.div
              className="relative"
              style={{
                transform: animationsEnabled 
                  ? `translateY(${logoFloat}px) rotate(${logoRotation}deg) scale(${logoScale})`
                  : undefined
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="w-80 h-80 lg:w-96 lg:h-96 relative">
                {/* SVG Brain Logo */}
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full drop-shadow-2xl"
                  aria-label="Colourful brain logo representing neurodiversity and inclusive learning"
                >
                  <defs>
                    <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00FFB8" />
                      <stop offset="33%" stopColor="#00D4FF" />
                      <stop offset="66%" stopColor="#9B88FF" />
                      <stop offset="100%" stopColor="#E88FFF" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Brain Shape */}
                  <path
                    d="M20 35C20 25 25 20 35 20C40 15 50 15 55 20C65 20 70 25 70 35C75 40 75 50 70 55C70 65 65 70 55 70C50 75 40 75 35 70C25 70 20 65 20 55C15 50 15 40 20 35Z"
                    fill="url(#brainGradient)"
                    filter="url(#glow)"
                    className={cn(
                      'transition-all duration-1000',
                      animationsEnabled && 'animate-pulse-soft'
                    )}
                  />
                  
                  {/* Neural Connections */}
                  <g className="opacity-60">
                    <line x1="30" y1="30" x2="60" y2="40" stroke="white" strokeWidth="2" />
                    <line x1="40" y1="50" x2="55" y2="30" stroke="white" strokeWidth="2" />
                    <line x1="25" y1="45" x2="45" y2="60" stroke="white" strokeWidth="2" />
                    <line x1="50" y1="55" x2="65" y2="45" stroke="white" strokeWidth="2" />
                  </g>
                  
                  {/* Neural Nodes */}
                  <g className="learning-nodes">
                    <circle cx="30" cy="30" r="3" fill="white" opacity="0.9" />
                    <circle cx="60" cy="40" r="3" fill="white" opacity="0.9" />
                    <circle cx="40" cy="50" r="3" fill="white" opacity="0.9" />
                    <circle cx="55" cy="30" r="3" fill="white" opacity="0.9" />
                    <circle cx="25" cy="45" r="3" fill="white" opacity="0.9" />
                    <circle cx="45" cy="60" r="3" fill="white" opacity="0.9" />
                    <circle cx="50" cy="55" r="3" fill="white" opacity="0.9" />
                    <circle cx="65" cy="45" r="3" fill="white" opacity="0.9" />
                  </g>
                </svg>

                {/* Floating Particles */}
                {animationsEnabled && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-primary-400 rounded-full opacity-60"
                        animate={{
                          x: [0, 20, -10, 0],
                          y: [0, -15, 10, 0],
                          opacity: [0.6, 1, 0.4, 0.6],
                        }}
                        transition={{
                          duration: 3 + i,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        style={{
                          left: `${20 + i * 12}%`,
                          top: `${30 + i * 8}%`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}