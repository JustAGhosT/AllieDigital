'use client'

import { useEffect } from 'react'
import { useAnimation } from './useAnimation'
import { applyEnhancedAnimations } from '@/utils/animations'
import { throttle } from '@/utils'

/**
 * Hook that applies enhanced animations to DOM elements
 * This bridges the React animation system with DOM manipulation
 */
export function useEnhancedAnimations() {
  const animationState = useAnimation()

  // Throttled animation function to avoid excessive DOM updates
  const throttledApplyAnimations = throttle(() => {
    applyEnhancedAnimations({
      enabled: animationState.enabled && !animationState.reducedMotion,
      wavesVisible: animationState.wavesVisible,
      speed: animationState.speed,
      slowdown: animationState.slowdown,
      time: animationState.time,
    })
  }, 16) // ~60fps

  // Apply animations when animation state changes
  useEffect(() => {
    if (animationState.enabled && !animationState.reducedMotion) {
      throttledApplyAnimations()
    }
  }, [
    animationState.enabled,
    animationState.reducedMotion,
    animationState.wavesVisible,
    animationState.speed,
    animationState.slowdown,
    animationState.time,
    throttledApplyAnimations
  ])

  // Initial setup on mount
  useEffect(() => {
    // Set initial CSS variables
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--pulse-duration', '4s')
      document.documentElement.style.setProperty('--animation-speed', '1')
    }
  }, [])

  return animationState
}