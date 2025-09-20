import { useState, useEffect, useCallback } from 'react'
import { prefersReducedMotion } from '@/utils'

interface AnimationConfig {
  enabled: boolean
  reducedMotion: boolean
  logoFloat: number
  logoRotation: number
  gradientPosition: number
}

export function useAnimation() {
  const [config, setConfig] = useState<AnimationConfig>({
    enabled: true,
    reducedMotion: false,
    logoFloat: 0,
    logoRotation: 0,
    gradientPosition: 0,
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

      setConfig(prev => ({
        ...prev,
        logoFloat: Math.sin(time * 0.5) * 3,
        logoRotation: Math.sin(time * 0.3) * 2,
        gradientPosition: (time * 10) % 360,
      }))

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationId)
  }, [config.enabled])

  const toggleAnimation = useCallback(() => {
    setConfig(prev => ({
      ...prev,
      enabled: !prev.enabled,
    }))
  }, [])

  const resetAnimation = useCallback(() => {
    setConfig(prev => ({
      ...prev,
      logoFloat: 0,
      logoRotation: 0,
      gradientPosition: 0,
    }))
  }, [])

  return {
    ...config,
    toggleAnimation,
    resetAnimation,
  }
}