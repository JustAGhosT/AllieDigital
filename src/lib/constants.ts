import { QuizQuestion, NeurodivergentCondition, NavigationItem } from '@/types'

export const STORAGE_KEYS = {
  ACCESSIBILITY_SETTINGS: 'allie-digital-accessibility',
  QUIZ_RESULTS: 'allie-digital-quiz-results',
  THEME_PREFERENCE: 'allie-digital-theme',
  USER_PREFERENCES: 'allie-digital-preferences',
} as const

export const DEFAULT_ACCESSIBILITY_SETTINGS = {
  fontSize: 16,
  highContrast: false,
  reduceMotion: false,
  readingGuide: false,
  speechEnabled: false,
  dyslexicFont: false,
} as const

export const THEMES = [
  { name: 'light' as const, displayName: 'Light' },
  { name: 'dark' as const, displayName: 'Dark' },
  { name: 'high-contrast' as const, displayName: 'High Contrast' },
] as const

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: 'home', name: 'Home', href: '#home' },
  { id: 'about', name: 'About', href: '#about' },
  { id: 'features', name: 'Features', href: '#features' },
  { id: 'institutions', name: 'For Institutions', href: '#institutions' },
  { id: 'community', name: 'Community', href: '#community' },
  { id: 'contact', name: 'Contact', href: '#contact' },
] as const

export const NEURODIVERGENT_CONDITIONS: NeurodivergentCondition[] = [
  {
    id: 'adhd',
    name: 'ADHD',
    description: 'Attention Deficit Hyperactivity Disorder',
    icon: '⚡',
    accommodations: ['Movement breaks', 'Chunked content', 'Fidget tools', 'Gamified learning'],
  },
  {
    id: 'apraxia',
    name: 'Apraxia',
    description: 'Motor planning and speech difficulties',
    icon: '🗣️',
    accommodations: ['Speech support', 'Motor planning tools', 'Visual cues', 'Practice exercises'],
  },
  {
    id: 'autism',
    name: 'Autism Spectrum',
    description: 'Autism Spectrum Conditions',
    icon: '🌈',
    accommodations: ['Predictable routines', 'Sensory considerations', 'Clear structures', 'Visual schedules'],
  },
  {
    id: 'dyslexia',
    name: 'Dyslexia',
    description: 'Reading and language processing differences',
    icon: '📖',
    accommodations: ['Specialized fonts', 'Reading guides', 'Text-to-speech', 'Audio content'],
  },
  {
    id: 'dyspraxia',
    name: 'Dyspraxia',
    description: 'Motor coordination challenges',
    icon: '🤸',
    accommodations: ['Motor support', 'Alternative inputs', 'Movement planning', 'Adaptive tools'],
  },
  {
    id: 'dyscalculia',
    name: 'Dyscalculia',
    description: 'Mathematical processing differences',
    icon: '🔢',
    accommodations: ['Visual math tools', 'Number lines', 'Concrete examples', 'Step-by-step guides'],
  },
  {
    id: 'dysgraphia',
    name: 'Dysgraphia',
    description: 'Writing and fine motor challenges',
    icon: '✍️',
    accommodations: ['Typing alternatives', 'Voice input', 'Writing supports', 'Graphic organizers'],
  },
  {
    id: 'nvld',
    name: 'NVLD',
    description: 'Nonverbal Learning Disability',
    icon: '🧩',
    accommodations: ['Visual processing support', 'Explicit instruction', 'Social cues', 'Structured learning'],
  },
  {
    id: 'disorthographia',
    name: 'Disorthographia',
    description: 'Spelling and written expression difficulties',
    icon: '📝',
    accommodations: ['Spell checkers', 'Word prediction', 'Writing templates', 'Audio feedback'],
  },
] as const

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'How do you prefer to absorb new information?',
    options: [
      { id: 'q1-a', text: 'Visual diagrams and infographics', type: 'visual' },
      { id: 'q1-b', text: 'Listening to explanations or discussions', type: 'auditory' },
      { id: 'q1-c', text: 'Hands-on practice and experimentation', type: 'kinesthetic' },
      { id: 'q1-d', text: 'Reading detailed written explanations', type: 'reading' },
    ],
  },
  {
    id: 'q2',
    question: 'What helps you maintain focus during learning?',
    options: [
      { id: 'q2-a', text: 'Frequent breaks and movement', type: 'adhd' },
      { id: 'q2-b', text: 'Clear structure and predictable routines', type: 'autism' },
      { id: 'q2-c', text: 'Minimal distractions and quiet environment', type: 'sensory' },
      { id: 'q2-d', text: 'Interactive and engaging content', type: 'engagement' },
    ],
  },
  {
    id: 'q3',
    question: 'How do you prefer to demonstrate understanding?',
    options: [
      { id: 'q3-a', text: 'Multiple choice or structured formats', type: 'structured' },
      { id: 'q3-b', text: 'Creative projects and presentations', type: 'creative' },
      { id: 'q3-c', text: 'Verbal explanations or discussions', type: 'verbal' },
      { id: 'q3-d', text: 'Written reports or essays', type: 'written' },
    ],
  },
  {
    id: 'q4',
    question: "What's your ideal learning pace?",
    options: [
      { id: 'q4-a', text: 'Self-paced with flexibility to revisit', type: 'flexible' },
      { id: 'q4-b', text: 'Structured timeline with clear milestones', type: 'structured' },
      { id: 'q4-c', text: 'Intensive bursts with breaks between', type: 'intensive' },
      { id: 'q4-d', text: 'Steady, consistent daily progress', type: 'consistent' },
    ],
  },
  {
    id: 'q5',
    question: 'Which learning environment do you prefer?',
    options: [
      { id: 'q5-a', text: 'Quiet, calm spaces with minimal stimulation', type: 'sensory' },
      { id: 'q5-b', text: 'Collaborative, social learning environments', type: 'engagement' },
      { id: 'q5-c', text: 'Flexible spaces where I can move around', type: 'kinesthetic' },
      { id: 'q5-d', text: 'Organized, digital learning platforms', type: 'structured' },
    ],
  },
  {
    id: 'q6',
    question: 'How do you best process complex information?',
    options: [
      { id: 'q6-a', text: 'Breaking it into smaller, manageable chunks', type: 'adhd' },
      { id: 'q6-b', text: 'Seeing the big picture first, then details', type: 'visual' },
      { id: 'q6-c', text: 'Following a step-by-step sequence', type: 'autism' },
      { id: 'q6-d', text: 'Connecting it to things I already know', type: 'engagement' },
    ],
  },
  {
    id: 'q7',
    question: 'What motivates you most in learning?',
    options: [
      { id: 'q7-a', text: 'Seeing clear progress and achievements', type: 'structured' },
      { id: 'q7-b', text: 'Practical applications and real-world relevance', type: 'kinesthetic' },
      { id: 'q7-c', text: 'Personal interest and curiosity', type: 'engagement' },
      { id: 'q7-d', text: 'Support and encouragement from others', type: 'verbal' },
    ],
  },
  {
    id: 'q8',
    question: 'When facing a learning challenge, you prefer to:',
    options: [
      { id: 'q8-a', text: 'Work through it methodically step-by-step', type: 'autism' },
      { id: 'q8-b', text: 'Try different approaches until something works', type: 'creative' },
      { id: 'q8-c', text: 'Ask for guidance and support', type: 'verbal' },
      { id: 'q8-d', text: 'Research and find detailed explanations', type: 'reading' },
    ],
  },
] as const

