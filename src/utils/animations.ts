/**
 * Enhanced animation utilities for Allie Digital
 * These functions provide advanced animation controls while maintaining React architecture
 */

interface AnimationState {
  enabled: boolean
  wavesVisible: boolean
  speed: number
  slowdown: number
  time: number
}

/**
 * Update CSS animation durations based on animation speed
 */
export function updateCSSAnimationSpeeds(animationState: AnimationState): void {
  if (typeof document === 'undefined') return

  const { enabled, wavesVisible, speed } = animationState
  const baseDuration = 4 // Base duration in seconds
  const effectiveDuration = enabled && wavesVisible ? 
    (baseDuration / speed) : 
    baseDuration * 20 // Very slow when disabled

  // Update CSS variables for animation durations
  document.documentElement.style.setProperty('--pulse-duration', effectiveDuration + 's')
  document.documentElement.style.setProperty('--animation-speed', speed.toString())
  
  // Update any CSS animations on animated elements
  const animatedElements = document.querySelectorAll('.animated, .condition-tag, .feature-card')
  animatedElements.forEach((element) => {
    const htmlElement = element as HTMLElement
    if (!enabled || !wavesVisible) {
      htmlElement.style.animationPlayState = 'paused'
      htmlElement.style.opacity = '1' // Ensure visibility when paused
    } else {
      htmlElement.style.animationPlayState = 'running'
      htmlElement.style.animationDuration = effectiveDuration + 's'
    }
  })

  // Update gradient animations
  const gradientElements = document.querySelectorAll('[class*="gradient"]')
  gradientElements.forEach((element) => {
    const htmlElement = element as HTMLElement
    if (htmlElement.style.backgroundImage && htmlElement.style.backgroundImage.includes('gradient')) {
      htmlElement.style.animationDuration = effectiveDuration * 2 + 's'
      htmlElement.style.animationPlayState = enabled && wavesVisible ? 'running' : 'paused'
    }
  })
}

/**
 * Update SVG animation durations
 */
export function updateSVGAnimationSpeeds(animationState: AnimationState): void {
  if (typeof document === 'undefined') return

  const { enabled, wavesVisible, speed } = animationState

  // Update all SVG animations
  const svgAnimations = document.querySelectorAll('animate, animateTransform')
  svgAnimations.forEach((anim) => {
    // Get the original duration if stored, or parse from current
    if (!(anim as any).dataset.originalDur) {
      ;(anim as any).dataset.originalDur = anim.getAttribute('dur') || '4s'
    }
    
    // Parse the original duration
    const originalDur = parseFloat((anim as any).dataset.originalDur)
    const newDur = enabled && wavesVisible ? 
      (originalDur / speed) : 
      (originalDur * 20)
    
    anim.setAttribute('dur', newDur + 's')
    
    // Restart animation with new duration
    if (typeof (anim as any).beginElement === 'function') {
      ;(anim as any).beginElement()
    }
  })
}

/**
 * Apply breathing effect to feature cards
 */
export function applyFeatureCardAnimations(animationState: AnimationState): void {
  if (typeof document === 'undefined') return

  const { enabled, wavesVisible, time, speed, slowdown } = animationState
  if (!enabled || !wavesVisible) return

  const speedMultiplier = speed * slowdown
  const featureCards = document.querySelectorAll('.feature-card')
  
  featureCards.forEach((card, index) => {
    const htmlCard = card as HTMLElement
    // Only animate if card is in viewport
    const rect = htmlCard.getBoundingClientRect()
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0
    
    if (isVisible) {
      const phase = (index * Math.PI) / featureCards.length
      const glow = 0.5 + Math.sin(time * 0.5 * speedMultiplier + phase) * 0.5
      
      // Update box shadow for breathing effect
      htmlCard.style.boxShadow = `0 4px 20px rgba(155, 136, 255, ${glow * 0.3})`
    }
  })
}

/**
 * Apply subtle movement to condition tags
 */
export function applyConditionTagAnimations(animationState: AnimationState): void {
  if (typeof document === 'undefined') return

  const { enabled, wavesVisible, time, speed, slowdown } = animationState
  if (!enabled || !wavesVisible) return

  const speedMultiplier = speed * slowdown
  const conditionTags = document.querySelectorAll('.condition-tag')
  
  conditionTags.forEach((tag, index) => {
    const htmlTag = tag as HTMLElement
    if (!(htmlTag as any).dataset.originalTransform) {
      ;(htmlTag as any).dataset.originalTransform = getComputedStyle(htmlTag).transform || 'none'
    }
    
    const phase = (index * Math.PI * 2) / conditionTags.length
    const moveY = Math.sin(time * 0.3 * speedMultiplier + phase) * 2
    const moveX = Math.cos(time * 0.4 * speedMultiplier + phase) * 1
    
    htmlTag.style.transform = `translateX(${moveX}px) translateY(${moveY}px)`
  })
}

/**
 * Apply gradient animation to buttons
 */
export function applyButtonGradientAnimations(animationState: AnimationState): void {
  if (typeof document === 'undefined') return

  const { enabled, wavesVisible, time, speed, slowdown } = animationState
  if (!enabled || !wavesVisible) return

  const speedMultiplier = speed * slowdown
  const buttons = document.querySelectorAll('.btn-primary, .modal-button')
  
  buttons.forEach((button) => {
    const htmlButton = button as HTMLElement
    const gradientPosition = (time * 20 * speedMultiplier) % 360
    htmlButton.style.backgroundImage = `linear-gradient(${gradientPosition}deg, #00D4FF, #9B88FF)`
  })
}

/**
 * Animate learning nodes in SVG
 */
export function animateLearningNodes(animationState: AnimationState): void {
  if (typeof document === 'undefined') return

  const { enabled, wavesVisible, time, speed, slowdown } = animationState
  if (!enabled || !wavesVisible) return

  const speedMultiplier = speed * slowdown
  const learningNodes = document.querySelectorAll('.learning-nodes circle')
  
  learningNodes.forEach((node, index) => {
    const htmlNode = node as HTMLElement
    const phase = (index * Math.PI * 2) / learningNodes.length
    const pulse = 1 + Math.sin(time * speedMultiplier + phase) * 0.2
    htmlNode.style.transform = `scale(${pulse})`
    htmlNode.style.transformOrigin = 'center'
  })
}

/**
 * Apply all enhanced animations (main function to call from React components)
 */
export function applyEnhancedAnimations(animationState: AnimationState): void {
  updateCSSAnimationSpeeds(animationState)
  updateSVGAnimationSpeeds(animationState)
  applyFeatureCardAnimations(animationState)
  applyConditionTagAnimations(animationState)
  applyButtonGradientAnimations(animationState)
  animateLearningNodes(animationState)
}

/**
 * Get effective animation duration based on state
 */
export function getEffectiveAnimationDuration(animationState: AnimationState, baseDuration: number = 4): number {
  const { enabled, wavesVisible, speed } = animationState
  return enabled && wavesVisible ? (baseDuration / speed) : baseDuration * 20
}