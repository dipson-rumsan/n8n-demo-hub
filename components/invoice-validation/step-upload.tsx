"use client";

import type { RefObject, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, FileText, X, Target } from "lucide-react";

// ---------------------------------------------------------------------------

interface StepStartProps {
  isSubmitting: boolean;
  onStart: () => void;
}

export function StepStart({ isSubmitting, onStart }: StepStartProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <Target className="w-4 h-4 text-blue-600" />
        <h3 className="text-base font-semibold">Start Your Claim</h3>
      </div>
      <div className="text-center space-y-3">
        <p className="text-sm text-slate-600">
          Click the button below to initialize your claim process.
        </p>
        <Button onClick={onStart} disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Starting Claim..." : "Start Claim"}
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

interface Props {
  invoice: File | null;
  isSubmitting: boolean;
  showAnyDialog: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onContinue: () => void;
}

export function StepUpload({
  invoice,
  isSubmitting,
  showAnyDialog,
  fileInputRef,
  onFileChange,
  onContinue,
}: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <Upload className="w-4 h-4 text-blue-600" />
        <h3 className="text-base font-semibold">Upload Invoice</h3>
      </div>
      <div className="space-y-2">
        <Label className="text-sm">Upload Invoice/Receipt *</Label>

        {invoice ? (
          <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-md shrink-0">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{invoice.name}</p>
              <p className="text-xs text-slate-500">{(invoice.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
              title="Change file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 transition-all duration-200"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Upload className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-600">Click to upload invoice/receipt</p>
            <p className="text-xs text-slate-400 mt-1">Supported formats: PDF, DOCX</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={onFileChange}
          className="hidden"
        />
      </div>
      {invoice && !showAnyDialog && (
        <Button onClick={onContinue} className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Continue"}
        </Button>
      )}
    </div>
  );
}
