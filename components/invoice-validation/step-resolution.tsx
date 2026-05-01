"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, CheckCircle, Loader2 } from "lucide-react";

interface Props {
  selectedResolution: string;
  desiredResolution: string;
  notificationEmail: string;
  resolutionOptions: string[];
  isSubmitting: boolean;
  onResolutionChange: (value: string) => void;
  onDesiredResolutionChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSubmit: () => void;
}

export function StepResolution({
  selectedResolution,
  desiredResolution,
  notificationEmail,
  resolutionOptions,
  isSubmitting,
  onResolutionChange,
  onDesiredResolutionChange,
  onEmailChange,
  onSubmit,
}: Props) {
  const canSubmit =
    selectedResolution &&
    (selectedResolution !== "Other" ||
      (selectedResolution === "Other" && desiredResolution.trim().length > 0)) &&
    notificationEmail.length > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <Mail className="w-4 h-4 text-blue-600" />
        <h3 className="text-base font-semibold">Resolution</h3>
      </div>

      <div className="space-y-2">
        <div className="space-y-1.5">
          <Label>What resolution would you like? *</Label>
          <Select
            value={selectedResolution}
            onValueChange={(value) => {
              onResolutionChange(value);
              if (value !== "Other") onDesiredResolutionChange("");
            }}
          >
            <SelectTrigger className="w-fit max-w-md text-base">
              <SelectValue placeholder="Select desired resolution" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-blue-50 border-2 border-blue-400 shadow-2xl">
              {resolutionOptions.map((resolution) => (
                <SelectItem
                  key={resolution}
                  value={resolution}
                  className="text-base"
                >
                  {resolution}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedResolution === "Other" && (
            <Textarea
              placeholder="Please describe your desired resolution..."
              value={desiredResolution}
              onChange={(e) => onDesiredResolutionChange(e.target.value)}
              className="min-h-16 text-sm p-2"
            />
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="notificationEmail" className="text-xs text-slate-500">
            Email for claim updates *
          </Label>
          <Input
            id="notificationEmail"
            type="email"
            placeholder="Email address for claim status updates"
            value={notificationEmail}
            onChange={(e) => onEmailChange(e.target.value)}
            className="h-8 text-sm"
          />
        </div>

        {canSubmit && (
          <Button onClick={onSubmit} className="w-full">
            {isSubmitting ? "Submitting Claim..." : "Submit Claim"}
          </Button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

interface SubmissionSuccessProps {
  notificationEmail: string;
  redirectCountdown: number;
}

export function SubmissionSuccess({ notificationEmail, redirectCountdown }: SubmissionSuccessProps) {
  return (
    <div className="text-center space-y-4">
      <div className="space-y-3">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h3 className="text-xl font-bold text-green-700">Claim Submitted Successfully!</h3>
        <div className="space-y-1.5">
          <p className="text-slate-600">Your claim has been submitted and is being processed.</p>
          <p className="text-sm text-slate-600">
            You&apos;ll receive updates via email at{" "}
            <span className="font-medium text-blue-600">{notificationEmail}</span>
          </p>
        </div>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center justify-center gap-2 text-blue-700 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="font-medium">Returning to home in {redirectCountdown} seconds...</span>
        </div>
      </div>
    </div>
  );
}
