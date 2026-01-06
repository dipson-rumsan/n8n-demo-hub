"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CheckCircle,
  Upload,
  FileText,
  Package,
  MessageSquare,
  Target,
  Check,
  Mail,
  Loader2,
  AlertCircle,
  XCircle,
  Eye,
  Building,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClaimData {
  invoice: File | null;
  products: string[];
  issueDescription: string;
  issueType: string; // Added issue type for dropdown selection
  resolutionType: string;
  resolutionSought: string;
  responseDetails: string;
  notificationEmail: string;
  supportType: string;
  selectedIssue: string; // Added for the new issue selection
  selectedResolution: string; // Added for the new resolution selection
  desiredResolution: string; // Added for custom resolution input
}

interface AnalysisData {
  status: string;
  confidence: number;
  extractedData?: {
    amount?: string;
    date?: string;
    vendor?: string;
    items?: string[];
  };
  recommendations?: string[];
  issues?: string[];
}

interface WebhookProductsResponse {
  products?: any[] | string; // Allow products to be an array or a string
  warrantyStatus?: "available" | "expired" | "unknown" | string; // Added warranty status to response interface, allowing for string for flexibility
  customerName?: string; // Added customer name
  vendor?: string; // Added vendor
  invoiceNumber?: string; // Added invoice number
  invoiceId?: string; // Added invoice ID
  [key: string]: any;
}

const AVAILABLE_PRODUCTS = [
  "MacBook Pro",
  "iPhone 15",
  "iPad Air",
  "Apple Watch",
  "AirPods Pro",
  "iMac",
  "Mac Mini",
  "Apple TV",
  "HomePod",
  "Magic Keyboard",
];

const SUPPORT_TYPES = [
  "General Questions",
  "Troubleshooting",
  "Warranty Claim",
];

const ISSUE_OPTIONS = {
  "General Questions": [
    "Product information inquiry",
    "How to use product features",
    "Compatibility questions",
    "Warranty information",
    "Return policy inquiry",
    "Shipping and delivery questions",
    "Other",
  ],
  Troubleshooting: [
    "Device not turning on",
    "Screen is cracked or damaged",
    "Battery draining quickly",
    "Software/firmware issues",
    "Connectivity problems (Wi-Fi/Bluetooth)",
    "Audio or speaker issues",
    "Camera not working properly",
    "Overheating issues",
    "Charging problems",
    "Performance or lag issues",
    "Other",
  ],
  "Warranty Claim": [
    "Manufacturing defect",
    "Product stopped working within warranty period",
    "Physical damage covered by warranty",
    "Missing parts or accessories",
    "Product performance not as advertised",
    "Quality issues",
    "Other",
  ],
};

const RESOLUTION_OPTIONS = {
  "General Questions": [
    "Product information/documentation",
    "Usage guidance",
    "Technical support call",
    "Email support",
    "Other",
  ],
  Troubleshooting: [
    "Technical support",
    "Software update/fix",
    "Remote assistance",
    "Repair service",
    "Product replacement",
    "Diagnostic service",
    "Other",
  ],
  "Warranty Claim": [
    "Full refund",
    "Product replacement",
    "Repair service",
    "Partial refund",
    "Store credit",
    "Exchange for different product",
    "Other",
  ],
};

