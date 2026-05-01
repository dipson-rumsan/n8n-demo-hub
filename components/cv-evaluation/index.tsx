"use client";

import { CheckCircle, Award, Briefcase, Upload } from "lucide-react";
import { useCVUploader } from "@/hooks/use-cv-uploader";
import { CVResultsView } from "./cv-results-view";
import { JobRequirementsPanel } from "./job-requirements-panel";
import { UploadPanel } from "./upload-panel";

export default function CVUploader() {
  const {
    files,
    setFiles,
    isDragOver,
    selectedJobPosition,
    setSelectedJobPosition,
    fileInputRef,
    successfulFiles,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileSelect,
    removeFile,
    handleIndividualSubmit,
  } = useCVUploader();

  const hasSuccess = files.some((f) => f.status === "success");

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-350 mx-auto px-4 space-y-2">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
            AI-Powered CV Evaluation
          </h1>
          <p className="text-slate-700 text-sm font-medium mb-2">Get professional feedback in 3 steps</p>

          <div className="max-w-2xl mx-auto mb-3">
            <div className="flex items-center justify-between mb-2 relative px-4">
              <div className={`flex flex-col items-center gap-1 ${selectedJobPosition ? "text-blue-600" : "text-slate-400"} z-10 relative`}>
                <div className={`w-7 h-7 rounded-full ${selectedJobPosition ? "bg-blue-600" : "bg-slate-300"} text-white flex items-center justify-center transition-all shadow-sm`}>
                  {selectedJobPosition ? <CheckCircle className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                </div>
                <span className="text-[11px] font-medium text-center">Choose Position</span>
              </div>

              <div className={`flex flex-col items-center gap-1 ${files.length > 0 ? "text-indigo-600" : "text-slate-400"} z-10 relative`}>
                <div className={`w-7 h-7 rounded-full ${files.length > 0 ? "bg-indigo-600" : "bg-slate-300"} text-white flex items-center justify-center transition-all shadow-sm`}>
                  {files.length > 0 ? <CheckCircle className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                </div>
                <span className="text-[11px] font-medium text-center">Upload CV</span>
              </div>

              <div className={`flex flex-col items-center gap-1 ${hasSuccess ? "text-purple-600" : "text-slate-400"} z-10 relative`}>
                <div className={`w-7 h-7 rounded-full ${hasSuccess ? "bg-purple-600" : "bg-slate-300"} text-white flex items-center justify-center transition-all shadow-sm`}>
                  {hasSuccess ? <CheckCircle className="w-4 h-4" /> : <Award className="w-4 h-4" />}
                </div>
                <span className="text-[11px] font-medium text-center">Get Results</span>
              </div>

              {selectedJobPosition && files.length > 0 && (
                <div className="absolute top-3.5 z-0" style={{ left: "45px", right: "45px" }}>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 transition-all duration-500 ease-out rounded-full"
                      style={{ width: `${hasSuccess ? 100 : 50}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {successfulFiles.length > 0 ? (
          <CVResultsView files={successfulFiles} onBack={() => setFiles([])} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-stretch">
            <JobRequirementsPanel
              selectedJobPosition={selectedJobPosition}
              onSelectPosition={setSelectedJobPosition}
            />
            <UploadPanel
              files={files}
              selectedJobPosition={selectedJobPosition}
              isDragOver={isDragOver}
              fileInputRef={fileInputRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onFileSelect={handleFileSelect}
              onRemoveFile={removeFile}
              onSubmit={handleIndividualSubmit}
            />
          </div>
        )}
      </div>
    </div>
  );
}
