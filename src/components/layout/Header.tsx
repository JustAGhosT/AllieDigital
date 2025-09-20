'use client'

import React from 'react'
import { Settings, Volume2, Moon, Sun, Contrast } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { NAVIGATION_ITEMS } from '@/lib/constants'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/utils'

interface HeaderProps {
  onAccessibilityOpen: () => void
  onSpeechToggle: () => void
  speechEnabled: boolean
}

export function Header({ onAccessibilityOpen, onSpeechToggle, speechEnabled }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <Sun className="h-4 w-4" />
      case 'high-contrast':
        return <Contrast className="h-4 w-4" />
      default:
        return <Moon className="h-4 w-4" />
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-slate-900/95 dark:supports-[backdrop-filter]:bg-slate-900/60">
      <div className="container mx-auto px-4">
        <nav 
          className="flex h-16 items-center justify-between"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              ✦ Allie Digital ✦
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {NAVIGATION_ITEMS.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                asChild
              >
                <a 
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium transition-colors hover:text-primary-600 focus:text-primary-600"
                >
                  {item.name}
                </a>
              </Button>
            ))}
          </div>

          {/* Accessibility Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onAccessibilityOpen}
              aria-label="Open accessibility settings"
              title="Accessibility Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onSpeechToggle}
              aria-label={speechEnabled ? 'Disable speech support' : 'Enable speech support'}
              title="Toggle Speech Support"
              className={cn(speechEnabled && 'bg-primary-100 text-primary-700')}
            >
              <Volume2 className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title="Toggle Theme"
            >
              {getThemeIcon()}
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex flex-wrap gap-2">
            {NAVIGATION_ITEMS.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                asChild
                className="text-xs"
              >
                <a href={item.href}>{item.name}</a>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}