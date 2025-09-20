import { useState, useEffect } from 'react'
import { AccessibilitySettings } from '@/types'
import { DEFAULT_ACCESSIBILITY_SETTINGS, STORAGE_KEYS } from '@/lib/constants'
import { SafeStorage, announceToScreenReader } from '@/utils'

export function useAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_ACCESSIBILITY_SETTINGS)

  useEffect(() => {
    const savedSettings = SafeStorage.get(STORAGE_KEYS.ACCESSIBILITY_SETTINGS, DEFAULT_ACCESSIBILITY_SETTINGS)
    setSettings(savedSettings)
  }, [])

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    SafeStorage.set(STORAGE_KEYS.ACCESSIBILITY_SETTINGS, newSettings)
    
    // Announce changes to screen readers
    announceToScreenReader(`${key} ${value ? 'enabled' : 'disabled'}`)
  }

  const resetSettings = () => {
    setSettings(DEFAULT_ACCESSIBILITY_SETTINGS)
    SafeStorage.set(STORAGE_KEYS.ACCESSIBILITY_SETTINGS, DEFAULT_ACCESSIBILITY_SETTINGS)
    announceToScreenReader('Accessibility settings reset to defaults')
  }

  return {
    settings,
    updateSetting,
    resetSettings,
  }
}