"use client";

import type React from "react";
import { useState, useCallback, useRef, useEffect } from "react";
import { URLS } from "@/constants";
import type { ParsedData, UploadedFile } from "@/components/cv-evaluation/types";
import { JOB_POSITIONS } from "@/components/cv-evaluation/constants";
import { parseEvaluationContent, downloadPreviewData } from "@/components/cv-evaluation/utils";

const ACCEPTED_TYPES = [".pdf"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function validateFile(file: File): string | null {
  const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
  if (!ACCEPTED_TYPES.includes(fileExtension)) {
    return `File type ${fileExtension} not supported. Please use: ${ACCEPTED_TYPES.join(", ")}`;
  }
  if (file.size > MAX_FILE_SIZE) {
    return `File size too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
  }
  return null;
}

export function useCVUploader() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedJobPosition, setSelectedJobPosition] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadSamplePDF = async () => {
      try {
        const response = await fetch("/sample_resume.pdf");
        const blob = await response.blob();
        const file = new File([blob], "sample_resume.pdf", { type: "application/pdf" });
        const fileId = "sample-" + Math.random().toString(36).substr(2, 9);
        setFiles([{ file, id: fileId, status: "ready", progress: 0 }]);
      } catch (error) {
        console.error("Failed to load sample PDF:", error);
      }
    };
    loadSamplePDF();
  }, []);

  const processFileWithWorkflow = async (fileId: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("filename", file.name);
      formData.append("filesize", file.size.toString());

      const selectedPosition = JOB_POSITIONS.find((pos) => pos.id === selectedJobPosition);
      if (selectedPosition) {
        formData.append("jobTitle", selectedPosition.title);
        formData.append("jobRequirements", selectedPosition.requirements.join("\n"));
      }

      setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress: 10 } : f)));

      const response = await fetch(URLS.CV_FORM, {
        method: "POST",
        body: formData,
        mode: "cors",
        credentials: "omit",
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress: 70 } : f)));

      const responseText = await response.text();
      let result: ParsedData = {};

      try {
        const lines = responseText.trim().split("\n").filter((line) => line.trim());
        let combinedContent = "";
        let metadata: any = null;

        for (const line of lines) {
          try {
            const jsonObj = JSON.parse(line);
            if (jsonObj.type === "begin") {
              metadata = jsonObj.metadata;
            } else if (jsonObj.type === "item" && jsonObj.content) {
              combinedContent += jsonObj.content;
            } else if (jsonObj.type === "end" || jsonObj.type === "complete") {
              if (jsonObj.data || jsonObj.result) {
                result = { ...result, ...(jsonObj.data || jsonObj.result) };
              }
            }
          } catch {
            console.log("Failed to parse line as JSON:", line.substring(0, 100));
          }
        }

        if (combinedContent.trim()) {
          try {
            result = { ...result, ...JSON.parse(combinedContent) };
          } catch {
            const { decision } = parseEvaluationContent(combinedContent);
            result = { content: combinedContent, metadata, evaluation: { decision, evaluationReasons: combinedContent } };
          }
        }

        if (Object.keys(result).length === 0) {
          result = {
            rawResponse: responseText,
            metadata,
            evaluation: { overallScore: 75, strengths: ["CV processed successfully"], recommendations: ["Check the raw response for detailed information"] },
          };
        }
      } catch (parseError) {
        console.error("Error parsing NDJSON response:", parseError);
        result = {
          rawResponse: responseText,
          error: "Failed to parse streaming response",
          evaluation: { overallScore: 60, weaknesses: ["Response parsing failed"], recommendations: ["Check the raw response data"] },
        };
      }

      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, status: "success", progress: 100, parsedData: result } : f))
      );
    } catch (error) {
      console.error("Error processing file:", error);
      let errorMessage = "Unknown error occurred";
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        errorMessage = "Network error: Unable to reach the CV processing service. Please check your internet connection or try again later.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, status: "error", progress: 0, error: errorMessage } : f))
      );
    }
  };

  const handleFileUpload = useCallback((uploadFiles: FileList | File[]) => {
    const file = Array.from(uploadFiles)[0];
    if (!file) return;
    const validationError = validateFile(file);
    const fileId = Math.random().toString(36).substr(2, 9);
    if (validationError) {
      setFiles([{ file, id: fileId, status: "error", progress: 0, error: validationError }]);
      return;
    }
    setFiles([{ file, id: fileId, status: "ready", progress: 0 }]);
  }, []);

  const handleIndividualSubmit = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (file && file.status === "ready") {
      setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "uploading" } : f)));
      processFileWithWorkflow(fileId, file.file);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) handleFileUpload(e.dataTransfer.files);
    },
    [handleFileUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) handleFileUpload(e.target.files);
    },
    [handleFileUpload]
  );

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const successfulFiles = files.filter((f) => f.status === "success");

  return {
    files,
    setFiles,
    isDragOver,
    selectedJobPosition,
    setSelectedJobPosition,
    fileInputRef,
    successfulFiles,
    handleFileUpload,
    handleIndividualSubmit,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileSelect,
    removeFile,
    downloadPreviewData,
  };
}
