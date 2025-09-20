// Core learning types
export interface LearningStyle {
  type: string
  percentage: number
  description: string
  tools: string[]
}

export interface QuizQuestion {
  id: string
  question: string
  options: QuizOption[]
}

export interface QuizOption {
  id: string
  text: string
  type: LearningType
}

export type LearningType = 
  | 'visual' 
  | 'auditory' 
  | 'kinesthetic' 
  | 'reading'
  | 'adhd'
  | 'autism'
  | 'sensory'
  | 'engagement'
  | 'structured'
  | 'creative'
  | 'verbal'
  | 'written'
  | 'flexible'
  | 'intensive'
  | 'consistent'

export interface QuizResult {
  learningStyles: LearningStyle[]
  completedAt: Date
  responses: Record<string, string>
}

// Accessibility types
export interface AccessibilitySettings {
  fontSize: number
  highContrast: boolean
  reduceMotion: boolean
  readingGuide: boolean
  speechEnabled: boolean
  dyslexicFont: boolean
}

export interface Theme {
  name: 'light' | 'dark' | 'high-contrast'
  displayName: string
}

// Neurodivergent condition types
export interface NeurodivergentCondition {
  id: string
  name: string
  description: string
  icon: string
  accommodations: string[]
}

// Animation types
export interface AnimationConfig {
  enabled: boolean
  reducedMotion: boolean
  logoFloat: number
  logoRotation: number
  gradientPosition: number
}

// Component prop types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface InteractiveElementProps extends BaseComponentProps {
  onClick?: () => void
  onKeyDown?: (event: React.KeyboardEvent) => void
  disabled?: boolean
  'aria-label'?: string
}

// Neural network visualization types
export interface Node {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  activated: boolean
  connections: string[]
}

export interface Connection {
  id: string
  sourceId: string
  targetId: string
  strength: number
  animated: boolean
}

export interface Particle {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
}

// Navigation types
export interface NavigationItem {
  id: string
  name: string
  href: string
  icon?: string
  active?: boolean
}

// Error types
export interface AppError {
  code: string
  message: string
  severity: 'low' | 'medium' | 'high'
}

// State management types
export interface AppState {
  accessibility: AccessibilitySettings
  theme: Theme['name']
  quiz: {
    currentQuestion: number
    responses: Record<string, string>
    result?: QuizResult
    isActive: boolean
  }
  navigation: {
    currentPage: string
    history: string[]
  }
}

// API types
export interface APIResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: AppError
}