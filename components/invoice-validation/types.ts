export interface ClaimData {
  invoice: File | null;
  products: string[];
  issueDescription: string;
  issueType: string;
  resolutionType: string;
  resolutionSought: string;
  responseDetails: string;
  notificationEmail: string;
  supportType: string;
  selectedIssue: string;
  selectedResolution: string;
  desiredResolution: string;
}

export interface WebhookProductsResponse {
  products?: any[] | string;
  warrantyStatus?: "available" | "expired" | "unknown" | string;
  customerName?: string;
  vendor?: string;
  invoiceNumber?: string;
  invoiceId?: string;
  [key: string]: any;
}

export const EMPTY_CLAIM: ClaimData = {
  invoice: null,
  products: [],
  issueDescription: "",
  issueType: "",
  resolutionType: "",
  resolutionSought: "",
  responseDetails: "",
  notificationEmail: "",
  supportType: "",
  selectedIssue: "",
  selectedResolution: "",
  desiredResolution: "",
};

// ---------------------------------------------------------------------------

export const AVAILABLE_PRODUCTS = [
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

export const SUPPORT_TYPES = [
  "General Questions",
  "Troubleshooting",
  "Warranty Claim",
];

export const ISSUE_OPTIONS: Record<string, string[]> = {
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

export const RESOLUTION_OPTIONS: Record<string, string[]> = {
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
