'use client'

import React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { useAccessibility } from '@/hooks/useAccessibility'
import { cn } from '@/utils'

interface AccessibilityPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function AccessibilityPanel({ isOpen, onClose }: AccessibilityPanelProps) {
  const { settings, updateSetting, resetSettings } = useAccessibility()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Accessibility Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Font Size */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="font-size" className="text-sm font-medium">
                Font Size
              </label>
              <span className="text-sm text-slate-500">
                {settings.fontSize}px
              </span>
            </div>
            <SliderPrimitive.Root
              id="font-size"
              className="relative flex items-center select-none touch-none w-full h-5"
              value={[settings.fontSize]}
              onValueChange={([value]) => updateSetting('fontSize', value)}
              min={12}
              max={24}
              step={1}
              aria-label="Font size"
            >
              <SliderPrimitive.Track className="bg-slate-200 dark:bg-slate-700 relative grow rounded-full h-2">
                <SliderPrimitive.Range className="absolute bg-primary-500 rounded-full h-full" />
              </SliderPrimitive.Track>
              <SliderPrimitive.Thumb
                className="block w-5 h-5 bg-white border-2 border-primary-500 rounded-full hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label="Font size slider"
              />
            </SliderPrimitive.Root>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <label htmlFor="high-contrast" className="text-sm font-medium">
              High Contrast
            </label>
            <SwitchPrimitive.Root
              id="high-contrast"
              className={cn(
                'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                settings.highContrast ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'
              )}
              checked={settings.highContrast}
              onCheckedChange={(checked) => updateSetting('highContrast', checked)}
            >
              <SwitchPrimitive.Thumb
                className={cn(
                  'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
                  settings.highContrast ? 'translate-x-5' : 'translate-x-0'
                )}
              />
            </SwitchPrimitive.Root>
          </div>

          {/* Reduce Motion */}
          <div className="flex items-center justify-between">
            <label htmlFor="reduce-motion" className="text-sm font-medium">
              Reduce Motion
            </label>
            <SwitchPrimitive.Root
              id="reduce-motion"
              className={cn(
                'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                settings.reduceMotion ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'
              )}
              checked={settings.reduceMotion}
              onCheckedChange={(checked) => updateSetting('reduceMotion', checked)}
            >
              <SwitchPrimitive.Thumb
                className={cn(
                  'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
                  settings.reduceMotion ? 'translate-x-5' : 'translate-x-0'
                )}
              />
            </SwitchPrimitive.Root>
          </div>

          {/* Reading Guide */}
          <div className="flex items-center justify-between">
            <label htmlFor="reading-guide" className="text-sm font-medium">
              Reading Guide
            </label>
            <SwitchPrimitive.Root
              id="reading-guide"
              className={cn(
                'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                settings.readingGuide ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'
              )}
              checked={settings.readingGuide}
              onCheckedChange={(checked) => updateSetting('readingGuide', checked)}
            >
              <SwitchPrimitive.Thumb
                className={cn(
                  'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
                  settings.readingGuide ? 'translate-x-5' : 'translate-x-0'
                )}
              />
            </SwitchPrimitive.Root>
          </div>

          {/* Dyslexic Font */}
          <div className="flex items-center justify-between">
            <label htmlFor="dyslexic-font" className="text-sm font-medium">
              Dyslexia-Friendly Font
            </label>
            <SwitchPrimitive.Root
              id="dyslexic-font"
              className={cn(
                'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                settings.dyslexicFont ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'
              )}
              checked={settings.dyslexicFont}
              onCheckedChange={(checked) => updateSetting('dyslexicFont', checked)}
            >
              <SwitchPrimitive.Thumb
                className={cn(
                  'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
                  settings.dyslexicFont ? 'translate-x-5' : 'translate-x-0'
                )}
              />
            </SwitchPrimitive.Root>
          </div>

          {/* Speech Support */}
          <div className="flex items-center justify-between">
            <label htmlFor="speech-enabled" className="text-sm font-medium">
              Speech Support
            </label>
            <SwitchPrimitive.Root
              id="speech-enabled"
              className={cn(
                'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                settings.speechEnabled ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'
              )}
              checked={settings.speechEnabled}
              onCheckedChange={(checked) => updateSetting('speechEnabled', checked)}
            >
              <SwitchPrimitive.Thumb
                className={cn(
                  'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
                  settings.speechEnabled ? 'translate-x-5' : 'translate-x-0'
                )}
              />
            </SwitchPrimitive.Root>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={resetSettings}>
            Reset
          </Button>
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}