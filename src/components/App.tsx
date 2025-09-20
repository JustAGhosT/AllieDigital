'use client'

import React, { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/features/HeroSection'
import { Quiz } from '@/components/features/Quiz'
import { AccessibilityPanel } from '@/components/features/AccessibilityPanel'
import { useAccessibility } from '@/hooks/useAccessibility'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/utils'

export default function App() {
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false)
  const [isQuizOpen, setIsQuizOpen] = useState(false)
  const [speechEnabled, setSpeechEnabled] = useState(false)
  const { settings } = useAccessibility()
  const { theme } = useTheme()

  // Apply accessibility settings to document
  useEffect(() => {
    const root = document.documentElement
    
    // Font size
    root.style.fontSize = `${settings.fontSize}px`
    
    // Dyslexic font
    if (settings.dyslexicFont) {
      document.body.classList.add('font-dyslexic')
    } else {
      document.body.classList.remove('font-dyslexic')
    }
    
    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }
    
    // Reading guide
    if (settings.readingGuide) {
      document.body.classList.add('reading-guide-active')
    } else {
      document.body.classList.remove('reading-guide-active')
    }
  }, [settings])

  // Speech synthesis support
  const handleSpeechToggle = () => {
    setSpeechEnabled(!speechEnabled)
    
    if (!speechEnabled && 'speechSynthesis' in window) {
      // Announce speech support activation
      const utterance = new SpeechSynthesisUtterance('Speech support activated')
      speechSynthesis.speak(utterance)
    }
  }

  // Click-to-speak functionality
  useEffect(() => {
    if (!speechEnabled || !('speechSynthesis' in window)) return

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const text = target.textContent || target.innerText
      
      if (text && text.trim().length > 0) {
        // Cancel any ongoing speech
        speechSynthesis.cancel()
        
        // Speak the clicked text
        const utterance = new SpeechSynthesisUtterance(text.trim())
        utterance.rate = 0.9
        utterance.pitch = 1
        speechSynthesis.speak(utterance)
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [speechEnabled])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Space for speech toggle
      if ((event.ctrlKey || event.metaKey) && event.code === 'Space') {
        event.preventDefault()
        handleSpeechToggle()
      }
      
      // Escape to close modals
      if (event.key === 'Escape') {
        setIsAccessibilityOpen(false)
        setIsQuizOpen(false)
      }
      
      // Alt + A for accessibility panel
      if (event.altKey && event.key === 'a') {
        event.preventDefault()
        setIsAccessibilityOpen(!isAccessibilityOpen)
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [isAccessibilityOpen, speechEnabled])

  return (
    <div 
      className={cn(
        'min-h-screen bg-background text-foreground',
        settings.reduceMotion && 'motion-reduce'
      )}
    >
      {/* Skip to main content link */}
      <a 
        href="#main-content" 
        className="skip-link"
      >
        Skip to main content
      </a>

      {/* Header */}
      <Header
        onAccessibilityOpen={() => setIsAccessibilityOpen(true)}
        onSpeechToggle={handleSpeechToggle}
        speechEnabled={speechEnabled}
      />

      {/* Main Content */}
      <main id="main-content" className="flex-1">
        <HeroSection onQuizStart={() => setIsQuizOpen(true)} />
        
        {/* Additional sections would go here */}
        <section id="features" className="py-24 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Key Features
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Our platform combines cutting-edge AI with proven accessibility principles 
                to create personalised learning experiences for every neurodivergent mind.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
              {[
                {
                  title: 'Personalised Learning',
                  description: 'AI powered tools that adapt to your unique learning style, communication needs, and pace',
                  icon: '🧠',
                },
                {
                  title: 'Inclusive Community',
                  description: 'Connect with peers and mentors in a supportive learning environment',
                  icon: '🤝',
                },
                {
                  title: 'Smart Organisation',
                  description: 'Streamlined task management designed for neurodivergent minds',
                  icon: '📋',
                },
                {
                  title: 'Speech & Motor Planning Support',
                  description: 'Specialised tools for apraxia and motor planning challenges',
                  icon: '🗣️',
                },
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="card card-hover p-6 text-center"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="challenge" className="py-24 bg-slate-50 dark:bg-slate-800">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
                The Challenge
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 text-center">
                Traditional educational platforms follow a one-size-fits-all approach that often 
                fails neurodivergent learners and those with communication challenges.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  'Complex interfaces create barriers',
                  'Overwhelming information density',
                  'Inflexible pacing systems',
                  'Limited support for speech and motor planning',
                  '15-20% of learners underserved',
                ].map((challenge, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="text-red-500 mt-1">⚠️</span>
                    <span className="text-slate-700 dark:text-slate-300">{challenge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="solution" className="py-24 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
                Our Solution
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 text-center">
                Allie.ai combines AI powered personalisation with accessible design, 
                speech support tools, and community engagement.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  'Adaptive learning algorithms',
                  'Built-in accessibility toolkit',
                  'Speech pattern recognition and support',
                  'Motor planning assistance tools',
                  'Neurodivergent-friendly interface design',
                  'Personalised learning pathways',
                  'Community-driven support network',
                ].map((solution, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="text-green-500 mt-1">✅</span>
                    <span className="text-slate-700 dark:text-slate-300">{solution}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <AccessibilityPanel
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
      />
      
      <Quiz
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
      />

      {/* Screen reader announcements */}
      <div
        id="sr-announcements"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />
    </div>
  )
}