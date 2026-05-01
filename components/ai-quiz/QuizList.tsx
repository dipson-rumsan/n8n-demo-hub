'use client'

import React, { useState } from 'react'
import { useQuizzes, useDocuments } from '@/hooks/use-ai-quiz'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, ListChecks, Loader2, Calendar, FileText, Eye, X, ChevronLeft, Link2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { aiQuizAPI } from "@/lib/api/ai-quiz";

interface QuizListProps {
    onSelectQuiz: (quiz: any) => void
    showCreateFormOnly?: boolean
    showQuizListOnly?: boolean
    onQuizCreated?: () => void
}

export function QuizList({ onSelectQuiz, showCreateFormOnly = false, showQuizListOnly = false, onQuizCreated }: QuizListProps) {
    const { data: quizzes = [], isLoading: quizzesLoading } = useQuizzes()
    const queryClient = useQueryClient()

    const [inputUrl, setInputUrl] = useState('')
    const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(['Easy'])
    const [selectedQuestionTypes] = useState<string[]>(['mcq'])
    const [isGenerating, setIsGenerating] = useState(false)
    const [selectedQuizForAdd, setSelectedQuizForAdd] = useState<any | null>(null)

    const toggleDifficulty = (difficulty: string) => {
        setSelectedDifficulties(prev =>
            prev.includes(difficulty)
                ? prev.filter(d => d !== difficulty)
                : [...prev, difficulty]
        )
    }

    const handleGenerateQuestions = async () => {
        if (!inputUrl) {
            toast.error('Please enter a URL')
            return
        }
        if (selectedDifficulties.length === 0) {
            toast.error('Please select at least one difficulty level')
            return
        }

        setIsGenerating(true)
        try {
            const response = await aiQuizAPI.generateQuestions({
                url: inputUrl,
                difficulties: selectedDifficulties,
                question_types: selectedQuestionTypes
            })

            queryClient.invalidateQueries({ queryKey: ['quizzes'] })
            toast.success(`Quiz created successfully!`)
            setInputUrl('')

            // Fetch newly created quiz to select it
            const newQuizzesResp = await aiQuizAPI.getQuizzes()
            const newQuizzes = Array.isArray(newQuizzesResp) ? newQuizzesResp : (newQuizzesResp as any).quizzes || []
            const newQuiz = newQuizzes.find((q: any) => q.id === response.quiz_id)

            if (newQuiz) {
                onSelectQuiz(newQuiz)
            } else {
                onQuizCreated?.()
            }
        } catch (error: any) {
            console.error('Question generation failed:', error)
            toast.error(`Generation failed: ${error.message || 'Unknown error'}`)
        } finally {
            setIsGenerating(false)
        }
    }

    const handleGenerateQuestionsForQuiz = async () => {
        if (!selectedQuizForAdd) return
        if (selectedDifficulties.length === 0) {
            toast.error('Please select at least one difficulty level')
            return
        }
        if (selectedQuestionTypes.length === 0) {
            toast.error('Please select at least one question type')
            return
        }

        setIsGenerating(true)
        try {
            await aiQuizAPI.generateQuestionsAI({
                difficulties: selectedDifficulties,
                document_id: selectedQuizForAdd.document_id,
                question_types: selectedQuestionTypes
            })

            queryClient.invalidateQueries({ queryKey: ['questions'] })
            toast.success('Questions generated successfully!')
            setSelectedQuizForAdd(null)
        } catch (error: any) {
            console.error('Question generation failed:', error)
            toast.error(`Generation failed: ${error.message || 'Unknown error'}`)
        } finally {
            setIsGenerating(false)
        }
    }

    const handleAddQuestions = (quiz: any) => {
        setSelectedQuizForAdd(quiz)
    }



    return (
        <div className="space-y-10">
            {/* Question Generation Form - Only in Questions tab */}
            {!selectedQuizForAdd && !showQuizListOnly && (
                <Card className="border-none shadow-premium bg-white/40 backdrop-blur-xl ring-1 ring-black/5 overflow-hidden rounded-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />
                    <CardHeader className="relative pb-4 border-b border-slate-100/50 mb-4">
                        <CardTitle className="text-xl sm:text-2xl font-black flex items-center gap-3 text-slate-900">
                            <div className="p-2 rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20 text-white">
                                <Plus className="w-5 h-5" />
                            </div>
                            Create New Quiz
                        </CardTitle>
                        <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium leading-relaxed">
                            Provide a URL to automatically generate an interactive AI quiz. Generation might take a few moments depending on the selected difficulty levels.
                        </p>
                    </CardHeader>
                    <CardContent className="relative pt-2">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Difficulty Levels</label>
                                <div className="flex gap-2 p-1.5 bg-slate-100/80 rounded-xl shadow-inner">
                                    {['Easy', 'Medium', 'Hard'].map((difficulty) => {
                                        const isSelected = selectedDifficulties.includes(difficulty);
                                        return (
                                            <button
                                                key={difficulty}
                                                type="button"
                                                onClick={() => toggleDifficulty(difficulty)}
                                                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${isSelected
                                                    ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5'
                                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                                    }`}
                                            >
                                                {difficulty}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-sm font-bold text-slate-700">Add PDF Link</label>
                                    <button
                                        type="button"
                                        onClick={() => setInputUrl('https://rumsan.nyc3.cdn.digitaloceanspaces.com/rumsan-group/rahat-whitepaper.pdf')}
                                        className="text-[10px] font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all uppercase tracking-wider"
                                    >
                                        Try Sample URL
                                    </button>
                                </div>
                                <div className={`relative group flex items-center bg-white border-2 transition-all duration-300 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 shadow-sm ${inputUrl ? 'border-blue-400' : 'border-slate-200'}`}>
                                    <div className="pl-4 pr-3 flex items-center justify-center text-slate-400">
                                        <Link2 className={`w-5 h-5 transition-colors ${inputUrl ? 'text-blue-500' : 'group-focus-within:text-blue-500'}`} />
                                    </div>
                                    <Input
                                        type="url"
                                        placeholder="https://example.com/article..."
                                        value={inputUrl}
                                        onChange={(e) => setInputUrl(e.target.value)}
                                        disabled={isGenerating}
                                        className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 px-0 py-4 h-auto text-base font-semibold placeholder:text-slate-300 text-slate-900"
                                    />
                                </div>
                            </div>

                            <Button
                                type="button"
                                onClick={handleGenerateQuestions}
                                disabled={isGenerating || !inputUrl || selectedDifficulties.length === 0}
                                className="w-full h-14 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-base font-bold shadow-xl shadow-blue-500/30 transition-all hover:-translate-y-1 hover:shadow-blue-500/40 disabled:opacity-50 disabled:hover:translate-y-0"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Generating Quiz (This may take a moment)...
                                    </>
                                ) : (
                                    <>
                                        <ListChecks className="w-5 h-5 mr-2" />
                                        Generate & Create Quiz
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Question Generation Section - Only shown when Add is clicked */}
            {selectedQuizForAdd && (
                <div className="space-y-3 animate-in fade-in duration-300">
                    <Button
                        variant="ghost"
                        onClick={() => setSelectedQuizForAdd(null)}
                        className="gap-2 hover:bg-slate-100 rounded-lg font-bold text-slate-600 h-8"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Quiz List
                    </Button>

                    <Card className="border-none shadow-premium bg-white/40 backdrop-blur-xl ring-1 ring-black/5 overflow-hidden rounded-2xl">
                        <CardHeader className="pb-2 pt-3">
                            <CardTitle className="text-sm font-bold text-slate-900">
                                Add Questions to "{selectedQuizForAdd.title}"
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2.5 pt-0 pb-3">

                            <Button
                                type="button"
                                onClick={handleGenerateQuestionsForQuiz}
                                disabled={isGenerating || selectedDifficulties.length === 0 || selectedQuestionTypes.length === 0}
                                className="w-full h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-3 h-3 animate-spin mr-1.5" />
                                        Generating...
                                    </>
                                ) : (
                                    'Generate Questions'
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Quiz List Section - Only shown when not in create form only mode */}
            {!showCreateFormOnly && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-xl font-bold text-slate-800">Your Quizzes</h3>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md">
                            {quizzes.length} Total
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quizzesLoading && quizzes.length === 0 ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-40 rounded-3xl bg-slate-100/50 animate-pulse border border-slate-200/50" />
                            ))
                        ) : quizzes.length === 0 ? (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white/40 backdrop-blur-xl rounded-2xl border border-dashed border-slate-200 shadow-soft text-center">
                                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                                    <ListChecks className="w-8 h-8 text-slate-200" />
                                </div>
                                <h4 className="text-lg font-bold text-slate-700">No quizzes available</h4>
                                <p className="text-sm text-slate-500 max-w-60">
                                    {showQuizListOnly
                                        ? 'Go to the "Questions" tab to create your first quiz.'
                                        : 'Create your first quiz using the form above to start managing questions.'}
                                </p>
                            </div>
                        ) : (
                            quizzes.map((quiz: any) => (
                                <Card
                                    key={quiz.id}
                                    className="group border-none shadow-soft hover:shadow-premium bg-white/60 backdrop-blur-xl transition-all duration-300 rounded-2xl overflow-hidden ring-1 ring-black/5 hover:-translate-y-1"
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                                                <ListChecks className="w-5 h-5" />
                                            </div>
                                            <Badge variant="outline" className="text-[9px] uppercase tracking-widest font-bold bg-white/50 py-0.5 border-slate-200">
                                                Ready
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                                            {quiz.title}
                                        </CardTitle>
                                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-bold uppercase tracking-tight">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(quiz.created_at).toLocaleDateString(undefined, {
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-2">
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="flex-1 rounded-lg h-9 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold"
                                                onClick={() => onSelectQuiz(quiz)}
                                            >
                                                <Eye className="w-4 h-4 mr-1.5" />
                                                View
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="flex-1 rounded-lg h-9 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold"
                                                onClick={() => handleAddQuestions(quiz)}
                                            >
                                                <Plus className="w-4 h-4 mr-1.5" />
                                                Add
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