export function ClaimsPortal() {
  const [claimData, setClaimData] = useState<ClaimData>({
    invoice: null,
    products: [],
    issueDescription: "",
    issueType: "", // Initialize issue type
    resolutionType: "", // Initialize resolution type
    resolutionSought: "",
    responseDetails: "",
    notificationEmail: "",
    supportType: "",
    selectedIssue: "", // Initialize selected issue
    selectedResolution: "", // Initialize selected resolution
    desiredResolution: "", // Initialize desired resolution
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [currentStep, setCurrentStep] = useState(0); // 0 = start claim, 1 = upload, 2 = product, 3 = issue, 4 = resolution
  const [claimStarted, setClaimStarted] = useState(false);
  const [invoicePreview, setInvoicePreview] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [executionId, setExecutionId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [webhookProducts, setWebhookProducts] = useState<string[]>([]); // Added state for webhook products
  const [webhookResponse, setWebhookResponse] = useState<string>(""); // Added state to store webhook response from describe issue step

  const [warrantyStatus, setWarrantyStatus] = useState<
    "available" | "expired" | null
  >(null);
  const [showWarrantyExpiredDialog, setShowWarrantyExpiredDialog] =
    useState(false);
  const [showInvalidInvoiceDialog, setShowInvalidInvoiceDialog] =
    useState(false);
  const [showWarrantyAvailableDialog, setShowWarrantyAvailableDialog] =
    useState(false);
  const [userAcceptsCharges, setUserAcceptsCharges] = useState<boolean | null>(
    null
  );

  const [customerName, setCustomerName] = useState<string>("");
  const [vendor, setVendor] = useState<string>("");
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [invoiceId, setInvoiceId] = useState<string>("");

  const steps = [
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

  const handleGoBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      toast({
        title: "Navigated back",
        description: "Returned to previous step",
      });
    }
  };

  const handleGoNext = () => {
    if (currentStep < 4) {
      // Validate current step before proceeding
      if (currentStep === 0 && !claimStarted) {
        toast({
          title: "Please start claim first",
          description: "Click 'Start Claim' to begin the process",
          variant: "destructive",
        });
        return;
      }
      if (currentStep === 1 && !claimData.invoice) {
        toast({
          title: "Please upload invoice",
          description: "Upload your invoice to continue",
          variant: "destructive",
        });
        return;
      }
      if (
        currentStep === 2 &&
        (claimData.products.length === 0 || !claimData.supportType)
      ) {
        toast({
          title: "Please select products and support type",
          description: "Select affected products and support type to continue",
          variant: "destructive",
        });
        return;
      }
      if (currentStep === 3 && claimData.issueDescription.length === 0) {
        toast({
          title: "Please describe the issue",
          description: "Provide a description of the problem to continue",
          variant: "destructive",
        });
        return;
      }

      setCurrentStep(currentStep + 1);
      toast({
        title: "Navigated forward",
        description: "Moved to next step",
      });
    }
  };

  const canGoBack =
    currentStep > 0 &&
    !isSubmitted &&
    !showWarrantyExpiredDialog &&
    !showInvalidInvoiceDialog &&
    !showWarrantyAvailableDialog &&
    !isSubmitting;
  const canGoNext = false; // Disabled next button completely

  const handleStartClaim = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("action", "start_claim");
      formData.append("timestamp", new Date().toISOString());

      const response = await fetch("/api/webhook-proxy", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        let responseData = null;
        const responseText = await response.text();

        if (responseText.trim()) {
          try {
            responseData = JSON.parse(responseText);

            if (responseData?.resumeUrl) {
              setResumeUrl(responseData.resumeUrl);
            }

            // Store execution ID for tracking
            if (responseData?.executionId) {
              setExecutionId(responseData.executionId);
            }
          } catch (parseError) {
            // Response is not JSON, treating as success
          }
        }


        setClaimStarted(true);
        setCurrentStep(1); // Move to upload invoice step

        toast({
          title: "Claim started",
          description:
            "Your claim has been initiated. Please proceed with uploading your invoice.",
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        toast({
          title: "Network Error",
          description:
            "Unable to connect to the server. Please check your internet connection and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Failed to start claim",
          description:
            "There was an error starting your claim. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setClaimData((prev) => ({ ...prev, invoice: file }));

      // Create object URL for preview (works better for PDFs and images)
      const objectUrl = URL.createObjectURL(file);
      setInvoicePreview(objectUrl);

      // Skip the separate analysis call since it's also failing
      // Analysis can be done in the main workflow instead
      toast({
        title: "Invoice uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    }
  };

  const handleProductToggle = (product: string) => {
    setClaimData((prev) => ({
      ...prev,
      products: prev.products.includes(product)
        ? prev.products.filter((p) => p !== product)
        : [...prev.products, product],
    }));
  };

  const handleIssueChange = (issue: string) => {
    setClaimData((prev) => ({ ...prev, issueDescription: issue }));
  };

  const handleIssueTypeChange = (type: string) => {
    setClaimData((prev) => ({
      ...prev,
      issueType: type,
      // Clear description if switching from "other" to predefined option
      issueDescription: type !== "other" ? type : prev.issueDescription, // Use the selected type as description for non-other options
    }));
  };

  const handleSubmitClaim = async () => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Map support type to category
      formData.append("category", claimData.supportType);

      const issueText = claimData.issueDescription;
      const title = `${claimData.supportType}: ${issueText}`;
      formData.append("title", title);

      // Set priority based on support type
      const priority =
        claimData.supportType === "Warranty Claim" ? "High" : "Medium";
      formData.append("priority", priority);

      const resolutionText =
        claimData.selectedResolution === "other"
          ? claimData.desiredResolution
          : claimData.selectedResolution;

      const description = `
Issue: ${issueText}
Resolution Requested: ${resolutionText}
Customer: ${customerName || "N/A"}
Invoice Number: ${invoiceNumber || "N/A"}
Warranty Status: ${warrantyStatus || "N/A"}
Products: ${webhookProducts.join(", ")}
Email: ${claimData.notificationEmail}

${webhookResponse ? `Analysis:\n${webhookResponse}` : ""}
      `.trim();
      formData.append("description", description);

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

      if (executionId) {
        formData.append("executionId", executionId);
      }

      if (claimData.invoice) {
        formData.append("invoice", claimData.invoice);
      }

      const response = await fetch("/api/submit-ticket", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        try {
          if (!resumeUrl) {
            throw new Error("Resume URL not available for email sending");
          }

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
          if (warrantyStatus)
            emailData.append("warrantyStatus", warrantyStatus);

          if (executionId) {
            emailData.append("executionId", executionId);
          }

          if (claimData.invoice) {
            emailData.append("invoice", claimData.invoice);
          }

          const emailResponse = await fetch("/api/webhook-proxy", {
            method: "POST",
            body: emailData,
          });

          if (emailResponse.ok) {
            const emailResponseText = await emailResponse.text();
          }
        } catch (emailError) {
          // Don't fail the entire submission if email fails
        }

        setIsSubmitted(true);
        setShowSuccessMessage(true);

        // Start countdown timer
        const countdownInterval = setInterval(() => {
          setRedirectCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              // Reset to home state
              setCurrentStep(0);
              setClaimStarted(false);
              setIsSubmitted(false);
              setShowSuccessMessage(false);
              setClaimData({
                invoice: null,
                products: [],
                issueDescription: "",
                issueType: "", // Reset issue type
                resolutionType: "", // Reset resolution type
                resolutionSought: "",
                responseDetails: "",
                notificationEmail: "",
                supportType: "",
                selectedIssue: "",
                selectedResolution: "",
                desiredResolution: "",
              });
              setWebhookResponse("");
              setWebhookProducts([]);
              setResumeUrl(null);
              setExecutionId(null);
              setInvoicePreview(null);
              setRedirectCountdown(5);
              setWarrantyStatus(null); // Reset warranty status
              setUserAcceptsCharges(null); // Reset user accepts charges
              setCustomerName("");
              setVendor("");
              setInvoiceNumber("");
              setInvoiceId("");
              return 5;
            }
            return prev - 1;
          });
        }, 1000);

        toast({
          title: "Claim submitted successfully",
          description:
            "Your claim has been sent for review. You'll receive updates via email.",
        });
      } else {
        throw new Error("Failed to submit claim");
      }
    } catch (error) {
      toast({
        title: "Submission failed",
        description:
          "There was an error submitting your claim. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = () => {
    return (
      claimStarted &&
      claimData.invoice !== null &&
      claimData.products.length > 0 &&
      claimData.supportType.length > 0 &&
      claimData.issueDescription.length > 0 &&
      claimData.resolutionSought.length > 0 &&
      claimData.notificationEmail.length > 0
    );
  };

  const handleContinueToProducts = async () => {
    if (claimData.invoice) {
      setIsSubmitting(true);
      let currentWarrantyStatus: "available" | "expired" = "available";

      try {
        if (!resumeUrl) {
          toast({
            title: "Workflow Error",
            description:
              "Resume URL not available. Please restart the claim process.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }

        const formData = new FormData();
        formData.append("targetUrl", resumeUrl);
        formData.append("action", "invoice_uploaded");
        formData.append("invoice", claimData.invoice);
        formData.append("step", "upload_complete");
        formData.append("timestamp", new Date().toISOString());

        if (executionId) {
          formData.append("executionId", executionId);
        }

        const response = await fetch("/api/webhook-proxy", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          try {
            const responseText = await response.text();

            if (responseText.trim()) {
              const responseData: WebhookProductsResponse =
                JSON.parse(responseText);

              if (responseData?.customerName) {
                setCustomerName(responseData.customerName);
              }
              if (responseData?.vendor) {
                setVendor(responseData.vendor);
              }
              if (responseData?.invoiceNumber) {
                setInvoiceNumber(responseData.invoiceNumber);
              }
              if (responseData?.invoiceId) {
                setInvoiceId(responseData.invoiceId);
              }

              if (responseData?.products) {
                let productNames: string[] = [];

                if (Array.isArray(responseData.products)) {
                  // Handle array format
                  productNames = responseData.products
                    .map((product: any) => {
                      if (typeof product === "string") {
                        return product;
                      } else if (
                        typeof product === "object" &&
                        product !== null
                      ) {
                        return (
                          product.product_name ||
                          product.name ||
                          product.productName ||
                          product.title ||
                          product.item ||
                          product.description ||
                          JSON.stringify(product)
                        );
                      } else {
                        return String(product);
                      }
                    })
                    .filter((name) => name && name !== "[object Object]");
                } else if (typeof responseData.products === "string") {
                  // Handle string format - split by comma and clean up
                  productNames = responseData.products
                    .split(",")
                    .map((product) => product.trim())
                    .filter((product) => product.length > 0);
                }

                if (productNames.length > 0) {
                  setWebhookProducts(productNames);
                } else {
                  setWebhookProducts(AVAILABLE_PRODUCTS);
                }
              } else {
                setWebhookProducts(AVAILABLE_PRODUCTS);
              }

              if (responseData?.warrantyStatus) {
                const rawWarrantyStatus =
                  responseData.warrantyStatus.toLowerCase();

                // Check for invalid invoice or not found cases
                if (
                  rawWarrantyStatus.includes("invalid") ||
                  rawWarrantyStatus.includes("not found")
                ) {
                  setShowInvalidInvoiceDialog(true);
                  setIsSubmitting(false);
                  return;
                } else if (
                  rawWarrantyStatus === "expired" ||
                  rawWarrantyStatus === "unknown"
                ) {
                  currentWarrantyStatus = "expired";
                  setWarrantyStatus("expired");
                  setShowWarrantyExpiredDialog(true);
                  setIsSubmitting(false);
                  return;
                } else if (rawWarrantyStatus.includes("available")) {
                  currentWarrantyStatus = "available";
                  setWarrantyStatus("available");
                  setShowWarrantyAvailableDialog(true);
                  setIsSubmitting(false);
                  return;
                } else {
                  currentWarrantyStatus = "available";
                  setWarrantyStatus("available");
                }
              } else {
                // Default to available if no warranty status provided
                setWarrantyStatus("available");
              }

              if (responseData?.resumeUrl) {
                setResumeUrl(responseData.resumeUrl);
              }

              if (responseData?.executionId) {
                setExecutionId(responseData.executionId);
              }
            } else {
              setWebhookProducts(AVAILABLE_PRODUCTS);
              setWarrantyStatus("available"); // Default to available for empty responses
            }
          } catch (parseError) {
            setWebhookProducts(AVAILABLE_PRODUCTS);
            setWarrantyStatus("available"); // Default to available on parse error
          }

          if (
            currentWarrantyStatus === "available" &&
            !showWarrantyAvailableDialog
          ) {
            setCurrentStep(2);
            toast({
              title: "Invoice uploaded successfully",
              description: "Please select the affected products.",
            });
          }
        } else {
          toast({
            title: "Upload failed",
            description: "Failed to upload invoice. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error uploading invoice:", error);
        toast({
          title: "Upload failed",
          description: "Failed to upload invoice. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleWarrantyAvailableDecision = (proceed: boolean) => {
    setShowWarrantyAvailableDialog(false);

    if (proceed) {
      setCurrentStep(2);
      toast({
        title: "Warranty confirmed",
        description:
          "Your warranty is active. Please select the affected products.",
      });
    } else {
      // Reset to initial state
      setCurrentStep(0);
      setClaimStarted(false);
      setClaimData({
        invoice: null,
        products: [],
        issueDescription: "",
        issueType: "", // Reset issue type
        resolutionType: "", // Reset resolution type
        resolutionSought: "",
        responseDetails: "",
        notificationEmail: "",
        supportType: "",
        selectedIssue: "",
        selectedResolution: "",
        desiredResolution: "",
      });
      setWarrantyStatus(null);
      setUserAcceptsCharges(null);
      setWebhookProducts([]);
      setWebhookResponse("");
      setResumeUrl(null);
      setExecutionId(null);
      setInvoicePreview(null);
      setCustomerName("");
      setVendor("");
      setInvoiceNumber("");
      setInvoiceId("");

      toast({
        title: "Thank you for visiting",
        description:
          "Feel free to contact us if you have any questions about your warranty.",
      });
    }
  };

  const handleWarrantyExpiredDecision = (acceptCharges: boolean) => {
    setUserAcceptsCharges(acceptCharges);
    setShowWarrantyExpiredDialog(false);

    if (acceptCharges) {
      setCurrentStep(2);
      toast({
        title: "Proceeding with expired warranty",
        description:
          "Additional charges may apply. Please select the affected products.",
      });
    } else {
      // Reset to initial state and show thank you message
      setCurrentStep(0);
      setClaimStarted(false);
      setClaimData({
        invoice: null,
        products: [],
        issueDescription: "",
        issueType: "", // Reset issue type
        resolutionType: "", // Reset resolution type
        resolutionSought: "",
        responseDetails: "",
        notificationEmail: "",
        supportType: "",
        selectedIssue: "",
        selectedResolution: "",
        desiredResolution: "",
      });
      setWarrantyStatus(null);
      setUserAcceptsCharges(null);
      setWebhookProducts([]);
      setWebhookResponse("");
      setResumeUrl(null);
      setExecutionId(null);
      setInvoicePreview(null);
      setCustomerName("");
      setVendor("");
      setInvoiceNumber("");
      setInvoiceId("");

      toast({
        title: "Thank you for visiting",
        description:
          "We understand you don't wish to proceed with expired warranty charges. Feel free to contact us if you have any questions.",
      });
    }
  };

  const handleInvalidInvoiceDecision = () => {
    setShowInvalidInvoiceDialog(false);

    // Reset to initial state
    setCurrentStep(0);
    setClaimStarted(false);
    setClaimData({
      invoice: null,
      products: [],
      issueDescription: "",
      issueType: "", // Reset issue type
      resolutionType: "", // Reset resolution type
      resolutionSought: "",
      responseDetails: "",
      notificationEmail: "",
      supportType: "",
      selectedIssue: "",
      selectedResolution: "",
      desiredResolution: "",
    });
    setWarrantyStatus(null);
    setUserAcceptsCharges(null);
    setWebhookProducts([]);
    setWebhookResponse("");
    setResumeUrl(null);
    setExecutionId(null);
    setInvoicePreview(null);
    setCustomerName("");
    setVendor("");
    setInvoiceNumber("");
    setInvoiceId("");

    toast({
      title: "Invoice Invalid",
      description:
        "Please check your invoice and try again with a valid invoice or receipt.",
      variant: "destructive",
    });
  };

  const handleContinueToIssue = async () => {
    if (claimData.products.length > 0 && claimData.supportType) {
      setCurrentStep(3);
      toast({
        title: "Proceeding to issue description",
        description: "Please describe the problem you're experiencing.",
      });
    }
  };

  const handleContinueToResolution = async () => {
    // Updated validation to check both issueType and description for "other"
    if (
      (claimData.issueType && claimData.issueType !== "other") ||
      (claimData.issueType === "other" && claimData.issueDescription.length > 0)
    ) {
      setIsSubmitting(true);
      try {
        if (!resumeUrl) {
          toast({
            title: "Workflow Error",
            description:
              "Resume URL not available. Please restart the claim process.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }

        const formData = new FormData();
        formData.append("targetUrl", resumeUrl);
        formData.append("action", "issue_described");
        formData.append("issueDescription", claimData.issueDescription);
        formData.append("selectedProducts", JSON.stringify(claimData.products));
        formData.append("supportType", claimData.supportType);
        formData.append("step", "issue_complete");
        formData.append("timestamp", new Date().toISOString());

        if (executionId) {
          formData.append("executionId", executionId);
        }

        const response = await fetch("/api/webhook-proxy", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const responseText = await response.text();

          if (responseText.trim()) {
            try {
              const responseData = JSON.parse(responseText);

              if (responseData?.plainText) {
                // Handle the actual response format with plainText field
                setWebhookResponse(responseData.plainText);
              } else if (responseData?.output) {
                // Fallback for output field format
                setWebhookResponse(responseData.output);
              } else if (
                responseData?.message &&
                responseData.message !== "Workflow was started"
              ) {
                // Handle message field if it's not the "started" message
                setWebhookResponse(responseData.message);
              } else {
                // Use raw response as fallback
                setWebhookResponse(JSON.stringify(responseData, null, 2));
              }

              // Update resumeUrl if provided
              if (responseData?.resumeUrl) {
                setResumeUrl(responseData.resumeUrl);
              }
              if (responseData?.executionId) {
                setExecutionId(responseData.executionId);
              }
            } catch (parseError) {
              setWebhookResponse(responseText);
            }
          } else {
            setWebhookResponse("Analysis completed successfully.");
          }

          setCurrentStep(4);
          toast({
            title: "Proceeding to resolution",
            description: "Please provide your desired resolution and email.",
          });
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to proceed. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Dynamically populate issue and resolution options based on selected support type
  const currentIssueOptions = claimData.supportType
    ? ISSUE_OPTIONS[claimData.supportType as keyof typeof ISSUE_OPTIONS]
    : [];
  const currentResolutionOptions = claimData.supportType
    ? RESOLUTION_OPTIONS[
        claimData.supportType as keyof typeof RESOLUTION_OPTIONS
      ]
    : [];

  return (
    // Three column layout: sidebar, main form, and results section
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
      <div className="lg:col-span-1">
        <Card className="bg-white text-slate-900 border-slate-200 shadow-sm">
          <CardContent className="space-y-1 pt-2 pb-2">
            {steps.map((step) => {
              const Icon = step.icon;
              const isCompleted = step.completed;

              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-1.5 p-1.5 rounded-md border transition-all duration-200 ${
                    isCompleted 
                      ? "bg-green-50 border-green-200" 
                      : "bg-slate-50 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="shrink-0">
                    {isCompleted ? (
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 border-2 border-slate-300 rounded-full bg-white" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-semibold truncate ${
                      isCompleted ? "text-green-700" : "text-slate-700"
                    }`}>{step.title}</p>
                    <p className="text-xs text-slate-500 truncate">
                      {step.description}
                    </p>
                  </div>
                  <Icon className={`w-4 h-4 shrink-0 ${
                    isCompleted ? "text-green-600" : "text-slate-400"
                  }`} />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {claimData.invoice && (
          <Card className="mt-1 border-blue-200 shadow-sm">
            <CardHeader className="pb-0.5 pt-1.5">
              <CardTitle className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                <FileText className="w-3 h-3 text-blue-600" />
                Invoice Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0.5 pb-1 space-y-0.5">
              <div className="flex items-center justify-between gap-1 p-1 bg-linear-to-r from-slate-50 to-slate-100 rounded border border-slate-200 hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-1 flex-1 min-w-0">
                  <div className="p-0.5 bg-blue-100 rounded-sm">
                    <FileText className="w-3 h-3 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {claimData.invoice.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (claimData.invoice) {
                      const fileUrl = URL.createObjectURL(claimData.invoice);
                      window.open(fileUrl, "_blank");
                    }
                  }}
                  className="p-0.5 bg-blue-600 hover:bg-blue-700 rounded-sm transition-colors shadow-sm shrink-0"
                  title="Preview invoice"
                >
                  <Eye className="w-3 h-3 text-white" />
                </button>
              </div>

              {warrantyStatus && (
                <div
                  className={`flex items-center gap-1 p-1 rounded border shadow-sm ${
                    warrantyStatus === "available"
                      ? "bg-linear-to-r from-green-50 to-green-100 border-green-300 text-green-800"
                      : "bg-linear-to-r from-red-50 to-red-100 border-red-300 text-red-800"
                  }`}
                >
                  <div className={`p-0.5 rounded-sm ${warrantyStatus === "available" ? "bg-green-200" : "bg-red-200"}`}>
                    {warrantyStatus === "available" ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold">
                      {warrantyStatus === "available"
                        ? "Warranty Active - Eligible for Claim"
                        : "Warranty Expired - Ineligible for Claim"}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}


      </div>

      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Claim Support</CardTitle>
            <p className="text-sm text-slate-600">
              Complete each step to submit your claim
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {!isSubmitted ? (
              <>
                {currentStep === 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      <h3 className="text-base font-semibold">
                        Start Your Claim
                      </h3>
                    </div>
                    <div className="text-center space-y-3">
                      <p className="text-sm text-slate-600">
                        Click the button below to initialize your claim process.
                      </p>
                      <Button
                        onClick={handleStartClaim}
                        disabled={isSubmitting}
                        className="w-full"
                      >
                        {isSubmitting ? "Starting Claim..." : "Start Claim"}
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Upload className="w-4 h-4 text-blue-600" />
                      <h3 className="text-base font-semibold">
                        Upload Invoice
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">
                        Upload Invoice/Receipt *
                      </Label>
                      <div
                        className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center cursor-pointer hover:border-slate-400 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                        <p className="text-sm text-slate-600">
                          {claimData.invoice
                            ? claimData.invoice.name
                            : "Click to upload invoice/receipt"}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Supported formats: PDF, DOCX
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                    {claimData.invoice &&
                      !showWarrantyExpiredDialog &&
                      !showInvalidInvoiceDialog &&
                      !showWarrantyAvailableDialog && (
                        <Button
                          onClick={handleContinueToProducts}
                          className="w-full"
                          disabled={isAnalyzing || isSubmitting}
                        >
                          {isSubmitting
                            ? "Processing..."
                            : isAnalyzing
                            ? "Analyzing Invoice..."
                            : "Continue"}
                        </Button>
                      )}
                  </div>
                )}

                {showWarrantyExpiredDialog && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                      <h3 className="text-base font-semibold text-orange-700">
                        Warranty Expired
                      </h3>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-orange-600" />
                          <p className="text-sm text-orange-800 font-medium">
                            Your product warranty has expired.
                          </p>
                        </div>
                        <p className="text-sm text-orange-700">
                          Processing your claim may incur additional charges.
                          Would you like to proceed with the claim process
                          anyway?
                        </p>
                        <div className="bg-orange-100 border border-orange-300 rounded p-2">
                          <p className="text-xs text-orange-800">
                            <strong>Note:</strong> Additional service fees and
                            repair costs may apply for out-of-warranty claims.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Button
                          onClick={() => handleWarrantyExpiredDecision(true)}
                          className="flex-1 bg-orange-600 hover:bg-orange-700"
                        >
                          Yes, Proceed with Potential Charges
                        </Button>
                        <Button
                          onClick={() => handleWarrantyExpiredDecision(false)}
                          className="flex-1 hover:bg-red-100! hover:text-red-900! hover:border-red-300!"
                          variant="outline"
                        >
                          No, Cancel Claim
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {showWarrantyAvailableDialog && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <h3 className="text-base font-semibold text-green-700">
                        Warranty Active
                      </h3>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <p className="text-sm text-green-800 font-medium">
                            Great news! Your product warranty is still active.
                          </p>
                        </div>
                        <p className="text-sm text-green-700">
                          Your warranty covers repairs and replacements at no
                          additional cost. Would you like to proceed with your
                          warranty claim?
                        </p>
                        <div className="bg-green-100 border border-green-300 rounded p-2">
                          <p className="text-xs text-green-800">
                            <strong>Benefits:</strong> Free repairs,
                            replacements, and technical support covered under
                            warranty.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Button
                          onClick={() => handleWarrantyAvailableDecision(true)}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          Yes, Proceed with Warranty Claim
                        </Button>
                        <Button
                          onClick={() => handleWarrantyAvailableDecision(false)}
                          className="flex-1 hover:bg-red-100! hover:text-red-900! hover:border-red-300!"
                          variant="outline"
                        >
                          No, Cancel Claim
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {showInvalidInvoiceDialog && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <h3 className="text-base font-semibold text-red-700">
                        Invalid Invoice
                      </h3>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <p className="text-sm text-red-800 font-medium">
                            Invoice could not be processed
                          </p>
                        </div>
                        <p className="text-sm text-red-700">
                          The uploaded invoice appears to be invalid or could
                          not be found in our database. This could be due to:
                        </p>
                        <ul className="text-sm text-red-700 space-y-0.5 ml-4">
                          <li>• Invoice is not from an authorized retailer</li>
                          <li>• Invoice format is not readable</li>
                          <li>
                            • Missing required information (date, products,
                            etc.)
                          </li>
                          <li>• Invoice is corrupted or unclear</li>
                        </ul>
                        <div className="bg-red-100 border border-red-300 rounded p-2">
                          <p className="text-xs text-red-800">
                            <strong>Please:</strong> Check your invoice and try
                            again with a valid invoice or receipt from an
                            authorized retailer.
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-center pt-1">
                        <Button
                          onClick={handleInvalidInvoiceDecision}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Back to Start
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-4 h-4 text-blue-600" />
                      <h3 className="text-base font-semibold">
                        Select Product
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-sm">
                          Choose the affected product(s) *
                        </Label>
                        <div className="grid grid-cols-2 gap-2 p-3 border rounded-lg">
                          {(webhookProducts.length > 0
                            ? webhookProducts
                            : AVAILABLE_PRODUCTS
                          ).map((product) => (
                            <div
                              key={product}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={product}
                                checked={claimData.products.includes(product)}
                                onCheckedChange={() =>
                                  handleProductToggle(product)
                                }
                              />
                              <Label
                                htmlFor={product}
                                className="text-sm font-normal"
                              >
                                {product}
                              </Label>
                            </div>
                          ))}
                        </div>
                        {claimData.products.length > 0 && (
                          <p className="text-xs text-green-600">
                            Selected: {claimData.products.join(", ")}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">
                          Type of support needed *
                        </Label>
                        <div className="grid grid-cols-1 gap-2 p-2 border rounded-lg">
                          {SUPPORT_TYPES.map((supportType) => (
                            <div
                              key={supportType}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={supportType}
                                checked={claimData.supportType === supportType}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setClaimData((prev) => ({
                                      ...prev,
                                      supportType,
                                    }));
                                  }
                                }}
                              />
                              <Label
                                htmlFor={supportType}
                                className="text-sm font-normal"
                              >
                                {supportType}
                              </Label>
                            </div>
                          ))}
                        </div>
                        {claimData.supportType && (
                          <p className="text-xs text-green-600">
                            Selected: {claimData.supportType}
                          </p>
                        )}
                      </div>
                    </div>
                    {claimData.products.length > 0 && claimData.supportType && (
                      <Button
                        onClick={handleContinueToIssue}
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Processing..." : "Continue"}
                      </Button>
                    )}
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-blue-600" />
                      <h3 className="text-base font-semibold">
                        Describe Issue
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="issueType" className="text-sm">
                        Select Issue Type *
                      </Label>
                      <Select
                        value={claimData.issueType}
                        onValueChange={handleIssueTypeChange}
                      >
                        <SelectTrigger className="w-fit max-w-md text-base">
                          <SelectValue placeholder="Choose the type of issue..." />
                        </SelectTrigger>
                        <SelectContent className="z-50 bg-blue-50 border-2 border-blue-400 shadow-2xl">
                          {/* Dynamically populate issue options */}
                          {currentIssueOptions.map((option) => (
                            <SelectItem
                              key={option}
                              value={option}
                              className="text-base"
                            >
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {claimData.issueType === "other" && (
                      <div className="space-y-2">
                        <Label htmlFor="issue" className="text-sm">
                          Describe the problem you're experiencing *
                        </Label>
                        <Textarea
                          id="issue"
                          placeholder="Please provide detailed information about the issue..."
                          value={claimData.issueDescription}
                          onChange={(e) => handleIssueChange(e.target.value)}
                          rows={4}
                          className="text-base"
                        />
                      </div>
                    )}
                    {((claimData.issueType &&
                      claimData.issueType !== "other") ||
                      (claimData.issueType === "other" &&
                        claimData.issueDescription.length > 0)) && (
                      <Button
                        onClick={handleContinueToResolution}
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Processing..." : "Continue"}
                      </Button>
                    )}
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <h3 className="text-base font-semibold">Resolution</h3>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>What resolution would you like? *</Label>
                        <Select
                          value={claimData.selectedResolution}
                          onValueChange={(value) => {
                            setClaimData((prev) => ({
                              ...prev,
                              selectedResolution: value,
                              desiredResolution:
                                value === "Other" ? prev.desiredResolution : "",
                            }));
                          }}
                        >
                          <SelectTrigger className="w-fit max-w-md text-base">
                            <SelectValue placeholder="Select desired resolution" />
                          </SelectTrigger>
                          <SelectContent className="z-50 bg-blue-50 border-2 border-blue-400 shadow-2xl">
                            {(
                              RESOLUTION_OPTIONS[
                                claimData.supportType as keyof typeof RESOLUTION_OPTIONS
                              ] || RESOLUTION_OPTIONS["Troubleshooting"]
                            ).map((resolution) => (
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

                        {claimData.selectedResolution === "other" && (
                          <Textarea
                            placeholder="Please describe your desired resolution..."
                            value={claimData.desiredResolution}
                            onChange={(e) =>
                              setClaimData((prev) => ({
                                ...prev,
                                desiredResolution: e.target.value,
                              }))
                            }
                            className="min-h-20 text-base p-3"
                          />
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notificationEmail" className="text-sm">
                          Email for claim updates *
                        </Label>
                        <Input
                          id="notificationEmail"
                          type="email"
                          placeholder="Email address for claim status updates"
                          value={claimData.notificationEmail}
                          onChange={(e) =>
                            setClaimData((prev) => ({
                              ...prev,
                              notificationEmail: e.target.value,
                            }))
                          }
                        />
                      </div>

                      {claimData.selectedResolution &&
                        (claimData.selectedResolution !== "other" ||
                          (claimData.selectedResolution === "other" &&
                            claimData.desiredResolution.trim().length > 0)) &&
                        claimData.notificationEmail.length > 0 && (
                          <Button
                            onClick={() => {
                              handleSubmitClaim();
                            }}
                            className="w-full"
                          >
                            {isSubmitting
                              ? "Submitting Claim..."
                              : "Submit Claim"}
                          </Button>
                        )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="space-y-3">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  <h3 className="text-xl font-bold text-green-700">
                    Claim Submitted Successfully!
                  </h3>
                  <div className="space-y-1.5">
                    <p className="text-slate-600">
                      Your claim has been submitted and is being processed.
                    </p>
                    <p className="text-sm text-slate-600">
                      You'll receive updates via email at{" "}
                      <span className="font-medium text-blue-600">
                        {claimData.notificationEmail}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center justify-center gap-2 text-blue-700 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="font-medium">
                      Returning to home in {redirectCountdown} seconds...
                    </span>
                  </div>
                </div>
              </div>
            )}
            {currentStep > 0 && !isSubmitted && canGoBack && (
              <div className="flex justify-start items-center p-3 bg-white rounded-lg border border-slate-200 mt-4">
                <Button
                  onClick={handleGoBack}
                  disabled={!canGoBack}
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results Section - Third Column */}
      <div className="lg:col-span-1 space-y-3">
        {/* Empty results section */}
      </div>
    </div>
  );
}
