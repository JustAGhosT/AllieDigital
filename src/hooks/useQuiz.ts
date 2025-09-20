import { useState, useCallback, useEffect } from 'react'
import { QuizQuestion, QuizResult, LearningStyle, LearningType } from '@/types'
import { QUIZ_QUESTIONS, LEARNING_STYLE_DESCRIPTIONS, STORAGE_KEYS } from '@/lib/constants'
import { SafeStorage, announceToScreenReader } from '@/utils'

interface QuizState {
  currentQuestion: number
  responses: Record<string, string>
  isActive: boolean
  isComplete: boolean
}

export function useQuiz() {
  const [state, setState] = useState<QuizState>({
    currentQuestion: 0,
    responses: {},
    isActive: false,
    isComplete: false,
  })

  const [result, setResult] = useState<QuizResult | null>(null)

  useEffect(() => {
    const savedResult = SafeStorage.get(STORAGE_KEYS.QUIZ_RESULTS, null)
    if (savedResult) {
      setResult(savedResult)
    }
  }, [])

  const startQuiz = useCallback(() => {
    setState({
      currentQuestion: 0,
      responses: {},
      isActive: true,
      isComplete: false,
    })
    setResult(null)
    announceToScreenReader('Learning style quiz started')
  }, [])

  const answerQuestion = useCallback((optionId: string) => {
    const questionId = QUIZ_QUESTIONS[state.currentQuestion].id
    const newResponses = { ...state.responses, [questionId]: optionId }
    
    setState(prev => ({
      ...prev,
      responses: newResponses,
    }))

    announceToScreenReader(`Answer selected for question ${state.currentQuestion + 1}`)
  }, [state.currentQuestion, state.responses])

  const nextQuestion = useCallback(() => {
    if (state.currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
      }))
      announceToScreenReader(`Moving to question ${state.currentQuestion + 2} of ${QUIZ_QUESTIONS.length}`)
    } else {
      completeQuiz()
    }
  }, [state.currentQuestion])

  const previousQuestion = useCallback(() => {
    if (state.currentQuestion > 0) {
      setState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion - 1,
      }))
      announceToScreenReader(`Moving to question ${state.currentQuestion} of ${QUIZ_QUESTIONS.length}`)
    }
  }, [state.currentQuestion])

  const completeQuiz = useCallback(() => {
    const learningStyles = calculateLearningStyles(state.responses)
    const quizResult: QuizResult = {
      learningStyles,
      completedAt: new Date(),
      responses: state.responses,
    }

    setResult(quizResult)
    setState(prev => ({
      ...prev,
      isActive: false,
      isComplete: true,
    }))

    SafeStorage.set(STORAGE_KEYS.QUIZ_RESULTS, quizResult)
    announceToScreenReader('Quiz completed. Your personalized learning style results are ready.')
  }, [state.responses])

  const resetQuiz = useCallback(() => {
    setState({
      currentQuestion: 0,
      responses: {},
      isActive: false,
      isComplete: false,
    })
    setResult(null)
    SafeStorage.remove(STORAGE_KEYS.QUIZ_RESULTS)
    announceToScreenReader('Quiz reset')
  }, [])

  const closeQuiz = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: false,
    }))
    announceToScreenReader('Quiz closed')
  }, [])

  return {
    ...state,
    result,
    questions: QUIZ_QUESTIONS,
    currentQuestionData: QUIZ_QUESTIONS[state.currentQuestion],
    progress: ((state.currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100,
    canGoNext: state.responses[QUIZ_QUESTIONS[state.currentQuestion]?.id] !== undefined,
    canGoPrevious: state.currentQuestion > 0,
    isLastQuestion: state.currentQuestion === QUIZ_QUESTIONS.length - 1,
    startQuiz,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    completeQuiz,
    resetQuiz,
    closeQuiz,
  }
}

function calculateLearningStyles(responses: Record<string, string>): LearningStyle[] {
  const typeCounts: Record<LearningType, number> = {} as any
  
  // Count occurrences of each learning type
  Object.values(responses).forEach(optionId => {
    const option = QUIZ_QUESTIONS
      .flatMap(q => q.options)
      .find(opt => opt.id === optionId)
    
    if (option) {
      typeCounts[option.type] = (typeCounts[option.type] || 0) + 1
    }
  })

  // Calculate percentages and create learning styles
  const totalResponses = Object.keys(responses).length
  const learningStyles: LearningStyle[] = Object.entries(typeCounts)
    .map(([type, count]) => {
      const percentage = (count / totalResponses) * 100
      const styleInfo = LEARNING_STYLE_DESCRIPTIONS[type as keyof typeof LEARNING_STYLE_DESCRIPTIONS]
      
      return {
        type,
        percentage,
        description: styleInfo?.description || 'Custom learning preference',
        tools: styleInfo?.tools ? [...styleInfo.tools] : [],
      }
    })
    .filter(style => style.percentage > 0)
    .sort((a, b) => b.percentage - a.percentage)

  return learningStyles
}