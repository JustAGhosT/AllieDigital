'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useAnimation } from './useAnimation'

export interface CanvasAnimationOptions {
  width?: number
  height?: number
  devicePixelRatio?: number
  preserveDrawingBuffer?: boolean
}

export function useCanvasAnimation(
  animate: (ctx: CanvasRenderingContext2D, time: number, deltaTime: number) => void,
  options: CanvasAnimationOptions = {}
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const lastTimeRef = useRef<number>(0)
  const { enabled: isAnimationEnabled } = useAnimation()

  const {
    width = 800,
    height = 600,
    devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
    preserveDrawingBuffer = false
  } = options

  // Animation loop
  const animationLoop = useCallback((currentTime: number) => {
    if (!canvasRef.current || !isAnimationEnabled) return

    const ctx = canvasRef.current.getContext('2d', { 
      preserveDrawingBuffer,
      alpha: true 
    }) as CanvasRenderingContext2D | null
    if (!ctx) return

    const deltaTime = currentTime - lastTimeRef.current
    lastTimeRef.current = currentTime

    // Call the animation function
    animate(ctx, currentTime, deltaTime)

    // Continue the loop
    animationRef.current = requestAnimationFrame(animationLoop)
  }, [animate, isAnimationEnabled, preserveDrawingBuffer])

  // Start animation
  const start = useCallback(() => {
    if (animationRef.current) return // Already running
    
    lastTimeRef.current = performance.now()
    animationRef.current = requestAnimationFrame(animationLoop)
  }, [animationLoop])

  // Stop animation
  const stop = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = undefined
    }
  }, [])

  // Restart animation
  const restart = useCallback(() => {
    stop()
    start()
  }, [start, stop])

  // Setup canvas dimensions and pixel ratio
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set the actual size in memory (scaled to account for pixel ratio)
    canvas.width = width * devicePixelRatio
    canvas.height = height * devicePixelRatio

    // Set the display size (CSS pixels)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    // Scale the context to ensure correct drawing operations
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(devicePixelRatio, devicePixelRatio)
    }
  }, [width, height, devicePixelRatio])

  // Start/stop animation based on enabled state
  useEffect(() => {
    if (isAnimationEnabled) {
      start()
    } else {
      stop()
    }

    return stop
  }, [isAnimationEnabled, start, stop])

  // Cleanup on unmount
  useEffect(() => {
    return stop
  }, [stop])

  return {
    canvasRef,
    start,
    stop,
    restart,
    isRunning: !!animationRef.current,
    isAnimationEnabled
  }
}

// Specialized hook for neural network animations
export function useNeuralNetworkCanvas(
  nodes: Array<{ x: number; y: number; radius: number; activated: boolean }>,
  connections: Array<{ sourceX: number; sourceY: number; targetX: number; targetY: number; strength: number }>,
  options: CanvasAnimationOptions = {}
) {
  const animate = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    const { width = 800, height = 600 } = options
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw connections
    connections.forEach(connection => {
      ctx.beginPath()
      ctx.moveTo(connection.sourceX, connection.sourceY)
      ctx.lineTo(connection.targetX, connection.targetY)
      ctx.strokeStyle = `rgba(100, 200, 255, ${connection.strength * 0.5})`
      ctx.lineWidth = connection.strength * 2
      ctx.stroke()
    })

    // Draw nodes
    nodes.forEach(node => {
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
      
      if (node.activated) {
        const pulse = Math.sin(time * 0.005) * 0.3 + 0.7
        ctx.fillStyle = `rgba(255, 100, 150, ${pulse})`
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.lineWidth = 2
      } else {
        ctx.fillStyle = 'rgba(100, 150, 255, 0.6)'
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
        ctx.lineWidth = 1
      }
      
      ctx.fill()
      ctx.stroke()
    })
  }, [nodes, connections, options])

  return useCanvasAnimation(animate, options)
}

// Specialized hook for particle system animations
export function useParticleCanvas(
  particles: Array<{ x: number; y: number; size: number; opacity: number; color: string }>,
  options: CanvasAnimationOptions = {}
) {
  const animate = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    const { width = 800, height = 600 } = options
    
    // Clear canvas with fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
    ctx.fillRect(0, 0, width, height)

    // Draw particles
    particles.forEach(particle => {
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = particle.color
      ctx.globalAlpha = particle.opacity
      ctx.fill()
      ctx.globalAlpha = 1
    })
  }, [particles, options])

  return useCanvasAnimation(animate, options)
}