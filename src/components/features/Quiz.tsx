'use client'

import React from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/Dialog'
import { useQuiz } from '@/hooks/useQuiz'
import { cn, formatPercentage } from '@/utils'

interface QuizProps {
  isOpen: boolean
  onClose: () => void
}

export function Quiz({ isOpen, onClose }: QuizProps) {
  const {
    isActive,
    isComplete,
    result,
    currentQuestionData,
    currentQuestion,
    progress,
    responses,
    canGoNext,
    canGoPrevious,
    isLastQuestion,
    startQuiz,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    resetQuiz,
    closeQuiz,
  } = useQuiz()

  const handleClose = () => {
    closeQuiz()
    onClose()
  }

  const handleAnswerSelect = (optionId: string) => {
    answerQuestion(optionId)
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {!isActive && !isComplete && (
          <QuizStart onStart={startQuiz} onClose={handleClose} />
        )}
        
        {isActive && currentQuestionData && (
          <QuizQuestion
            question={currentQuestionData}
            questionNumber={currentQuestion + 1}
            totalQuestions={8}
            progress={progress}
            selectedAnswer={responses[currentQuestionData.id]}
            onAnswerSelect={handleAnswerSelect}
            onNext={nextQuestion}
            onPrevious={previousQuestion}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
            isLastQuestion={isLastQuestion}
          />
        )}
        
        {isComplete && result && (
          <QuizResults result={result} onReset={resetQuiz} onClose={handleClose} />
        )}
      </DialogContent>
    </Dialog>
  )
}

interface QuizStartProps {
  onStart: () => void
  onClose: () => void
}

function QuizStart({ onStart, onClose }: QuizStartProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">
          Discover Your Learning Style
        </DialogTitle>
        <DialogDescription className="text-base">
          Take our personalised assessment to understand how you learn best. 
          This quiz helps identify your unique learning preferences and provides 
          tailored recommendations for your educational journey.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            What you'll discover:
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Your primary learning style preferences</li>
            <li>• Neurodivergent-specific accommodations</li>
            <li>• Personalised tool recommendations</li>
            <li>• Strategies for optimal learning</li>
          </ul>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Maybe Later
          </Button>
          <Button onClick={onStart} className="px-8">
            Start Assessment
          </Button>
        </div>
      </div>
    </>
  )
}

interface QuizQuestionProps {
  question: any
  questionNumber: number
  totalQuestions: number
  progress: number
  selectedAnswer?: string
  onAnswerSelect: (optionId: string) => void
  onNext: () => void
  onPrevious: () => void
  canGoNext: boolean
  canGoPrevious: boolean
  isLastQuestion: boolean
}

function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  progress,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  isLastQuestion,
}: QuizQuestionProps) {
  return (
    <>
      <DialogHeader>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-500">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm text-slate-500">
            {formatPercentage(progress)} complete
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4">
          <div
            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <DialogTitle className="text-lg font-semibold text-left">
          {question.question}
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-3">
        {question.options.map((option: any) => (
          <button
            key={option.id}
            onClick={() => onAnswerSelect(option.id)}
            className={cn(
              'w-full p-4 text-left rounded-lg border transition-all duration-200',
              'hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              selectedAnswer === option.id
                ? 'border-primary-500 bg-primary-100 dark:bg-primary-900/30 text-primary-900 dark:text-primary-100'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
            )}
            aria-pressed={selectedAnswer === option.id}
          >
            <div className="flex items-start space-x-3">
              <div className={cn(
                'w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5',
                selectedAnswer === option.id
                  ? 'border-primary-500 bg-primary-500'
                  : 'border-slate-300 dark:border-slate-600'
              )}>
                {selectedAnswer === option.id && (
                  <div className="w-full h-full rounded-full bg-white scale-50" />
                )}
              </div>
              <span className="text-sm">{option.text}</span>
            </div>
          </button>
        ))}
      </div>
      
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>
        
        <Button
          onClick={onNext}
          disabled={!canGoNext}
          className="flex items-center space-x-2"
        >
          <span>{isLastQuestion ? 'Complete' : 'Next'}</span>
          {!isLastQuestion && <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>
    </>
  )
}

interface QuizResultsProps {
  result: any
  onReset: () => void
  onClose: () => void
}

function QuizResults({ result, onReset, onClose }: QuizResultsProps) {
  const topStyles = result.learningStyles.slice(0, 3)

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl font-bold text-center">
          Your Personalised Learning Profile
        </DialogTitle>
        <DialogDescription className="text-center">
          Based on your responses, here are your top learning preferences
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6">
        {topStyles.map((style: any, index: number) => (
          <div key={style.type} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-lg">
                #{index + 1} {style.type.charAt(0).toUpperCase() + style.type.slice(1)} Learning
              </h3>
              <span className="text-lg font-bold text-primary-600">
                {formatPercentage(style.percentage)}
              </span>
            </div>
            
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {style.description}
            </p>
            
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Recommended Tools:</h4>
              <div className="flex flex-wrap gap-2">
                {style.tools.map((tool: string) => (
                  <span
                    key={tool}
                    className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
        
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onReset}>
            Retake Quiz
          </Button>
          <Button onClick={onClose}>
            Continue Exploring
          </Button>
        </div>
      </div>
    </>
  )
}