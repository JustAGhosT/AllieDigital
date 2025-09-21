'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Waves } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useEnhancedAnimations } from '@/hooks/useEnhancedAnimations'
import { cn } from '@/utils'

interface AnimationControlsProps {
  className?: string
}

export function AnimationControls({ className }: AnimationControlsProps) {
  const {
    enabled,
    wavesVisible,
    speed,
    slowdown,
    toggleAnimation,
    toggleWaves,
    setAnimationSpeed,
    setSlowdown,
    resetAnimation,
  } = useEnhancedAnimations()

  return (
    <motion.div
      className={cn(
        'bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-lg',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        Animation Controls
      </h3>
      
      <div className="space-y-4">
        {/* Toggle Controls */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={enabled ? 'default' : 'outline'}
            size="sm"
            onClick={toggleAnimation}
            className="flex items-center gap-2"
          >
            {enabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {enabled ? 'Pause' : 'Play'}
          </Button>
          
          <Button
            variant={wavesVisible ? 'default' : 'outline'}
            size="sm"
            onClick={toggleWaves}
            className="flex items-center gap-2"
          >
            <Waves className="w-4 h-4" />
            Waves
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={resetAnimation}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>

        {/* Speed Controls */}
        <div className="space-y-3">
          <div className="space-y-2">
            <label 
              htmlFor="animation-speed" 
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Animation Speed: {speed.toFixed(1)}x
            </label>
            <input
              id="animation-speed"
              type="range"
              min="0.1"
              max="5.0"
              step="0.1"
              value={speed}
              onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              disabled={!enabled}
            />
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>0.1x</span>
              <span>5.0x</span>
            </div>
          </div>

          <div className="space-y-2">
            <label 
              htmlFor="animation-slowdown" 
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Fine Control: {slowdown.toFixed(1)}x
            </label>
            <input
              id="animation-slowdown"
              type="range"
              min="0.1"
              max="2.0"
              step="0.1"
              value={slowdown}
              onChange={(e) => setSlowdown(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              disabled={!enabled}
            />
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>0.1x</span>
              <span>2.0x</span>
            </div>
          </div>
        </div>

        {/* Speed Presets */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Quick Presets
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Slow', speed: 0.5 },
              { label: 'Normal', speed: 1.0 },
              { label: 'Fast', speed: 2.0 },
              { label: 'Turbo', speed: 3.0 },
            ].map((preset) => (
              <Button
                key={preset.label}
                variant={speed === preset.speed ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAnimationSpeed(preset.speed)}
                disabled={!enabled}
                className="text-xs"
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Status Indicator */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <div 
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                enabled && wavesVisible 
                  ? 'bg-green-500 animate-pulse' 
                  : 'bg-slate-400'
              )}
            />
            <span>
              {enabled && wavesVisible 
                ? `Animations active at ${(speed * slowdown).toFixed(1)}x speed`
                : 'Animations paused'
              }
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}