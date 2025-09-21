import { useState, useEffect, useCallback } from 'react'
import { prefersReducedMotion } from '@/utils'

interface AnimationConfig {
  enabled: boolean
  reducedMotion: boolean
  speed: number
  slowdown: number
  wavesVisible: boolean
  logoFloat: number
  logoRotation: number
  logoScale: number
  gradientPosition: number
  statusPulse: number
  time: number
}

export function useAnimation() {
  const [config, setConfig] = useState<AnimationConfig>({
    enabled: true,
    reducedMotion: false,
    speed: 1.0,
    slowdown: 1.0,
    wavesVisible: true,
    logoFloat: 0,
    logoRotation: 0,
    logoScale: 1,
    gradientPosition: 0,
    statusPulse: 1,
    time: 0,
  })

  useEffect(() => {
    const checkMotionPreference = () => {
      const reducedMotion = prefersReducedMotion()
      setConfig(prev => ({
        ...prev,
        reducedMotion,
        enabled: !reducedMotion,
      }))
    }

    checkMotionPreference()

    // Listen for changes in motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    mediaQuery.addEventListener('change', checkMotionPreference)

    return () => mediaQuery.removeEventListener('change', checkMotionPreference)
  }, [])

  useEffect(() => {
    if (!config.enabled) return

    let animationId: number

    const animate = () => {
      const time = Date.now() / 1000
      const speedMultiplier = config.speed * config.slowdown

      setConfig(prev => ({
        ...prev,
        time,
        logoFloat: Math.sin(time * 0.5 * speedMultiplier) * 10,
        logoRotation: Math.sin(time * 0.2 * speedMultiplier) * 3,
        logoScale: 1 + Math.sin(time * 0.4 * speedMultiplier) * 0.05,
        gradientPosition: (time * 20 * speedMultiplier) % 360,
        statusPulse: 0.3 + Math.abs(Math.sin(time * 2 * speedMultiplier)) * 0.7,
      }))

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationId)
  }, [config.enabled, config.speed, config.slowdown])

  const toggleAnimation = useCallback(() => {
    setConfig(prev => ({
      ...prev,
      enabled: !prev.enabled,
    }))
  }, [])

  const toggleWaves = useCallback(() => {
    setConfig(prev => ({
      ...prev,
      wavesVisible: !prev.wavesVisible,
    }))
  }, [])

  const setAnimationSpeed = useCallback((speed: number) => {
    setConfig(prev => ({
      ...prev,
      speed: Math.max(0.1, Math.min(5.0, speed)), // Clamp between 0.1 and 5.0
    }))
  }, [])

  const setSlowdown = useCallback((slowdown: number) => {
    setConfig(prev => ({
      ...prev,
      slowdown: Math.max(0.1, Math.min(2.0, slowdown)), // Clamp between 0.1 and 2.0
    }))
  }, [])

  const resetAnimation = useCallback(() => {
    setConfig(prev => ({
      ...prev,
      logoFloat: 0,
      logoRotation: 0,
      logoScale: 1,
      gradientPosition: 0,
      statusPulse: 1,
    }))
  }, [])

  return {
    ...config,
    toggleAnimation,
    toggleWaves,
    setAnimationSpeed,
    setSlowdown,
    resetAnimation,
  }
}