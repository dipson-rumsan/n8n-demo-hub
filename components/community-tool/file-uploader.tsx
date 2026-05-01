import React from "react";
import { Upload, FileText, Loader2, X, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FileUploaderProps {
    file: File | null;
    isDragging: boolean;
    uploading: boolean;
    uploadProgress: number;
    pageSize: number;
    isPreloaded: boolean;
    isPreviewOpen: boolean;
    handleDragOver: (e: React.DragEvent) => void;
    handleDragLeave: () => void;
    handleDrop: (e: React.DragEvent) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeFile: () => void;
    setIsPreviewOpen: (open: boolean) => void;
    handleUpload: (page?: number) => void;
    setPageSize: (size: number) => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    isMaximized: boolean;
    isHeadersMaximized: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
    file,
    isDragging,
    uploading,
    uploadProgress,
    pageSize,
    setPageSize,
    isPreloaded,
    isPreviewOpen,
    setIsPreviewOpen,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    removeFile,
    handleUpload,
    fileInputRef,
    isMaximized,
    isHeadersMaximized
}) => {
    if (isMaximized || isHeadersMaximized) return null;

    return (
        <div className="w-full space-y-6 flex-shrink-0 animate-in fade-in duration-500">
            <Card className="border-none shadow-premium bg-white/70 backdrop-blur-xl dark:bg-slate-900/70 overflow-hidden">
                <CardHeader className="border-b border-slate-100 dark:border-slate-800 py-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <CardTitle className="text-base sm:text-lg flex items-center gap-2 sm:gap-3">
                            <div className="p-1 sm:p-1.5 bg-blue-500/10 rounded-lg">
                                <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
                            </div>
                            <span className="text-sm sm:text-base">Choose a CSV or Excel file</span>
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Rows</label>
                                <Select
                                    value={pageSize.toString()}
                                    onValueChange={(v) => setPageSize(parseInt(v))}
                                >
                                    <SelectTrigger className="h-8 w-28 rounded-md bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-[10px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[50, 100, 200, 500].map(size => (
                                            <SelectItem key={size} value={size.toString()}>{size} records</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-stretch">
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`
                                relative group cursor-pointer border-2 border-dashed rounded-2xl p-2 transition-all duration-500
                                flex-1 flex items-center justify-center text-center
                                ${isDragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800/20'}
                                ${file ? 'bg-blue-50/20 dark:bg-blue-900/5 border-primary/30' : ''}
                            `}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                accept=".csv"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />

                            {file ? (
                                <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-4 py-2 gap-3 sm:gap-0">
                                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                        <div className="p-1.5 sm:p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg shrink-0">
                                            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                                        </div>
                                        <div className="flex flex-col text-left min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white truncate max-w-[150px] sm:max-w-[200px]">{file.name}</p>
                                                {isPreloaded && (
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50 shrink-0">
                                                        SAMPLE
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[9px] sm:text-[10px] text-slate-400">{(file.size / 1024).toFixed(1)} KB · Click to replace with your own file</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={(e) => { e.stopPropagation(); setIsPreviewOpen(!isPreviewOpen); }}
                                            className={`relative !z-30 h-8 px-4 rounded-lg pointer-events-auto transition-colors flex items-center gap-2 shadow-sm ${isPreviewOpen ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600'}`}
                                        >
                                            <span className="text-[10px] font-extrabold uppercase tracking-wider">View Data</span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={(e) => { e.stopPropagation(); removeFile(); }}
                                            className="relative z-20 h-8 w-8 rounded-lg bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                                            title="Remove File"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4 py-1">
                                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full group-hover:bg-primary/20 transition-all duration-300">
                                        <Upload className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Drop CSV file here</p>
                                        <p className="text-[10px] text-muted-foreground">Click to browse local files</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex lg:w-72 flex-col justify-center gap-3 w-full sm:w-auto">
                            <Button
                                className={`
                                    w-full h-12 text-sm font-bold rounded-xl shadow-lg transition-all duration-300
                                    relative overflow-hidden group/btn
                                    ${!file || uploading
                                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                        : 'bg-linear-to-r from-blue-600 via-indigo-600 to-primary hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] text-white border-none'}
                                `}
                                disabled={!file || uploading}
                                onClick={() => handleUpload(1)}
                            >
                                <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                                {uploading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Processing...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 group-hover/btn:rotate-12 transition-transform" />
                                        Process Data
                                    </span>
                                )}
                            </Button>

                            {uploadProgress > 0 && (
                                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">Synchronizing</span>
                                        <span className="text-[9px] font-bold text-primary">{uploadProgress}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-linear-to-r from-blue-500 to-indigo-600 transition-all duration-500 rounded-full"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
