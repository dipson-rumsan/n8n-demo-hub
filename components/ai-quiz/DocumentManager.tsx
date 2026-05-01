'use client'

import React, { useState, useRef } from 'react'
import { useDocuments, useUploadDocument } from '@/hooks/use-ai-quiz'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FileUp, FileText, Loader2, RefreshCcw, X, Upload, CheckCircle2, LayoutList } from 'lucide-react'
import { cn } from '@/lib/utils'

export function DocumentManager() {
    const [fileSelection, setFileSelection] = useState<{ type: 'sample' | 'file'; name: string; file?: File } | null>({
        type: 'sample',
        name: 'Employee Handbook- Master 2025.pdf'
    })
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { data: documents = [], isLoading, refetch } = useDocuments()
    const { mutate: upload, isPending: uploading } = useUploadDocument()

    const handleUpload = async () => {
        if (!fileSelection) return

        const useSample = fileSelection.type === 'sample'
        
        const uploadDocument = (fileToUpload: File) => {
            const formData = new FormData()
            formData.append('files', fileToUpload)
            
            upload(formData, {
                onSuccess: (data) => {
                    setFileSelection(null)
                    if (data?.status === 409) {
                        toast.info('Document already exists')
                    } else {
                        toast.success('Document uploaded successfully')
                    }
                },
                onError: () => {
                    setFileSelection(null)
                }
            })
        }

        if (useSample) {
            fetch('/Employee Handbook- Master 2025.pdf')
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], 'Employee Handbook- Master 2025.pdf', { type: 'application/pdf' })
                    uploadDocument(file)
                })
                .catch(() => toast.error('Failed to load sample document'))
        } else {
            uploadDocument(fileSelection.file!)
        }
    }

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const onDragLeave = () => {
        setIsDragging(false)
    }

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const droppedFile = e.dataTransfer.files?.[0]
        if (droppedFile && isValidFileType(droppedFile)) {
            setFileSelection({
                type: 'file',
                name: droppedFile.name,
                file: droppedFile
            })
        } else {
            toast.error('Please upload a PDF or Word document')
        }
    }

    const isValidFileType = (file: File) => {
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        return validTypes.includes(file.type) || file.name.endsWith('.pdf') || file.name.endsWith('.doc') || file.name.endsWith('.docx')
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null
        if (selectedFile) {
            setFileSelection({
                type: 'file',
                name: selectedFile.name,
                file: selectedFile
            })
        }
    }

    const clearFile = () => {
        setFileSelection(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
        <div className="space-y-6">
            <Card className="border-none shadow-premium bg-white/40 backdrop-blur-xl overflow-hidden ring-1 ring-black/5">
                <div className="absolute inset-0 bg-linear-to-br from-blue-50/50 via-transparent to-purple-50/50 pointer-events-none" />
                <CardHeader className="relative pb-2">
                    <CardTitle className="flex items-center gap-3 text-xl font-bold">
                        <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600">
                            <FileUp className="w-5 h-5" />
                        </div>
                        Upload Document
                    </CardTitle>
                </CardHeader>
                <CardContent className="relative space-y-4 pt-0">
                    {fileSelection?.type === 'sample' && (
                        <div className="mx-1 p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-center gap-3">
                            <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-900 font-semibold">
                                    Pre-selected: Employee Handbook
                                </p>
                                <p className="text-[10px] text-slate-600 mt-0.5">
                                    Get started instantly or remove to upload your own document.
                                </p>
                            </div>
                        </div>
                    )}
                    
                    {!fileSelection ? (
                        <div
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={cn(
                                "relative group cursor-pointer rounded-xl border-2 border-dashed transition-all duration-300 flex items-center gap-6 py-6 px-10",
                                isDragging 
                                    ? "border-blue-500 bg-blue-500/5 scale-[0.99]" 
                                    : "border-slate-200 hover:border-blue-400 hover:bg-slate-50/50"
                            )}
                        >
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".pdf,.doc,.docx"
                            />
                            
                            <div className={cn(
                                "w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:bg-blue-50",
                                isDragging && "bg-blue-100 scale-110"
                            )}>
                                <Upload className={cn(
                                    "w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors",
                                    isDragging && "text-blue-600"
                                )} />
                            </div>
                            
                            <div className="text-left flex-1">
                                <p className="text-base font-semibold text-slate-900">
                                    Click to upload or drag and drop
                                </p>
                                <p className="text-sm text-slate-500">
                                    PDF, DOC, DOCX up to 10MB
                                </p>
                            </div>

                            <Button variant="outline" size="sm" className="relative z-10 rounded-lg h-9 font-medium px-4 shrink-0 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300">
                                Select File
                            </Button>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center gap-4 p-4 rounded-lg border bg-blue-50 border-blue-200">
                                <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0 bg-blue-600 text-white">
                                    <FileText className="w-5 h-5" />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-900 truncate text-sm">
                                        {fileSelection.name}
                                    </p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-0.5">
                                        {fileSelection.type === 'sample' ? 'Ready to upload' : fileSelection.file ? formatFileSize(fileSelection.file.size) + ' • Ready' : 'Ready'}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 relative z-10">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={clearFile}
                                        className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                        onClick={handleUpload} 
                                        disabled={uploading}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 h-9 text-sm rounded-lg"
                                    >
                                        {uploading ? (
                                            <>
                                                <Loader2 className="w-3 h-3 animate-spin mr-2" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-3.5 h-3.5 mr-2" />
                                                Upload
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="border-none shadow-premium bg-white/40 backdrop-blur-xl ring-1 ring-black/5 overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div>
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <LayoutList className="w-5 h-5 text-purple-500" />
                            Document Library
                        </CardTitle>
                        <CardDescription>Managed documents for quiz generation.</CardDescription>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => refetch()} 
                        disabled={isLoading}
                        className="rounded-full hover:bg-slate-100"
                    >
                        <RefreshCcw className={cn("w-4 h-4 text-slate-500", isLoading && "animate-spin")} />
                    </Button>
                </CardHeader>
                <CardContent>
                    {isLoading && documents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 space-y-4">
                            <div className="relative">
                                <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                                <div className="absolute inset-0 blur-xl bg-blue-500/20" />
                            </div>
                            <p className="text-sm font-medium text-slate-500">Loading your documents...</p>
                        </div>
                    ) : documents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                                <FileText className="w-10 h-10 text-slate-200" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No documents yet</h3>
                            <p className="text-sm text-slate-500 max-w-70">
                                Upload your first document above to start generating AI powered quizzes.
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-slate-200/60 overflow-hidden bg-white/20">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="hover:bg-transparent border-slate-200/60">
                                        <TableHead className="py-4 font-bold text-slate-700">Document Name</TableHead>
                                        <TableHead className="py-4 font-bold text-slate-700">Status</TableHead>
                                        <TableHead className="py-4 font-bold text-slate-700">Modified</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {documents.map((doc: any, index: number) => (
                                        <TableRow 
                                            key={doc.document_id} 
                                            className="group hover:bg-white/40 transition-colors border-slate-200/60"
                                        >
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                                        <FileText className="w-4 h-4" />
                                                    </div>
                                                    <span className="font-medium text-slate-900">{doc.title || 'Untitled Document'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                                    </span>
                                                    <span className="text-sm font-medium text-slate-600">
                                                        {doc.status || 'Processed'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 text-sm text-slate-500">
                                                {new Date(doc.uploaded_at).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
