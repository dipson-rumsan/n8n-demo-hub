'use client'

import React, { useState } from 'react'
import {
    useQuestions,
    useUpdateQuestion,
    useDeleteQuestion
} from '@/hooks/use-ai-quiz'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Plus,
    Trash2,
    Save,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ChevronLeft,
    LayoutList,
    X,
    Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuestionManagerProps {
    quiz: any
    onBack: () => void
}

export function QuestionManager({ quiz, onBack }: QuestionManagerProps) {
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')

    // Fetch questions for the quiz
    const { data: questions = [], isLoading, refetch } = useQuestions(quiz.id, {
        documentId: quiz.document_id,
        page: 1,
        limit: 20,
        difficulty: difficulty
    })
    
    const { mutate: updateQuestion, isPending: updating } = useUpdateQuestion()
    const { mutate: deleteQuestion } = useDeleteQuestion()

    const [editingId, setEditingId] = useState<string | null>(null)
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
    const [score, setScore] = useState(0)

    const handleDelete = (id: string) => {
        deleteQuestion({ id, quizId: quiz.id })
    }

    const handleUpdate = (id: string) => {
        const text = (document.getElementById(`q-text-${id}`) as HTMLTextAreaElement).value
        updateQuestion({ id, data: { question_text: text } }, {
            onSuccess: () => setEditingId(null)
        })
    }

    const handleSelectAnswer = (questionId: string, selectedOption: string) => {
        if (selectedAnswers[questionId]) return;

        const question = questions.find((q: any) => q.id === questionId);
        if (question && selectedOption === (question.correct_answer || question.answer)) {
            setScore(prev => prev + 1);
        }

        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: selectedOption
        }))
    }

    const allAnswered = questions.length > 0 && Object.keys(selectedAnswers).length === questions.length;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onBack} className="gap-2 hover:bg-slate-100 rounded-lg font-bold text-slate-600">
                    <ChevronLeft className="w-4 h-4" />
                    Back to Quizzes
                </Button>
            </div>

            <Card className="border-none shadow-premium bg-white/40 backdrop-blur-xl overflow-hidden rounded-2xl ring-1 ring-black/5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />
                <CardHeader className="relative p-5">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle className="text-xl font-bold text-slate-900 line-clamp-2">{quiz.title}</CardTitle>
                            <p className="text-sm text-slate-500 font-medium mt-1">
                                {questions.length} Questions
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
                                <LayoutList className="w-3 h-3 text-slate-400" />
                                <select
                                    value={difficulty}
                                    onChange={(e) => {
                                        setDifficulty(e.target.value as any)
                                        setSelectedAnswers({})
                                        setScore(0)
                                    }}
                                    className="bg-transparent border-none text-[10px] font-bold uppercase tracking-wider focus:ring-0 cursor-pointer outline-none text-slate-600"
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {allAnswered && (
                <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-premium border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-4 animate-in zoom-in-95 duration-500 ring-1 ring-black/5">
                    <div>
                        <h3 className="text-xl font-black text-slate-900">Quiz Results</h3>
                        <p className="text-sm font-medium text-slate-500 mt-1">Review your answers below.</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-black text-blue-600">
                                {score} <span className="text-lg text-slate-400">/ {questions.length}</span>
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Score</div>
                        </div>
                        <Button
                            onClick={() => {
                                setSelectedAnswers({})
                                setScore(0)
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}
                            className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg"
                        >
                            Retake Quiz
                        </Button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-40 rounded-xl bg-slate-100/50 animate-pulse border border-slate-200/50" />
                    ))
                ) : questions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 bg-white/40 backdrop-blur-xl rounded-xl border border-dashed border-slate-200 shadow-soft text-center">
                        <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center mb-3">
                            <LayoutList className="w-7 h-7 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">No questions yet</h3>
                        <p className="text-xs text-slate-500 max-w-sm">
                            No questions found for this quiz. Try adjusting the filters above.
                        </p>
                    </div>
                ) : (
                    questions.map((q: any, idx: number) => {
                        const difficulty = (q.difficulty || 'medium').toLowerCase();
                        const difficultyColor =
                            difficulty === 'easy' ? 'bg-green-500/10 text-green-600' :
                                difficulty === 'hard' ? 'bg-red-500/10 text-red-600' :
                                    'bg-amber-500/10 text-amber-600';

                        const hasAnswered = selectedAnswers[q.id] !== undefined;

                        return (
                            <Card
                                key={q.id}
                                className="group border-none shadow-soft hover:shadow-md bg-white/60 backdrop-blur-xl transition-all duration-200 rounded-xl overflow-hidden ring-1 ring-black/5"
                            >
                                <CardHeader className="pb-2 pt-4 px-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2 flex-1">
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-slate-900 text-white hover:bg-slate-900 rounded-md font-bold px-1.5 py-0 text-[10px]">
                                                    Q{idx + 1}
                                                </Badge>
                                                <Badge variant="secondary" className={cn("rounded-md border-none px-1.5 py-0 font-bold uppercase text-[9px] tracking-wider", difficultyColor)}>
                                                    {difficulty}
                                                </Badge>
                                            </div>

                                            {editingId === q.id ? (
                                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <Textarea
                                                        className="mt-1 text-sm font-bold bg-white/80 border-slate-200 focus:ring-primary h-20"
                                                        defaultValue={q.question_text || q.question}
                                                        id={`q-text-${q.id}`}
                                                    />
                                                </div>
                                            ) : (
                                                <h4 className="text-base font-bold text-slate-900 leading-tight">
                                                    {q.question_text || q.question}
                                                </h4>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-1 pb-4 px-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {(q.choices || q.options)?.map((opt: string, optIdx: number) => {
                                            const isCorrect = opt === (q.correct_answer || q.answer);
                                            const isSelected = selectedAnswers[q.id] === opt;
                                            const showResult = !!selectedAnswers[q.id];

                                            let optionStyle = "bg-slate-50 border-transparent text-slate-600 hover:bg-slate-100/80 cursor-pointer";

                                            if (showResult) {
                                                if (isCorrect) {
                                                    // Correct answer - always show in green after answering
                                                    optionStyle = "bg-green-500/5 border-green-500/20 text-green-700 shadow-sm";
                                                } else if (isSelected) {
                                                    // Selected wrong answer - show in red
                                                    optionStyle = "bg-red-500/5 border-red-500/20 text-red-700 shadow-sm";
                                                } else {
                                                    // Other options after answering
                                                    optionStyle = "bg-slate-50 border-transparent text-slate-400";
                                                }
                                            } else if (isSelected) {
                                                // Selected, but not submitted yet
                                                optionStyle = "bg-blue-50 border-blue-500 text-blue-700 shadow-sm";
                                            }

                                            return (
                                                <div
                                                    key={optIdx}
                                                    className={cn(
                                                        "relative p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-between group/opt",
                                                        optionStyle
                                                    )}
                                                    onClick={() => handleSelectAnswer(q.id, opt)}
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <div className={cn(
                                                            "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border-2 transition-colors",
                                                            showResult && isCorrect
                                                                ? "bg-green-500 border-green-500 text-white"
                                                                : showResult && isSelected
                                                                    ? "bg-red-500 border-red-500 text-white"
                                                                    : isSelected && !showResult
                                                                        ? "bg-blue-500 border-blue-500 text-white"
                                                                        : "bg-white border-slate-200 text-slate-400 group-hover/opt:border-slate-300"
                                                        )}>
                                                            {String.fromCharCode(65 + optIdx)}
                                                        </div>
                                                        <span className="text-xs font-semibold">{opt}</span>
                                                    </div>
                                                    {showResult && isCorrect && (
                                                        <div className="flex items-center bg-green-500/10 px-1.5 py-0.5 rounded-full">
                                                            <CheckCircle2 className="w-3 h-3 text-green-600" />
                                                        </div>
                                                    )}
                                                    {showResult && isSelected && !isCorrect && (
                                                        <div className="flex items-center bg-red-500/10 px-1.5 py-0.5 rounded-full">
                                                            <X className="w-3 h-3 text-red-600" />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {(q.explanation) && selectedAnswers[q.id] && (
                                        <div className="mt-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 flex gap-2 items-start animate-in fade-in duration-500">
                                            <AlertCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                                            <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                                                <span className="font-bold mr-1">Explanation:</span>
                                                {q.explanation}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })
                )}

            </div>
        </div>
    )
}
