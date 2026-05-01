"use client";

import { useState, useRef, type ChangeEvent } from "react";
import {
  type ClaimData,
  type WebhookProductsResponse,
  EMPTY_CLAIM,
  AVAILABLE_PRODUCTS,
  ISSUE_OPTIONS,
  RESOLUTION_OPTIONS,
} from "@/components/invoice-validation/types";

export function useClaimsPortal() {
  const [claimData, setClaimData] = useState<ClaimData>(EMPTY_CLAIM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [currentStep, setCurrentStep] = useState(0);
  const [claimStarted, setClaimStarted] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [executionId, setExecutionId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [webhookProducts, setWebhookProducts] = useState<string[]>([]);
  const [webhookResponse, setWebhookResponse] = useState("");

  const [warrantyStatus, setWarrantyStatus] = useState<"available" | "expired" | null>(null);
  const [showWarrantyExpiredDialog, setShowWarrantyExpiredDialog] = useState(false);
  const [showInvalidInvoiceDialog, setShowInvalidInvoiceDialog] = useState(false);
  const [showWarrantyAvailableDialog, setShowWarrantyAvailableDialog] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [vendor, setVendor] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceId, setInvoiceId] = useState("");

  const canGoBack =
    currentStep > 0 && !isSubmitted && !(showWarrantyExpiredDialog || showWarrantyAvailableDialog || showInvalidInvoiceDialog) && !isSubmitting;

  const currentIssueOptions = claimData.supportType
    ? ISSUE_OPTIONS[claimData.supportType as keyof typeof ISSUE_OPTIONS] ?? []
    : [];

  const currentResolutionOptions = claimData.supportType
    ? RESOLUTION_OPTIONS[claimData.supportType as keyof typeof RESOLUTION_OPTIONS] ?? []
    : [];

  const resetClaimState = () => {
    setCurrentStep(0);
    setClaimStarted(false);
    setClaimData(EMPTY_CLAIM);
    setWarrantyStatus(null);
    setWebhookProducts([]);
    setWebhookResponse("");
    setResumeUrl(null);
    setExecutionId(null);
    setCustomerName("");
    setVendor("");
    setInvoiceNumber("");
    setInvoiceId("");
  };

  const handleStartClaim = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("action", "start_claim");
      formData.append("timestamp", new Date().toISOString());
      const response = await fetch("/api/webhook-proxy", { method: "POST", body: formData });
      if (response.ok) {
        const responseText = await response.text();
        if (responseText.trim()) {
          try {
            const data = JSON.parse(responseText);
            if (data?.resumeUrl) setResumeUrl(data.resumeUrl);
            if (data?.executionId) setExecutionId(data.executionId);
          } catch { /* Not JSON */ }
        }
        setClaimStarted(true);
        setCurrentStep(1);
      }
    } catch { /* Silent */ } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setClaimData((prev) => ({ ...prev, invoice: file }));
  };

  const handleProductToggle = (product: string) => {
    setClaimData((prev) => ({
      ...prev,
      products: prev.products.includes(product)
        ? prev.products.filter((p) => p !== product)
        : [...prev.products, product],
    }));
  };

  const handleIssueTypeChange = (type: string) => {
    setClaimData((prev) => ({
      ...prev,
      issueType: type,
      issueDescription: type !== "Other" ? type : prev.issueDescription,
    }));
  };

  const handleContinueToProducts = async () => {
    if (!claimData.invoice || !resumeUrl) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("targetUrl", resumeUrl);
      formData.append("action", "invoice_uploaded");
      formData.append("invoice", claimData.invoice);
      formData.append("step", "upload_complete");
      formData.append("timestamp", new Date().toISOString());
      if (executionId) formData.append("executionId", executionId);

      const response = await fetch("/api/webhook-proxy", { method: "POST", body: formData });
      if (response.ok) {
        const responseText = await response.text();
        if (responseText.trim()) {
          try {
            const data: WebhookProductsResponse = JSON.parse(responseText);
            if (data?.customerName) setCustomerName(data.customerName);
            if (data?.vendor) setVendor(data.vendor);
            if (data?.invoiceNumber) setInvoiceNumber(data.invoiceNumber);
            if (data?.invoiceId) setInvoiceId(data.invoiceId);
            if (data?.products) {
              let names: string[] = [];
              if (Array.isArray(data.products)) {
                names = data.products
                  .map((p: any) =>
                    typeof p === "string"
                      ? p
                      : p?.product_name || p?.name || p?.productName || p?.title || p?.item || p?.description || JSON.stringify(p)
                  )
                  .filter((n) => n && n !== "[object Object]");
              } else if (typeof data.products === "string") {
                names = data.products.split(",").map((p) => p.trim()).filter(Boolean);
              }
              setWebhookProducts(names.length > 0 ? names : AVAILABLE_PRODUCTS);
            } else {
              setWebhookProducts(AVAILABLE_PRODUCTS);
            }
            if (data?.warrantyStatus) {
              const raw = data.warrantyStatus.toLowerCase();
              if (raw.includes("invalid") || raw.includes("not found")) {
                setShowInvalidInvoiceDialog(true);
                return;
              } else if (raw === "expired" || raw === "unknown") {
                setWarrantyStatus("expired");
                setShowWarrantyExpiredDialog(true);
                return;
              } else if (raw.includes("available")) {
                setWarrantyStatus("available");
                setShowWarrantyAvailableDialog(true);
                return;
              } else {
                setWarrantyStatus("available");
              }
            } else {
              setWarrantyStatus("available");
            }
            if (data?.resumeUrl) setResumeUrl(data.resumeUrl);
            if (data?.executionId) setExecutionId(data.executionId);
          } catch {
            setWebhookProducts(AVAILABLE_PRODUCTS);
            setWarrantyStatus("available");
          }
        } else {
          setWebhookProducts(AVAILABLE_PRODUCTS);
          setWarrantyStatus("available");
        }
        setCurrentStep(2);
      }
    } catch { /* Silent */ } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueToIssue = () => {
    if (claimData.products.length > 0 && claimData.supportType) setCurrentStep(3);
  };

  const handleContinueToResolution = async () => {
    const canContinue =
      (claimData.issueType && claimData.issueType !== "Other") ||
      (claimData.issueType === "Other" && claimData.issueDescription.length > 0);
    if (!canContinue || !resumeUrl) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("targetUrl", resumeUrl);
      formData.append("action", "issue_described");
      formData.append("issueDescription", claimData.issueDescription);
      formData.append("selectedProducts", JSON.stringify(claimData.products));
      formData.append("supportType", claimData.supportType);
      formData.append("step", "issue_complete");
      formData.append("timestamp", new Date().toISOString());
      if (executionId) formData.append("executionId", executionId);

      const response = await fetch("/api/webhook-proxy", { method: "POST", body: formData });
      if (response.ok) {
        const responseText = await response.text();
        if (responseText.trim()) {
          try {
            const data = JSON.parse(responseText);
            if (data?.plainText) setWebhookResponse(data.plainText);
            else if (data?.output) setWebhookResponse(data.output);
            else if (data?.message && data.message !== "Workflow was started") setWebhookResponse(data.message);
            else setWebhookResponse(JSON.stringify(data, null, 2));
            if (data?.resumeUrl) setResumeUrl(data.resumeUrl);
            if (data?.executionId) setExecutionId(data.executionId);
          } catch {
            setWebhookResponse(responseText);
          }
        } else {
          setWebhookResponse("Analysis completed successfully.");
        }
        setCurrentStep(4);
      }
    } catch { /* Silent */ } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitClaim = async () => {
    setIsSubmitting(true);
    try {
      const issueText = claimData.issueDescription;
      const resolutionText =
        claimData.selectedResolution === "Other" ? claimData.desiredResolution : claimData.selectedResolution;

      const formData = new FormData();
      formData.append("category", claimData.supportType);
      formData.append("title", `${claimData.supportType}: ${issueText}`);
      formData.append("priority", claimData.supportType === "Warranty Claim" ? "High" : "Medium");
      formData.append(
        "description",
        [`Issue: ${issueText}`, `Resolution Requested: ${resolutionText}`, `Customer: ${customerName || "N/A"}`,
          `Invoice Number: ${invoiceNumber || "N/A"}`, `Warranty Status: ${warrantyStatus || "N/A"}`,
          `Products: ${webhookProducts.join(", ")}`, `Email: ${claimData.notificationEmail}`,
          webhookResponse ? `\nAnalysis:\n${webhookResponse}` : ""].filter(Boolean).join("\n")
      );
      formData.append("action", "claim_submitted");
      formData.append("products", JSON.stringify(webhookProducts));
      formData.append("issueDescription", issueText);
      formData.append("resolutionSought", resolutionText);
      formData.append("responseDetails", claimData.responseDetails);
      formData.append("notificationEmail", claimData.notificationEmail);
      formData.append("supportType", claimData.supportType);
      formData.append("webhookResponse", webhookResponse);
      formData.append("analysisResult", webhookResponse);
      if (customerName) formData.append("customerName", customerName);
      if (vendor) formData.append("vendor", vendor);
      if (invoiceNumber) formData.append("invoiceNumber", invoiceNumber);
      if (invoiceId) formData.append("invoiceId", invoiceId);
      if (warrantyStatus) formData.append("warrantyStatus", warrantyStatus);
      if (executionId) formData.append("executionId", executionId);
      if (claimData.invoice) formData.append("invoice", claimData.invoice);

      const response = await fetch("/api/submit-ticket", { method: "POST", body: formData });
      if (response.ok) {
        try {
          if (resumeUrl) {
            const emailData = new FormData();
            emailData.append("targetUrl", resumeUrl);
            emailData.append("action", "send_email");
            emailData.append("notificationEmail", claimData.notificationEmail);
            emailData.append("products", JSON.stringify(webhookProducts));
            emailData.append("issueDescription", issueText);
            emailData.append("resolutionSought", resolutionText);
            emailData.append("supportType", claimData.supportType);
            emailData.append("webhookResponse", webhookResponse);
            emailData.append("analysisResult", webhookResponse);
            emailData.append("step", "email_notification");
            emailData.append("timestamp", new Date().toISOString());
            if (customerName) emailData.append("customerName", customerName);
            if (vendor) emailData.append("vendor", vendor);
            if (invoiceNumber) emailData.append("invoiceNumber", invoiceNumber);
            if (invoiceId) emailData.append("invoiceId", invoiceId);
            if (warrantyStatus) emailData.append("warrantyStatus", warrantyStatus);
            if (executionId) emailData.append("executionId", executionId);
            if (claimData.invoice) emailData.append("invoice", claimData.invoice);
            await fetch("/api/webhook-proxy", { method: "POST", body: emailData });
          }
        } catch { /* Don't fail on email error */ }

        setIsSubmitted(true);
        const countdownInterval = setInterval(() => {
          setRedirectCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              resetClaimState();
              setIsSubmitted(false);
              setRedirectCountdown(5);
              return 5;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch { /* Silent */ } finally {
      setIsSubmitting(false);
    }
  };

  const handleWarrantyAvailableDecision = (proceed: boolean) => {
    setShowWarrantyAvailableDialog(false);
    if (proceed) setCurrentStep(2);
    else resetClaimState();
  };

  const handleWarrantyExpiredDecision = (acceptCharges: boolean) => {
    setShowWarrantyExpiredDialog(false);
    if (acceptCharges) setCurrentStep(2);
    else resetClaimState();
  };

  const handleInvalidInvoiceDismiss = () => {
    setShowInvalidInvoiceDialog(false);
    resetClaimState();
  };

  return {
    claimData,
    setClaimData,
    isSubmitting,
    isSubmitted,
    redirectCountdown,
    currentStep,
    setCurrentStep,
    claimStarted,
    warrantyStatus,
    showWarrantyExpiredDialog,
    showWarrantyAvailableDialog,
    showInvalidInvoiceDialog,
    webhookProducts,
    fileInputRef,
    canGoBack,
    currentIssueOptions,
    currentResolutionOptions,
    handleStartClaim,
    handleFileUpload,
    handleProductToggle,
    handleIssueTypeChange,
    handleContinueToProducts,
    handleContinueToIssue,
    handleContinueToResolution,
    handleSubmitClaim,
    handleWarrantyAvailableDecision,
    handleWarrantyExpiredDecision,
    handleInvalidInvoiceDismiss,
  };
}
