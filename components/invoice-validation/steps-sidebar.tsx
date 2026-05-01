"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  FileText,
  Check,
  XCircle,
  Eye,
  Target,
  Upload,
  Package,
  MessageSquare,
  Mail,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";
import type { ClaimData } from "./types";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  completed: boolean;
}

interface Props {
  claimData: ClaimData;
  warrantyStatus: "available" | "expired" | null;
  claimStarted: boolean;
}

export function StepsSidebar({ claimData, warrantyStatus, claimStarted }: Props) {
  const steps: Step[] = [
    {
      id: 1,
      title: "Start Claim",
      description: "Initialize process",
      icon: Target,
      completed: claimStarted,
    },
    {
      id: 2,
      title: "Upload Invoice",
      description: "Proof of purchase",
      icon: Upload,
      completed: claimData.invoice !== null,
    },
    {
      id: 3,
      title: "Select Product",
      description: "Choose affected items",
      icon: Package,
      completed: claimData.products.length > 0,
    },
    {
      id: 4,
      title: "Describe Issue",
      description: "Problem details",
      icon: MessageSquare,
      completed: claimData.issueDescription.length > 0,
    },
    {
      id: 5,
      title: "Resolution",
      description: "Email for updates",
      icon: Mail,
      completed:
        ((claimData.resolutionType && claimData.resolutionType !== "Other") ||
          (claimData.resolutionType === "Other" &&
            claimData.resolutionSought.length > 0)) &&
        claimData.notificationEmail.length > 0,
    },
  ];

  return (
    <>
      <Card className="bg-white text-slate-900 border-slate-200 shadow-sm gap-0 p-0">
        <div className="p-2 space-y-1">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md border transition-all duration-200 ${
                  step.completed
                    ? "bg-green-50 border-green-200"
                    : "bg-slate-50 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="shrink-0">
                  {step.completed ? (
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 border-2 border-slate-300 rounded-full bg-white" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-xs font-semibold truncate ${
                      step.completed ? "text-green-700" : "text-slate-700"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-slate-400 truncate leading-tight">{step.description}</p>
                </div>
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 ${
                    step.completed ? "text-green-600" : "text-slate-400"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </Card>

      {claimData.invoice && (
        <Card className="mt-1 overflow-hidden border-blue-100 shadow-sm gap-2 p-2">
          {/* Header band */}
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-600">
            <FileText className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="text-xs font-semibold text-white tracking-wide">Invoice Preview</span>
          </div>

          <div className="p-2 space-y-1.5">
            {/* File row */}
            <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="w-7 h-7 bg-blue-100 rounded-md flex items-center justify-center shrink-0">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">
                  {claimData.invoice.name}
                </p>
                <p className="text-xs text-slate-400">
                  {(claimData.invoice.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={() => {
                  if (claimData.invoice) {
                    window.open(URL.createObjectURL(claimData.invoice), "_blank");
                  }
                }}
                className="w-6 h-6 bg-blue-600 hover:bg-blue-700 rounded-md flex items-center justify-center transition-colors shrink-0"
                title="Preview invoice"
              >
                <Eye className="w-3 h-3 text-white" />
              </button>
            </div>

            {/* Warranty badge */}
            {warrantyStatus && (
              <div
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium ${
                  warrantyStatus === "available"
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                {warrantyStatus === "available" ? (
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>
                  {warrantyStatus === "available"
                    ? "Warranty Active"
                    : "Warranty Expired"}
                </span>
                <span className={`ml-auto text-xs font-normal ${warrantyStatus === "available" ? "text-green-500" : "text-red-400"}`}>
                  {warrantyStatus === "available" ? "Eligible" : "Ineligible"}
                </span>
              </div>
            )}
          </div>
        </Card>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------

interface WarrantyExpiredProps {
  onDecision: (acceptCharges: boolean) => void;
}

export function WarrantyExpiredDialog({ onDecision }: WarrantyExpiredProps) {
  return (
    <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-orange-600 shrink-0" />
        <h3 className="text-sm font-semibold text-orange-700">Warranty Expired</h3>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-orange-800">Your product warranty has expired.</p>
        <p className="text-sm text-orange-700">
          Processing your claim may incur additional charges. Would you like to proceed with the claim process anyway?
        </p>
        <div className="bg-orange-100 border border-orange-200 rounded-lg px-3 py-2">
          <p className="text-xs text-orange-800">
            <strong>Note:</strong> Additional service fees and repair costs may apply for out-of-warranty claims.
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => onDecision(true)} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
          Yes, Proceed with Potential Charges
        </Button>
        <Button onClick={() => onDecision(false)} className="flex-1 bg-slate-900 hover:bg-slate-700 text-white">
          No, Cancel Claim
        </Button>
      </div>
    </div>
  );
}

interface WarrantyAvailableProps {
  onDecision: (proceed: boolean) => void;
}

export function WarrantyAvailableDialog({ onDecision }: WarrantyAvailableProps) {
  return (
    <div className="rounded-xl border border-green-200 bg-green-50 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
        <h3 className="text-sm font-semibold text-green-700">Warranty Active</h3>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-green-800">Great news! Your product warranty is still active.</p>
        <p className="text-sm text-green-700">
          Your warranty covers repairs and replacements at no additional cost. Would you like to proceed with your warranty claim?
        </p>
        <div className="bg-green-100 border border-green-200 rounded-lg px-3 py-2">
          <p className="text-xs text-green-800">
            <strong>Benefits:</strong> Free repairs, replacements, and technical support covered under warranty.
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => onDecision(true)} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
          Yes, Proceed with Warranty Claim
        </Button>
        <Button onClick={() => onDecision(false)} className="flex-1 bg-slate-900 hover:bg-slate-700 text-white">
          No, Cancel Claim
        </Button>
      </div>
    </div>
  );
}

interface InvalidInvoiceProps {
  onDismiss: () => void;
}

export function InvalidInvoiceDialog({ onDismiss }: InvalidInvoiceProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <XCircle className="w-4 h-4 text-red-600 shrink-0" />
        <h3 className="text-sm font-semibold text-red-700">Invalid Invoice</h3>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-red-800">Invoice could not be processed</p>
        <p className="text-sm text-red-700">
          The uploaded invoice appears to be invalid or could not be found in our database. This could be due to:
        </p>
        <ul className="text-sm text-red-700 space-y-0.5 ml-2">
          <li>• Invoice is not from an authorized retailer</li>
          <li>• Invoice format is not readable</li>
          <li>• Missing required information (date, products, etc.)</li>
          <li>• Invoice is corrupted or unclear</li>
        </ul>
        <div className="bg-red-100 border border-red-200 rounded-lg px-3 py-2">
          <p className="text-xs text-red-800">
            <strong>Please:</strong> Check your invoice and try again with a valid invoice or receipt from an authorized retailer.
          </p>
        </div>
      </div>
      <Button onClick={onDismiss} className="w-full bg-slate-900 hover:bg-slate-700 text-white">
        Back to Start
      </Button>
    </div>
  );
}
