"use client";

import type React from "react";
import type { RefObject } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  AlertCircle,
  X,
  Eye,
  Send,
} from "lucide-react";
import type { UploadedFile } from "./types";

interface Props {
  files: UploadedFile[];
  selectedJobPosition: string;
  isDragOver: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (id: string) => void;
  onSubmit: (id: string) => void;
}

export function UploadPanel({
  files,
  selectedJobPosition,
  isDragOver,
  fileInputRef,
  onDrop,
  onDragOver,
  onDragLeave,
  onFileSelect,
  onRemoveFile,
  onSubmit,
}: Props) {
  return (
    <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300 w-full min-h-100">
      <CardHeader className="bg-linear-to-r from-indigo-600 via-purple-600 to-purple-700 shrink-0 py-1.5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
        <div className="relative flex items-center gap-2">
          <div className="p-1 bg-white/20 backdrop-blur-sm rounded-lg">
            <Upload className="w-3 h-3 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-white text-sm font-bold leading-tight">Upload Your CV</CardTitle>
            <CardDescription className="text-purple-100 text-[10px] font-medium">
              Upload your own CV or process with the sample provided below
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 space-y-1 flex-1 bg-linear-to-b from-slate-50 to-white overflow-y-auto">
        <div
          className={`relative border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer ${
            isDragOver
              ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
              : "border-slate-300 hover:border-blue-400 hover:bg-slate-50 hover:shadow-md"
          }`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={onFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="p-3 space-y-1.5 pointer-events-none">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">Step 2: Upload Your CV</h3>
            </div>
            <div className="mx-auto w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div className="text-center">
              <p className="text-slate-700 text-sm font-semibold mb-0.5">Drag & drop here</p>
              <p className="text-slate-600 text-sm mb-1">or click button below</p>
              <p className="text-slate-500 text-sm bg-slate-100 inline-block px-2 py-0.5 rounded-full">
                PDF • Max 5MB
              </p>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={() => fileInputRef.current?.click()}
                size="sm"
                className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 pointer-events-auto font-semibold text-sm h-8"
              >
                <Upload className="w-4 h-4 mr-1.5" />
                Choose File
              </Button>
            </div>
          </div>
        </div>

        {files.length > 0 && (
          <div className="space-y-3 pointer-events-auto">
            {files.map((uploadedFile) => (
              <div
                key={uploadedFile.id}
                className="border-2 border-blue-200 rounded-xl p-3 bg-linear-to-br from-blue-50 via-white to-indigo-50 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 pointer-events-auto relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-400/10 to-indigo-400/10 rounded-full -mr-16 -mt-16"></div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="p-2.5 bg-linear-to-br from-blue-600 to-indigo-700 rounded-xl shrink-0 shadow-lg">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-base text-slate-900 truncate mb-1">
                          {uploadedFile.file.name}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            <span className="text-xs text-slate-600 font-medium">
                              {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                          {uploadedFile.status === "success" && (
                            <Badge className="bg-linear-to-r from-green-500 to-emerald-600 text-white text-[10px] px-2 py-0.5 font-bold shadow-md">
                              ✓ Ready
                            </Badge>
                          )}
                          {uploadedFile.status === "uploading" && (
                            <Badge className="bg-linear-to-r from-blue-500 to-indigo-600 text-white text-[10px] px-2 py-0.5 font-bold animate-pulse shadow-md">
                              ⟳ Processing...
                            </Badge>
                          )}
                          {uploadedFile.status === "ready" && (
                            <Badge className="bg-linear-to-r from-orange-500 to-amber-600 text-white text-[10px] px-2 py-0.5 font-bold shadow-md">
                              ⚡ Ready
                            </Badge>
                          )}
                          {uploadedFile.status === "error" && (
                            <Badge className="bg-linear-to-r from-red-500 to-rose-600 text-white text-[10px] px-2 py-0.5 font-bold shadow-md">
                              ✕ Error
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {uploadedFile.file.type === "application/pdf" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              const fileUrl = URL.createObjectURL(uploadedFile.file);
                              window.open(fileUrl, "_blank");
                            }}
                            className="h-8 w-8 p-0 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all rounded-lg shadow-sm hover:shadow-md"
                            title="Preview PDF"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveFile(uploadedFile.id);
                          }}
                          className="h-8 w-8 p-0 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all rounded-lg shadow-sm hover:shadow-md"
                          title="Remove file"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {uploadedFile.status === "uploading" && (
                      <div className="mt-2 space-y-1 bg-blue-50 rounded-lg p-2 border-2 border-blue-200">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium text-blue-700">Processing CV...</p>
                          <p className="text-xs font-bold text-blue-800">
                            {Math.round(uploadedFile.progress)}%
                          </p>
                        </div>
                        <Progress value={uploadedFile.progress} className="h-1.5 bg-blue-200" />
                      </div>
                    )}

                    {uploadedFile.status === "ready" && selectedJobPosition && (
                      <div className="mt-2 pt-2 border-t border-blue-100">
                        <Button
                          size="sm"
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onSubmit(uploadedFile.id);
                          }}
                          className="w-full h-9 bg-linear-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-300 text-sm font-bold rounded-lg cursor-pointer pointer-events-auto"
                        >
                          <Send className="w-4 h-4 mr-1.5" />
                          <span>Analyze CV</span>
                        </Button>
                      </div>
                    )}

                    {uploadedFile.status === "error" && uploadedFile.error && (
                      <Alert className="mt-3 bg-red-950/50 border-red-800 py-2 px-3">
                        <AlertCircle className="h-3.5 w-3.5 text-red-400" />
                        <AlertDescription className="text-red-300 text-xs">
                          {uploadedFile.error}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
