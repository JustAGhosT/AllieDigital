'use client'

import React from 'react'

export function QuizSkeleton() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          {/* Header skeleton */}
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          
          {/* Progress bar skeleton */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 animate-pulse">
            <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded-full w-1/3" />
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Question skeleton */}
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
          </div>

          {/* Options skeleton */}
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1 animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Navigation buttons skeleton */}
          <div className="flex justify-between pt-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function QuizResultSkeleton() {
  return (
    <div className="space-y-6">
      {/* Title skeleton */}
      <div className="text-center space-y-2">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto animate-pulse" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto animate-pulse" />
      </div>

      {/* Results skeleton */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse" />
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 animate-pulse">
              <div 
                className="h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"
                style={{ width: `${Math.random() * 60 + 20}%` }}
              />
            </div>
            <div className="mt-2 space-y-1">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Action buttons skeleton */}
      <div className="flex gap-3 justify-center">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
      </div>
    </div>
  )
}