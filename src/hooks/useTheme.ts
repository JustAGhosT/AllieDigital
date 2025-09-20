import { useState, useEffect } from 'react'
import { Theme } from '@/types'
import { THEMES, STORAGE_KEYS } from '@/lib/constants'
import { SafeStorage } from '@/utils'

export function useTheme() {
  const [theme, setTheme] = useState<Theme['name']>('light')

  useEffect(() => {
    const savedTheme = SafeStorage.get(STORAGE_KEYS.THEME_PREFERENCE, 'light')
    setTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (themeName: Theme['name']) => {
    const root = document.documentElement
    
    // Remove all theme classes
    root.classList.remove('light', 'dark', 'high-contrast')
    
    // Add new theme class
    root.classList.add(themeName)
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      const colors = {
        light: '#ffffff',
        dark: '#0f172a',
        'high-contrast': '#000000',
      }
      metaThemeColor.setAttribute('content', colors[themeName])
    }
  }

  const changeTheme = (newTheme: Theme['name']) => {
    setTheme(newTheme)
    applyTheme(newTheme)
    SafeStorage.set(STORAGE_KEYS.THEME_PREFERENCE, newTheme)
  }

  const toggleTheme = () => {
    const currentIndex = THEMES.findIndex(t => t.name === theme)
    const nextIndex = (currentIndex + 1) % THEMES.length
    changeTheme(THEMES[nextIndex].name)
  }

  const getCurrentTheme = () => THEMES.find(t => t.name === theme)!

  return {
    theme,
    changeTheme,
    toggleTheme,
    getCurrentTheme,
    availableThemes: THEMES,
  }
}