"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, AlertCircle } from "lucide-react";
import { AVAILABLE_PRODUCTS, SUPPORT_TYPES } from "./types";

interface Props {
  selectedProducts: string[];
  selectedSupportType: string;
  webhookProducts: string[];
  isSubmitting: boolean;
  onProductToggle: (product: string) => void;
  onSupportTypeChange: (supportType: string) => void;
  onContinue: () => void;
}

export function StepProduct({
  selectedProducts,
  selectedSupportType,
  webhookProducts,
  isSubmitting,
  onProductToggle,
  onSupportTypeChange,
  onContinue,
}: Props) {
  const productsToShow =
    webhookProducts.length > 0 ? webhookProducts : AVAILABLE_PRODUCTS;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <Package className="w-4 h-4 text-blue-600" />
        <h3 className="text-base font-semibold">Select Products & Support</h3>
      </div>
      <div className="space-y-2">
        <div className="space-y-1.5">
          <Label className="text-sm">Select Affected Products *</Label>
          <div className="grid grid-cols-2 gap-1.5 p-2 border rounded-lg max-h-36 overflow-y-auto">
            {productsToShow.map((product) => (
              <div key={product} className="flex items-center space-x-2">
                <Checkbox
                  id={product}
                  checked={selectedProducts.includes(product)}
                  onCheckedChange={() => onProductToggle(product)}
                />
                <Label htmlFor={product} className="text-sm font-normal">
                  {product}
                </Label>
              </div>
            ))}
          </div>
          {selectedProducts.length > 0 && (
            <p className="text-xs text-green-600">
              Selected: {selectedProducts.join(", ")}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm">Type of support needed *</Label>
          <div className="grid grid-cols-1 gap-1 p-2 border rounded-lg">
            {SUPPORT_TYPES.map((supportType) => (
              <div key={supportType} className="flex items-center space-x-2">
                <Checkbox
                  id={supportType}
                  checked={selectedSupportType === supportType}
                  onCheckedChange={(checked) => {
                    if (checked) onSupportTypeChange(supportType);
                  }}
                />
                <Label htmlFor={supportType} className="text-sm font-normal">
                  {supportType}
                </Label>
              </div>
            ))}
          </div>
          {selectedSupportType && (
            <p className="text-xs text-green-600">Selected: {selectedSupportType}</p>
          )}
        </div>
      </div>

      {selectedProducts.length > 0 && selectedSupportType && (
        <Button onClick={onContinue} className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Continue"}
        </Button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

interface StepIssueProps {
  issueType: string;
  issueDescription: string;
  issueOptions: string[];
  isSubmitting: boolean;
  onIssueTypeChange: (value: string) => void;
  onIssueDescriptionChange: (value: string) => void;
  onContinue: () => void;
}

export function StepIssue({
  issueType,
  issueDescription,
  issueOptions,
  isSubmitting,
  onIssueTypeChange,
  onIssueDescriptionChange,
  onContinue,
}: StepIssueProps) {
  const canContinue =
    (issueType && issueType !== "Other") ||
    (issueType === "Other" && issueDescription.length > 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="w-4 h-4 text-blue-600" />
        <h3 className="text-base font-semibold">Describe Issue</h3>
      </div>
      <div className="space-y-2">
        <Label htmlFor="issueType" className="text-sm">
          Select Issue Type *
        </Label>
        <Select value={issueType} onValueChange={onIssueTypeChange}>
          <SelectTrigger className="w-fit max-w-md text-base">
            <SelectValue placeholder="Choose the type of issue..." />
          </SelectTrigger>
          <SelectContent className="z-50 bg-blue-50 border-2 border-blue-400 shadow-2xl">
            {issueOptions.map((option) => (
              <SelectItem key={option} value={option} className="text-base">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {issueType === "Other" && (
        <div className="space-y-2">
          <Label htmlFor="issue" className="text-sm">
            Describe the problem you&apos;re experiencing *
          </Label>
          <Textarea
            id="issue"
            placeholder="Please provide detailed information about the issue..."
            value={issueDescription}
            onChange={(e) => onIssueDescriptionChange(e.target.value)}
            rows={4}
            className="text-base"
          />
        </div>
      )}
      {canContinue && (
        <Button onClick={onContinue} className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Continue"}
        </Button>
      )}
    </div>
  );
}