export const LEARNING_STYLE_DESCRIPTIONS = {
  visual: {
    title: 'Visual Learner',
    description: 'You learn best through visual aids, diagrams, charts, and seeing information presented graphically.',
    tools: ['Mind maps', 'Infographics', 'Video content', 'Color-coded materials', 'Visual schedules'],
  },
  auditory: {
    title: 'Auditory Learner',
    description: 'You prefer learning through listening, discussions, and verbal explanations.',
    tools: ['Audio lectures', 'Discussion groups', 'Voice recordings', 'Music-based learning', 'Read-aloud features'],
  },
  kinesthetic: {
    title: 'Kinesthetic Learner',
    description: 'You learn best through hands-on activities, movement, and practical application.',
    tools: ['Interactive simulations', 'Physical models', 'Movement breaks', 'Lab activities', 'Role-playing'],
  },
  reading: {
    title: 'Reading/Writing Learner',
    description: 'You prefer learning through reading, writing, and text-based materials.',
    tools: ['Detailed notes', 'Text resources', 'Journaling', 'Written exercises', 'Research materials'],
  },
  adhd: {
    title: 'ADHD-Friendly Approach',
    description: 'You benefit from structured breaks, movement, and engaging, interactive content.',
    tools: ['Pomodoro technique', 'Fidget tools', 'Gamified learning', 'Movement breaks', 'Clear timers'],
  },
  autism: {
    title: 'Autism-Friendly Approach',
    description: 'You thrive with predictable routines, clear structures, and detailed explanations.',
    tools: ['Visual schedules', 'Detailed instructions', 'Sensory accommodations', 'Routine planning', 'Clear expectations'],
  },
  sensory: {
    title: 'Sensory-Sensitive Approach',
    description: 'You learn best in calm, low-stimulation environments with minimal distractions.',
    tools: ['Noise-cancelling headphones', 'Adjustable lighting', 'Calm spaces', 'Reduced visual clutter', 'Quiet times'],
  },
  engagement: {
    title: 'Engagement-Focused Approach',
    description: 'You learn best when content is interactive, relevant, and personally meaningful.',
    tools: ['Interactive content', 'Real-world examples', 'Personal connections', 'Choice in topics', 'Collaborative projects'],
  },
} as const

export const BRAND_COLORS = {
  primary: '#00FFB8',
  secondary: '#00D4FF',
  accent: '#9B88FF',
  purple: '#E88FFF',
} as const

export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const