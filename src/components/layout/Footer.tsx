'use client'

import React from 'react'
import { NEURODIVERGENT_CONDITIONS } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Allie Digital
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Revolutionising learning support through adaptive technology and inclusive design.
            </p>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Supporting learners with:
            </div>
            <div className="flex flex-wrap gap-1 text-xs">
              {NEURODIVERGENT_CONDITIONS.map((condition) => (
                <span
                  key={condition.id}
                  className="inline-flex items-center px-2 py-1 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                  title={condition.description}
                >
                  <span className="mr-1">{condition.icon}</span>
                  {condition.name}
                </span>
              ))}
            </div>
          </div>

          {/* Accessibility Links */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-slate-900 dark:text-white">
              Accessibility
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="#accessibility-statement" 
                  className="text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 transition-colors"
                >
                  Accessibility Statement
                </a>
              </li>
              <li>
                <a 
                  href="#keyboard-shortcuts" 
                  className="text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 transition-colors"
                >
                  Keyboard Shortcuts
                </a>
              </li>
              <li>
                <a 
                  href="#support-resources" 
                  className="text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 transition-colors"
                >
                  Support Resources
                </a>
              </li>
            </ul>
          </div>

          {/* Community Links */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-slate-900 dark:text-white">
              Community
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="#forum" 
                  className="text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 transition-colors"
                >
                  Forum
                </a>
              </li>
              <li>
                <a 
                  href="#support-groups" 
                  className="text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 transition-colors"
                >
                  Support Groups
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  className="text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            © 2024 Allie Digital. Your Digital Ally for neurodivergent minds.
          </p>
        </div>
      </div>
    </footer>
  )
}