"use client";

import React from "react";
import { Zap, Search, CheckCircle2, AlertTriangle } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

// Components
import { FileUploader } from "@/components/community-tool/file-uploader";
import { ClassifiedHeaders } from "@/components/community-tool/classified-headers";
import { ResultsTable } from "@/components/community-tool/results-table";
import { useCommunityTool } from "@/hooks/use-community-tool";

export default function CommunityToolPage() {
    const {
        file,
        isDragging,
        uploading,
        lastResult,
        uploadProgress,
        pageSize,
        setPageSize,
        rows,
        pagination,
        searchTerm,
        setSearchTerm,
        headerSearchTerm,
        setHeaderSearchTerm,
        isMaximized,
        setIsMaximized,
        isHeadersMaximized,
        setIsHeadersMaximized,
        isPreloaded,
        isPreviewOpen,
        setIsPreviewOpen,
        fileInputRef,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleFileChange,
        removeFile,
        handleUpload,
        toggleMaximize,
        toggleHeadersMaximize,
        downloadCSV,
        downloadHeadersCSV,
        filteredHeaders,
        getRowInfo
    } = useCommunityTool();

    return (
      <div className="h-screen bg-[#f8fafc] dark:bg-[#020617] font-sans overflow-hidden flex flex-col">
        <Toaster position="top-right" expand={true} richColors />

        {/* Navigation */}
        <nav className="shrink-0 border-b border-slate-200 bg-white/80 backdrop-blur-md z-100 transition-colors">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex h-14 items-center justify-between">
              <a
                href="/"
                className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer"
              >
                <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 truncate">
                  Rumsan Automations
                </span>
              </a>
            </div>
          </div>
        </nav>

        <main className="flex-1 overflow-auto">
          <div className="w-full max-w-full px-3 sm:px-4 lg:px-10 py-6 sm:py-10 space-y-6 sm:space-y-10 pb-20 mx-auto">
            <header className="flex flex-col gap-0.5 px-1">
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight bg-linear-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-200">
                Community Tool - Data Cleaning Pipeline
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                Process the CSV as per Rahat standards for data mapping through
                header classification, data validation and data deduplication.
              </p>
            </header>

            {!lastResult && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="flex items-start gap-2.5 sm:gap-3 bg-white dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-sm">
                  <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg sm:rounded-xl flex items-center justify-center mt-0.5">
                    <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                      Header Classification
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Smartly identifies and maps your column names to standard
                      schemas.
                    </p>
                    <div className="mt-1.5 text-[8px] sm:text-[9px] text-slate-400 font-mono bg-slate-50 dark:bg-slate-800/60 px-2 py-1 rounded-lg leading-relaxed">
                      community_id · community_name · data_type · phone ·
                      citizenship
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 sm:gap-3 bg-white dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-sm">
                  <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg sm:rounded-xl flex items-center justify-center mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                      Data Validation
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Instantly checks your data for formatting errors,
                      validity, and schema compliance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 sm:gap-3 bg-white dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-sm">
                  <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg sm:rounded-xl flex items-center justify-center mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                      Smart Deduplication
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Detects and highlights duplicate records to ensure the
                      highest data quality.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col space-y-10 items-start">
              <FileUploader
                file={file}
                isDragging={isDragging}
                uploading={uploading}
                uploadProgress={uploadProgress}
                pageSize={pageSize}
                setPageSize={setPageSize}
                isPreloaded={isPreloaded}
                isPreviewOpen={isPreviewOpen}
                setIsPreviewOpen={setIsPreviewOpen}
                handleDragOver={handleDragOver}
                handleDragLeave={handleDragLeave}
                handleDrop={handleDrop}
                handleFileChange={handleFileChange}
                removeFile={removeFile}
                handleUpload={handleUpload}
                fileInputRef={fileInputRef}
                isMaximized={isMaximized}
                isHeadersMaximized={isHeadersMaximized}
              />

              <div className="w-full space-y-8 grow">
                <ClassifiedHeaders
                  classifiedHeaders={lastResult?.classified_headers || []}
                  filteredHeaders={filteredHeaders}
                  isHeadersMaximized={isHeadersMaximized}
                  isMaximized={isMaximized}
                  headerSearchTerm={headerSearchTerm}
                  setHeaderSearchTerm={setHeaderSearchTerm}
                  downloadHeadersCSV={downloadHeadersCSV}
                  toggleHeadersMaximize={toggleHeadersMaximize}
                  setIsHeadersMaximized={setIsHeadersMaximized}
                />

                <ResultsTable
                  lastResult={lastResult}
                  rows={rows}
                  pagination={pagination}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  isMaximized={isMaximized}
                  isHeadersMaximized={isHeadersMaximized}
                  isPreviewOpen={isPreviewOpen}
                  file={file}
                  toggleMaximize={toggleMaximize}
                  setIsMaximized={setIsMaximized}
                  downloadCSV={downloadCSV}
                  getRowInfo={getRowInfo}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
}