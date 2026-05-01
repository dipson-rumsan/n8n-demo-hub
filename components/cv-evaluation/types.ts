export interface ParsedData {
  [key: string]: any;
  evaluation?: {
    overallScore?: number;
    strengths?: string[];
    weaknesses?: string[];
    recommendations?: string[];
    skillsMatch?: number;
    experienceLevel?: string;
    atsCompatibility?: number;
    decision?: string;
    evaluationReasons?: string;
  };
  personalInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
  };
  skills?: string[];
  experience?: Array<{
    company?: string;
    position?: string;
    duration?: string;
    description?: string;
  }>;
  education?: Array<{
    institution?: string;
    degree?: string;
    year?: string;
  }>;
}

export interface UploadedFile {
  file: File;
  id: string;
  status: "ready" | "uploading" | "success" | "error";
  progress: number;
  parsedData?: ParsedData;
  error?: string;
}
