'use client'

import React, { useState } from 'react'
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select'
import { 
    Plus, 
    Trash2, 
    CheckCircle2, 
    AlertCircle, 
    Loader2, 
    HelpCircle, 
    Layers, 
    ShieldCheck,
    Type,
    Brain
} from 'lucide-react'
import { useAddManualQuestion } from '@/hooks/use-ai-quiz'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface AddQuestionModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    quizId: string
    documentId: string
}

export function AddQuestionModal({ isOpen, onOpenChange, quizId, documentId }: AddQuestionModalProps) {
    const { mutate: addQuestion, isPending } = useAddManualQuestion()
    
    const [formData, setFormData] = useState({
        question: '',
        type: 'mcq',
        difficulty: 'easy',
        choices: ['', '', '', ''],
        correct_answer: '',
        explanation: '',
    })

    const handleChoiceChange = (index: number, value: string) => {
        const newChoices = [...formData.choices]
        newChoices[index] = value
        setFormData({ ...formData, choices: newChoices })
    }

    const addChoice = () => {
        setFormData({ ...formData, choices: [...formData.choices, ''] })
    }

    const removeChoice = (index: number) => {
        if (formData.choices.length <= 2) {
            toast.error('At least 2 choices are required')
            return
        }
        const newChoices = formData.choices.filter((_, i) => i !== index)
        setFormData({ ...formData, choices: newChoices })
        if (formData.correct_answer === formData.choices[index]) {
            setFormData({ ...formData, choices: newChoices, correct_answer: '' })
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!formData.question.trim()) {
            toast.error('Question text is required')
            return
        }
        if (!formData.correct_answer) {
            toast.error('Please select a correct answer')
            return
        }
        if (formData.choices.some(c => !c.trim())) {
            toast.error('All choices must have text')
            return
        }

        const payload = {
            question: formData.question,
            type: formData.type,
            difficulty: formData.difficulty,
            choices: formData.choices,
            correct_answer: formData.correct_answer,
            explanation: formData.explanation,
            document_id: documentId,
            quiz_id: quizId // Including for React Query invalidation in onSuccess
        }

        addQuestion(payload, {
            onSuccess: () => {
                onOpenChange(false)
                setFormData({
                    question: '',
                    type: 'mcq',
                    difficulty: 'easy',
                    choices: ['', '', '', ''],
                    correct_answer: '',
                    explanation: '',
                })
            }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0 border-none shadow-premium rounded-4xl bg-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none" />
                
                <DialogHeader className="px-5 py-3 border-b border-slate-100 relative z-10">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <Plus className="w-3.5 h-3.5 text-primary" />
                            <DialogTitle className="text-sm font-bold text-slate-900">New Question</DialogTitle>
                        </div>
                        <div className="flex items-center gap-1.5">
                             <div className="flex items-center bg-slate-100 px-2 py-0.5 rounded-md">
                                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                                    <SelectTrigger className="bg-transparent border-none shadow-none h-5 text-[9px] font-bold p-0 min-w-20 focus:ring-0">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-lg border-slate-100 shadow-xl">
                                        <SelectItem value="mcq" className="text-[10px]">MCQ</SelectItem>
                                        <SelectItem value="boolean" className="text-[10px]">T/F</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center bg-slate-100 px-2 py-0.5 rounded-md">
                                <Select value={formData.difficulty} onValueChange={(v) => setFormData({ ...formData, difficulty: v })}>
                                    <SelectTrigger className="bg-transparent border-none shadow-none h-5 text-[9px] font-bold p-0 min-w-15 focus:ring-0">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-lg border-slate-100 shadow-xl">
                                        <SelectItem value="easy" className="text-[10px] text-green-600">Easy</SelectItem>
                                        <SelectItem value="medium" className="text-[10px] text-amber-600">Med</SelectItem>
                                        <SelectItem value="hard" className="text-[10px] text-red-600">Hard</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-3 space-y-3 relative z-10 custom-scrollbar">
                    {/* Question Text */}
                    <div className="space-y-1">
                        <Textarea 
                            placeholder="Type your question statement..."
                            value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            className="min-h-12.5 rounded-lg border-slate-200 bg-white focus:border-primary focus:ring-0 text-[11px] font-medium p-2 shadow-none"
                        />
                    </div>

                    {/* Choices Section */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between px-0.5">
                            <Label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Options</Label>
                            <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                onClick={addChoice}
                                className="h-5 px-1.5 text-[9px] font-bold text-primary hover:bg-primary/5 rounded"
                            >
                                <Plus className="w-2.5 h-2.5 mr-0.5" />
                                Add
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {formData.choices.map((choice, index) => {
                                const isCorrect = formData.correct_answer === choice && choice !== '';
                                return (
                                    <div 
                                        key={index} 
                                        className={cn(
                                            "flex items-center h-8 bg-slate-50/50 rounded-lg border px-2 transition-all",
                                            isCorrect ? "border-green-300 bg-green-50" : "border-slate-100 hover:border-slate-200"
                                        )}
                                    >
                                        <span className="text-[9px] font-bold text-slate-300 mr-1.5">{String.fromCharCode(65 + index)}</span>
                                        <Input 
                                            placeholder={`Option content...`}
                                            value={choice}
                                            onChange={(e) => handleChoiceChange(index, e.target.value)}
                                            className="h-full border-none bg-transparent p-0 text-[10px] font-semibold focus-visible:ring-0 shadow-none flex-1"
                                        />
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon"
                                            onClick={() => removeChoice(index)}
                                            className="h-5 w-5 rounded text-slate-300 hover:text-red-500"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Correct Answer Field */}
                    <div className="flex items-center gap-3 pt-2 border-t border-slate-50">
                        <div className="flex items-center gap-1 min-w-20">
                            <ShieldCheck className="w-3 h-3 text-slate-400" />
                            <Label className="text-[9px] font-bold text-slate-400 uppercase">Correct</Label>
                        </div>
                        <Select 
                            value={formData.correct_answer} 
                            onValueChange={(v) => setFormData({ ...formData, correct_answer: v })}
                        >
                            <SelectTrigger className="bg-white border-slate-100 shadow-none rounded-lg h-7 text-[10px] font-bold focus:ring-0 flex-1">
                                <SelectValue placeholder="Identify correct choice..." />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg border-slate-100 shadow-xl max-h-30">
                                {formData.choices.filter(c => c.trim()).map((choice, i) => (
                                    <SelectItem key={i} value={choice} className="rounded-md py-1.5 text-[10px] font-medium">
                                        {String.fromCharCode(65 + i)}: {choice}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Explanation */}
                    <div className="space-y-1">
                        <Textarea 
                            placeholder="Brief rationale (optional)..."
                            value={formData.explanation}
                            onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                            className="min-h-10 rounded-lg border-slate-200 bg-white focus:border-primary focus:ring-0 text-[10px] font-medium p-2 shadow-none"
                        />
                    </div>
                </form>

                <DialogFooter className="px-5 py-2.5 bg-slate-50/80 border-t border-slate-100 flex-row justify-between items-center rounded-b-4xl">
                    <p className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">Micro Editor v2.0</p>
                    <div className="flex gap-2">
                        <Button 
                            variant="ghost" 
                            onClick={() => onOpenChange(false)}
                            className="h-7 rounded-lg font-bold text-[10px] text-slate-500 px-3"
                        >
                            Close
                        </Button>
                        <Button 
                            onClick={handleSubmit} 
                            disabled={isPending}
                            className="bg-slate-900 hover:bg-slate-800 text-white shadow shadow-slate-900/10 px-4 rounded-lg font-bold h-7 text-[10px]"
                        >
                            {isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Plus className="w-3 h-3 mr-1" />}
                            Save
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
