'use client'

import React, { useState } from 'react'
import { DocumentManager } from '@/components/ai-quiz/DocumentManager'
import { QuizList } from '@/components/ai-quiz/QuizList'
import { QuestionManager } from '@/components/ai-quiz/QuestionManager'
import { Zap } from 'lucide-react'


export default function AIQuizPage() {
    const [selectedQuiz, setSelectedQuiz] = useState<any | null>(null)

    const handleSelectQuiz = (quiz: any) => {
        setSelectedQuiz(quiz)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleBackToQuizzes = () => {
        setSelectedQuiz(null)
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navigation */}
            <nav className="sticky top-0 shrink-0 border-b border-slate-200 bg-white/80 backdrop-blur-md z-50">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex h-14 items-center justify-between">
                        <a
                            href="/"
                            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer"
                        >
                            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Zap className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-600">
                                Rumsan Automations
                            </span>
                        </a>
                    </div>
                </div>
            </nav>

            <main className="flex-1 container mx-auto px-4 py-4 max-w-3xl">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-2 bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        AI Powered Digital Literacy For Rahat
                    </h1>
                    <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
                        Transform your documents into interactive quizzes using advanced AI.
                    </p>
                </div>

                <div className="space-y-12 pb-20">
                    {!selectedQuiz ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <QuizList
                                onSelectQuiz={handleSelectQuiz}
                                showCreateFormOnly={true}
                            />
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <QuestionManager quiz={selectedQuiz} onBack={handleBackToQuizzes} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
