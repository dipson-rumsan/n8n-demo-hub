"use client";

import type React from "react";
import type { JSX } from "react";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
  Eye,
  Download,
  Send,
  Award,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Building,
  GraduationCap,
  Briefcase,
  Info,
} from "lucide-react";

const parseEvaluationContent = (content: string) => {
  let decision = "Pending";
  let reasoning = content;

  // Look for explicit decision markers first
  if (
    content.includes("**Evaluation Result: Accept**") ||
    content.includes("**Final Decision: Accept**")
  ) {
    decision = "Accept";
    reasoning = content
      .replace(/\*\*(?:Evaluation Result|Final Decision): Accept\*\*/, "")
      .trim();
  } else if (
    content.includes("**Evaluation Result: Reject**") ||
    content.includes("**Final Decision: Reject**")
  ) {
    decision = "Reject";
    reasoning = content
      .replace(/\*\*(?:Evaluation Result|Final Decision): Reject\*\*/, "")
      .trim();
  } else {
    // Try to infer decision from content
    const contentLower = content.toLowerCase();

    // Look for rejection indicators
    const rejectIndicators = [
      "does not meet",
      "insufficient experience",
      "lacks significant",
      "not suitable",
      "inadequate",
      "falls short",
      "weak candidate",
      "not qualified",
      "does not qualify",
      "challenging to consider",
      "not recommend",
      "reject",
    ];

    // Look for acceptance indicators
    const acceptIndicators = [
      "strong candidate",
      "highly qualified",
      "excellent fit",
      "meets all requirements",
      "exceeds expectations",
      "well-qualified",
      "highly recommended",
      "accept",
      "move forward",
      "proceed with",
    ];

    // Count indicators
    const rejectCount = rejectIndicators.filter((indicator) =>
      contentLower.includes(indicator)
    ).length;
    const acceptCount = acceptIndicators.filter((indicator) =>
      contentLower.includes(indicator)
    ).length;

    // Determine decision based on indicators
    if (rejectCount > acceptCount && rejectCount > 0) {
      decision = "Reject";
    } else if (acceptCount > rejectCount && acceptCount > 0) {
      decision = "Accept";
    }

    // Look for explicit recommendation at the end
    const lines = content.split("\n");
    const lastFewLines = lines.slice(-5).join(" ").toLowerCase();
    if (lastFewLines.includes("recommend") && lastFewLines.includes("reject")) {
      decision = "Reject";
    } else if (
      lastFewLines.includes("recommend") &&
      lastFewLines.includes("accept")
    ) {
      decision = "Accept";
    }
  }

  return { decision, reasoning };
};

const MarkdownRenderer = ({ content }: { content: string }) => {
  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    const elements: JSX.Element[] = [];
    let inList = false;
    let currentList: string[] = [];

    lines.forEach((line, index) => {
      // Bold text
      const boldPattern = /\*\*(.*?)\*\*/g;
      let lineElement = line;
      const boldMatches = line.match(boldPattern);
      if (boldMatches) {
        boldMatches.forEach((match) => {
          const boldText = match.replace(/\*\*/g, "");
          lineElement = lineElement.replace(
            match,
            `<strong>${boldText}</strong>`
          );
        });
      }

      // Headings
      if (line.startsWith("# ")) {
        elements.push(
          <h1
            key={index}
            className="text-3xl font-bold text-slate-900 mt-4 mb-2"
          >
            {line.substring(2)}
          </h1>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2
            key={index}
            className="text-2xl font-bold text-slate-800 mt-3 mb-2"
          >
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3
            key={index}
            className="text-xl font-semibold text-slate-700 mt-2 mb-1"
          >
            {line.substring(4)}
          </h3>
        );
      }
      // Lists
      else if (line.startsWith("- ") || line.startsWith("* ")) {
        if (!inList) {
          inList = true;
          currentList = [];
        }
        currentList.push(line.substring(2));
      }
      // Empty lines
      else if (line.trim() === "") {
        if (inList) {
          elements.push(
            <ul
              key={`list-${index}`}
              className="list-disc list-inside ml-4 mb-4 text-slate-800 space-y-1"
            >
              {currentList.map((item, i) => (
                <li key={i} className="text-slate-800">
                  {item}
                </li>
              ))}
            </ul>
          );
          inList = false;
          currentList = [];
        }
      }
      // Regular paragraphs
      else if (line.trim()) {
        if (inList) {
          elements.push(
            <ul
              key={`list-${index}`}
              className="list-disc list-inside ml-4 mb-4 text-slate-800 space-y-1"
            >
              {currentList.map((item, i) => (
                <li key={i} className="text-slate-800">
                  {item}
                </li>
              ))}
            </ul>
          );
          inList = false;
          currentList = [];
        }
        elements.push(
          <p
            key={index}
            className="text-slate-800 leading-relaxed mb-3"
            dangerouslySetInnerHTML={{ __html: lineElement }}
          />
        );
      }
    });

    // Don't forget trailing list
    if (inList && currentList.length > 0) {
      elements.push(
        <ul
          key="final-list"
          className="list-disc list-inside ml-4 mb-4 text-slate-800 space-y-1"
        >
          {currentList.map((item, i) => (
            <li key={i} className="text-slate-800">
              {item}
            </li>
          ))}
        </ul>
      );
    }

    return elements;
  };

  return (
    <div className="prose prose-sm max-w-none bg-white rounded-lg p-6 border border-slate-200">
      {renderMarkdown(content)}
    </div>
  );
};

const JOB_POSITIONS = [
  {
    id: "ai-ml-engineer",
    title: "Mid-Level AI/ML Engineer",
    requirements: [
      "Bachelor's or Master's degree in Computer Science, Data Science, Mathematics, or a related field.",
      "3–5 years of professional experience in AI/ML or data science.",
      "Strong proficiency in Python (NumPy, Pandas, Scikit-learn, PyTorch, TensorFlow, etc.).",
      "Experience with data preprocessing, feature engineering, and model deployment.",
      "Knowledge of classical ML algorithms (regression, clustering, tree-based methods, etc.) and deep learning.",
      "Hands-on experience with cloud platforms (AWS, GCP, or Azure).",
      "Familiarity with MLOps tools (MLflow, Kubeflow, Docker, Kubernetes, etc.).",
      "Solid understanding of software engineering practices (version control, testing, CI/CD).",
      "Strong problem-solving skills and the ability to work independently.",
    ],
  },
  {
    id: "fullstack-developer",
    title: "Full-Stack Developer",
    requirements: [
      "Bachelor's degree in Computer Science or related field.",
      "3+ years of experience in full-stack web development.",
      "Proficiency in React, Node.js, and modern JavaScript/TypeScript.",
      "Experience with REST APIs and database design (SQL and NoSQL).",
      "Knowledge of cloud platforms (AWS, GCP, or Azure).",
      "Familiarity with CI/CD pipelines and DevOps practices.",
      "Strong understanding of web security and performance optimization.",
      "Excellent problem-solving and communication skills.",
    ],
  },
  {
    id: "frontend-developer",
    title: "Frontend Developer",
    requirements: [
      "Bachelor's degree in Computer Science or related field.",
      "2+ years of experience in frontend development.",
      "Expert knowledge of React, Next.js, and modern CSS frameworks.",
      "Strong proficiency in TypeScript and JavaScript.",
      "Experience with state management (Redux, Zustand, or similar).",
      "Understanding of responsive design and accessibility standards.",
      "Familiarity with testing frameworks (Jest, React Testing Library).",
      "Portfolio demonstrating UI/UX design skills.",
    ],
  },
  {
    id: "backend-developer",
    title: "Backend Developer",
    requirements: [
      "Bachelor's degree in Computer Science or related field.",
      "3+ years of experience in backend development.",
      "Strong proficiency in Node.js, Python, or Java.",
      "Experience with database design and optimization (PostgreSQL, MongoDB).",
      "Knowledge of microservices architecture and RESTful APIs.",
      "Familiarity with message queues (RabbitMQ, Kafka) and caching (Redis).",
      "Understanding of security best practices and authentication systems.",
      "Experience with Docker and container orchestration.",
    ],
  },
  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    requirements: [
      "Bachelor's degree in Computer Science or related field.",
      "3+ years of experience in DevOps or Site Reliability Engineering.",
      "Strong knowledge of AWS, GCP, or Azure cloud platforms.",
      "Experience with Infrastructure as Code (Terraform, CloudFormation).",
      "Proficiency in containerization (Docker) and orchestration (Kubernetes).",
      "Expertise in CI/CD pipelines (Jenkins, GitLab CI, GitHub Actions).",
      "Understanding of monitoring and logging tools (Prometheus, Grafana, ELK).",
      "Strong scripting skills (Bash, Python, or similar).",
    ],
  },
];

const JOB_REQUIREMENTS = JOB_POSITIONS[0];

interface ParsedData {
  [key: string]: any; // Allow flexible structure from n8n response
  evaluation?: {
    overallScore?: number;
    strengths?: string[];
    weaknesses?: string[];
    recommendations?: string[];
    skillsMatch?: number;
    experienceLevel?: string;
    atsCompatibility?: number;
    decision?: string; // Added decision field
    evaluationReasons?: string; // Added evaluationReasons field
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

interface UploadedFile {
  file: File;
  id: string;
  status: "ready" | "uploading" | "success" | "error";
  progress: number;
  parsedData?: ParsedData;
  error?: string;
}

export default function CVUploader() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [activeTab, setActiveTab] = useState("upload");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customJobRequirements, setCustomJobRequirements] = useState("");
  const [selectedJobPosition, setSelectedJobPosition] = useState<string>(
    JOB_POSITIONS[0].id
  );

  useEffect(() => {
    const loadSamplePDF = async () => {
      try {
        const response = await fetch("/sample_resume.pdf");
        const blob = await response.blob();
        const file = new File([blob], "sample_resume.pdf", {
          type: "application/pdf",
        });

        const fileId = "sample-" + Math.random().toString(36).substr(2, 9);

        setFiles([
          {
            file,
            id: fileId,
            status: "ready",
            progress: 0,
          },
        ]);
      } catch (error) {
        console.error("Failed to load sample PDF:", error);
      }
    };

    loadSamplePDF();
  }, []);

  const webhookUrl = "https://n8n-webhook.rumsan.net/webhook/cv-form";

  const acceptedTypes = [".pdf"];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const validateFile = (file: File): string | null => {
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

    if (!acceptedTypes.includes(fileExtension)) {
      return `File type ${fileExtension} not supported. Please use: ${acceptedTypes.join(
        ", "
      )}`;
    }

    if (file.size > maxFileSize) {
      return `File size too large. Maximum size is ${
        maxFileSize / (1024 * 1024)
      }MB`;
    }

    return null;
  };

  const processFileWithWorkflow = async (fileId: string, file: File) => {
    try {
      console.log(
        "[v0] Starting file upload to processing workflow:",
        webhookUrl
      );

      const formData = new FormData();
      formData.append("file", file);
      formData.append("filename", file.name);
      formData.append("filesize", file.size.toString());

      const selectedPosition = JOB_POSITIONS.find(
        (pos) => pos.id === selectedJobPosition
      );
      if (selectedPosition) {
        formData.append("jobTitle", selectedPosition.title);
        formData.append(
          "jobRequirements",
          selectedPosition.requirements.join("\n")
        );
      }

      // Pass custom job requirements if they exist
      if (customJobRequirements) {
        formData.append("jobRequirements", customJobRequirements);
      }

      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, progress: 10 } : f))
      );

      const response = await fetch(webhookUrl, {
        method: "POST",
        body: formData,
        mode: "cors",
        credentials: "omit",
      });

      console.log("[v0] Processing response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, progress: 70 } : f))
      );

      const responseText = await response.text();
      console.log(
        "[v0] Raw response text:",
        responseText.substring(0, 500) +
          (responseText.length > 500 ? "..." : "")
      );

      let result: ParsedData = {};

      try {
        // Split response by lines and parse each JSON object
        const lines = responseText
          .trim()
          .split("\n")
          .filter((line) => line.trim());
        console.log("[v0] Found", lines.length, "JSON lines to parse");

        let combinedContent = "";
        let metadata: any = null;

        for (const line of lines) {
          try {
            const jsonObj = JSON.parse(line);
            console.log("[v0] Parsed JSON object:", jsonObj);

            if (jsonObj.type === "begin") {
              metadata = jsonObj.metadata;
            } else if (jsonObj.type === "item" && jsonObj.content) {
              combinedContent += jsonObj.content;
            } else if (jsonObj.type === "end" || jsonObj.type === "complete") {
              // Final object might contain the complete result
              if (jsonObj.data || jsonObj.result) {
                result = { ...result, ...(jsonObj.data || jsonObj.result) };
              }
            }
          } catch (lineError) {
            console.log(
              "[v0] Failed to parse line as JSON:",
              line.substring(0, 100)
            );
          }
        }

        // If we have combined content, try to parse it as the final result
        if (combinedContent.trim()) {
          console.log(
            "[v0] Combined content:",
            combinedContent.substring(0, 200) + "..."
          );

          try {
            // Try to parse the combined content as JSON
            const parsedContent = JSON.parse(combinedContent);
            result = { ...result, ...parsedContent };
          } catch (contentError) {
            const { decision, reasoning } =
              parseEvaluationContent(combinedContent);
            result = {
              content: combinedContent,
              metadata: metadata,
              evaluation: {
                decision: decision,
                evaluationReasons: combinedContent, // Store full markdown content
              },
            };
          }
        }

        // If no meaningful result was extracted, create a basic structure
        if (Object.keys(result).length === 0) {
          result = {
            rawResponse: responseText,
            metadata: metadata,
            evaluation: {
              overallScore: 75,
              strengths: ["CV processed successfully"],
              recommendations: [
                "Check the raw response for detailed information",
              ],
            },
          };
        }

        console.log("[v0] Final processed result:", result);
        console.log("[v0] Evaluation data:", result.evaluation);
        console.log("[v0] Skills:", result.skills);
        console.log("[v0] Experience:", result.experience);
        console.log("[v0] Education:", result.education);
      } catch (parseError) {
        console.error("[v0] Error parsing NDJSON response:", parseError);

        // Fallback: create a basic result structure
        result = {
          rawResponse: responseText,
          error: "Failed to parse streaming response",
          evaluation: {
            overallScore: 60,
            weaknesses: ["Response parsing failed"],
            recommendations: ["Check the raw response data"],
          },
        };
      }

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: "success",
                progress: 100,
                parsedData: result,
              }
            : f
        )
      );

      setActiveTab("preview");
    } catch (error) {
      console.error("[v0] Error processing file:", error);

      let errorMessage = "Unknown error occurred";

      if (error instanceof TypeError && error.message === "Failed to fetch") {
        errorMessage =
          "Network error: Unable to reach the CV processing service. Please check your internet connection or try again later.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: "error",
                progress: 0,
                error: errorMessage,
              }
            : f
        )
      );
    }
  };

  const handleFileUpload = useCallback((uploadFiles: FileList | File[]) => {
    const fileArray = Array.from(uploadFiles);

    const file = fileArray[0];
    if (!file) return;

    const validationError = validateFile(file);
    const fileId = Math.random().toString(36).substr(2, 9);

    if (validationError) {
      setFiles([
        {
          file,
          id: fileId,
          status: "error",
          progress: 0,
          error: validationError,
        },
      ]);
      return;
    }

    setFiles([
      {
        file,
        id: fileId,
        status: "ready",
        progress: 0,
      },
    ]);
  }, []);

  const handleIndividualSubmit = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (file && file.status === "ready") {
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, status: "uploading" } : f))
      );
      processFileWithWorkflow(fileId, file.file);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        handleFileUpload(droppedFiles);
      }
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
      const selectedFiles = e.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
        handleFileUpload(selectedFiles);
      }
    },
    [handleFileUpload]
  );

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const successfulFiles = files.filter((f) => f.status === "success");

  const renderParsedData = (data?: ParsedData) => {
    if (!data) return null;

    const experiences = data.experience ?? [];

    // Use custom job requirements if available, otherwise default
    // const jobRequirementsToDisplay = customJobRequirements
    //   ? customJobRequirements
    //       .split("\n")
    //       .map((line) => line.trim())
    //       .filter(Boolean)
    //   : JOB_REQUIREMENTS.requirements

    return (
      <div className="space-y-6">
        <div className="grid gap-6">
          {data.personalInfo && (
            <Card className="border-slate-700 shadow-xl bg-slate-900">
              <CardHeader className="border-b border-slate-700 bg-slate-800/50">
                <CardTitle className="flex items-center gap-2 text-slate-100">
                  <div className="p-2 bg-slate-700 rounded-lg">
                    <MapPin className="w-5 h-5 text-slate-300" />
                  </div>
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.personalInfo.name && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {data.personalInfo.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">
                          {data.personalInfo.name}
                        </div>
                        <div className="text-sm text-slate-600">Full Name</div>
                      </div>
                    </div>
                  )}
                  {data.personalInfo.email && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Mail className="w-5 h-5 text-slate-600" />
                      <div>
                        <div className="font-semibold text-slate-900">
                          {data.personalInfo.email}
                        </div>
                        <div className="text-sm text-slate-600">
                          Email Address
                        </div>
                      </div>
                    </div>
                  )}
                  {data.personalInfo.phone && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Phone className="w-5 h-5 text-slate-600" />
                      <div>
                        <div className="font-semibold text-slate-900">
                          {data.personalInfo.phone}
                        </div>
                        <div className="text-sm text-slate-600">
                          Phone Number
                        </div>
                      </div>
                    </div>
                  )}
                  {data.personalInfo.location && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-slate-600" />
                      <div>
                        <div className="font-semibold text-slate-900">
                          {data.personalInfo.location}
                        </div>
                        <div className="text-sm text-slate-600">Location</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {data.skills && data.skills.length > 0 && (
            <Card className="border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="border-b border-green-100 bg-linear-to-r from-green-50 to-emerald-50">
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Award className="w-5 h-5 text-green-600" />
                  </div>
                  Skills & Competencies
                  <Badge className="ml-2 bg-green-100 text-green-700">
                    {data.skills.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-3">
                  {data.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-linear-to-r from-green-100 to-emerald-100 text-green-800 hover:from-green-200 hover:to-emerald-200 px-4 py-2 text-sm shadow-sm hover:shadow-md transition-all duration-300 border border-green-200"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {experiences.length > 0 && (
            <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="border-b border-blue-100 bg-linear-to-r from-blue-50 to-indigo-50">
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  Work Experience
                  <Badge className="ml-2 bg-blue-100 text-blue-700">
                    {experiences.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {experiences.map((exp, index) => (
                  <div
                    key={index}
                    className="bg-linear-to-r from-white to-blue-50 rounded-xl p-5 border-l-4 border-blue-500 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-xl text-blue-900 mb-2">
                          {exp.position || "Position Not Specified"}
                        </h4>
                        <div className="flex items-center gap-2 text-blue-700">
                          <div className="p-1 bg-blue-100 rounded">
                            <Building className="w-4 h-4" />
                          </div>
                          <span className="font-semibold">
                            {exp.company || "Company Not Specified"}
                          </span>
                        </div>
                      </div>
                      {exp.duration && (
                        <Badge
                          variant="outline"
                          className="border-blue-300 text-blue-700 bg-blue-50 px-3 py-1"
                        >
                          <Calendar className="w-3 h-3 mr-1" />
                          {exp.duration}
                        </Badge>
                      )}
                    </div>
                    {exp.description && (
                      <div className="bg-white rounded-lg p-4 mt-3 border border-blue-100 shadow-sm">
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {exp.description}
                        </p>
                      </div>
                    )}
                    {index < experiences.length - 1 && (
                      <Separator className="mt-6 bg-blue-200" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {data.education && data.education.length > 0 && (
            <Card className="border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="border-b border-purple-100 bg-linear-to-r from-purple-50 to-pink-50">
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                  </div>
                  Education
                  <Badge className="ml-2 bg-purple-100 text-purple-700">
                    {data.education.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {data.education.map((edu, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-5 bg-linear-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-300 hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-14 h-14 bg-linear-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center shadow-md">
                      <GraduationCap className="w-7 h-7 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg text-purple-900">
                        {edu.degree || "Degree Not Specified"}
                      </div>
                      <div className="text-sm text-purple-700 font-medium mt-1">
                        {edu.institution || "Institution Not Specified"}
                      </div>
                    </div>
                    {edu.year && (
                      <Badge className="bg-purple-100 text-purple-800 border border-purple-300 px-3 py-1 text-sm">
                        {edu.year}
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {data.evaluation && (
            <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="border-b border-slate-200 bg-linear-to-r from-slate-50 to-blue-50">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <FileText className="w-5 h-5 text-slate-600" />
                  </div>
                  Evaluation Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {data.evaluation.decision && (
                  <div
                    className={`p-6 rounded-xl border-2 shadow-md ${
                      data.evaluation.decision === "Accept"
                        ? "bg-linear-to-r from-green-50 to-emerald-50 border-green-300"
                        : "bg-linear-to-r from-red-50 to-rose-50 border-red-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-full ${
                          data.evaluation.decision === "Accept"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        {data.evaluation.decision === "Accept" ? (
                          <CheckCircle className="w-7 h-7 text-green-600" />
                        ) : (
                          <AlertCircle className="w-7 h-7 text-red-600" />
                        )}
                      </div>
                      <div>
                        <h3
                          className={`text-2xl font-bold ${
                            data.evaluation.decision === "Accept"
                              ? "text-green-900"
                              : "text-red-900"
                          }`}
                        >
                          Final Decision:{" "}
                          {data.evaluation.decision || "Pending"}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                          AI Recommendation Result
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {data.evaluation.evaluationReasons && (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <MarkdownRenderer
                      content={data.evaluation.evaluationReasons}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  const downloadPreviewData = (uploadedFile: UploadedFile) => {
    if (!uploadedFile.parsedData) return;

    const fileName = uploadedFile.file.name.replace(/\.[^/.]+$/, "");
    const data = uploadedFile.parsedData;

    const generatePDF = async () => {
      // Dynamically import jsPDF to avoid SSR issues
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();

      let yPosition = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;

      // Helper function to add text with word wrapping
      const addText = (text: string, fontSize = 10, isBold = false) => {
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", isBold ? "bold" : "normal");
        const lines = doc.splitTextToSize(text, contentWidth);

        lines.forEach((line: string) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, margin, yPosition);
          yPosition += fontSize * 0.5;
        });
        yPosition += 5;
      };

      // Title
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(`CV Analysis Report - ${fileName}`, margin, yPosition);
      yPosition += 15;

      // Final Decision Section
      if (data.evaluation?.decision) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        if (data.evaluation.decision === "Accept") {
          doc.setTextColor(0, 128, 0); // Green
        } else {
          doc.setTextColor(255, 0, 0); // Red
        }
        doc.text(
          `Final Decision: ${data.evaluation.decision}`,
          margin,
          yPosition
        );
        yPosition += 10;
        doc.setTextColor(0, 0, 0); // Reset to black
      }

      // Evaluation Reasons
      if (data.evaluation?.evaluationReasons) {
        addText("EVALUATION SUMMARY", 12, true);
        addText(data.evaluation.evaluationReasons, 10, false);
      }

      // Job Requirements
      const selectedPosition = JOB_POSITIONS.find(
        (pos) => pos.id === selectedJobPosition
      );
      const jobRequirementsToDisplay = customJobRequirements
        ? customJobRequirements
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)
        : selectedPosition?.requirements || [];

      if (jobRequirementsToDisplay.length > 0) {
        addText("JOB REQUIREMENTS", 12, true);
        jobRequirementsToDisplay.forEach((req) => {
          addText(`• ${req}`, 10, false);
        });
      }

      // Personal Information
      if (data.personalInfo) {
        addText("PERSONAL INFORMATION", 12, true);
        if (data.personalInfo.name)
          addText(`Name: ${data.personalInfo.name}`, 10, false);
        if (data.personalInfo.email)
          addText(`Email: ${data.personalInfo.email}`, 10, false);
        if (data.personalInfo.phone)
          addText(`Phone: ${data.personalInfo.phone}`, 10, false);
        if (data.personalInfo.location)
          addText(`Location: ${data.personalInfo.location}`, 10, false);
      }

      // Skills
      if (data.skills && data.skills.length > 0) {
        addText("SKILLS", 12, true);
        data.skills.forEach((skill) => {
          addText(`• ${skill}`, 10, false);
        });
      }

      // Work Experience
      if (data.experience && data.experience.length > 0) {
        addText("WORK EXPERIENCE", 12, true);
        data.experience.forEach((exp) => {
          if (exp.position) addText(`Position: ${exp.position}`, 10, true);
          if (exp.company) addText(`Company: ${exp.company}`, 10, false);
          if (exp.duration) addText(`Duration: ${exp.duration}`, 10, false);
          if (exp.description)
            addText(`Description: ${exp.description}`, 10, false);
          yPosition += 5;
        });
      }

      // Education
      if (data.education && data.education.length > 0) {
        addText("EDUCATION", 12, true);
        data.education.forEach((edu) => {
          if (edu.degree) addText(`Degree: ${edu.degree}`, 10, true);
          if (edu.institution)
            addText(`Institution: ${edu.institution}`, 10, false);
          if (edu.year) addText(`Year: ${edu.year}`, 10, false);
          yPosition += 5;
        });
      }

      // Save the PDF
      doc.save(`${fileName}_evaluation_report.pdf`);
    };

    generatePDF();
  };

  return (
    <div className="h-80 bg-[#020617]">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2 ">
            AI-Powered CV Evaluation
          </h1>
          <p className="text-slate-400 text-lg">
            Upload your CV and get instant AI-driven insights and
            recommendations
          </p>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="">
          <TabsList className=" mx-auto bg-slate-900 shadow-lg border border-slate-700 p-1 w-full mb-6">
            <TabsTrigger
              value="upload"
              className=" text-slate-300 data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-300 "
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload CV
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="  text-slate-300 data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-300"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview & Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Side - Job Requirements */}
              <Card className="bg-slate-800/90 border-slate-700 shadow-2xl backdrop-blur-sm  h-120 overflow-hidden flex flex-col">
                <CardHeader className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-t-lg shrink-0">
                  <CardTitle className="text-white text-lg">
                    {JOB_POSITIONS.find((p) => p.id === selectedJobPosition)
                      ?.title || "Select Job Position"}
                  </CardTitle>
                  <CardDescription className="text-blue-100 text-sm">
                    Requirements
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-4 overflow-y-auto flex-1">
                  <div className="shrink-0">
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Select Job Position
                    </label>
                    <Select
                      value={selectedJobPosition}
                      onValueChange={setSelectedJobPosition}
                    >
                      <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-slate-100">
                        <SelectValue placeholder="Choose a job position" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {JOB_POSITIONS.map((position) => (
                          <SelectItem
                            key={position.id}
                            value={position.id}
                            className="text-slate-100 focus:bg-slate-600 focus:text-white"
                          >
                            {position.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Job Requirements List */}
                  <div className="space-y-3">
                    {JOB_POSITIONS.find(
                      (p) => p.id === selectedJobPosition
                    )?.requirements.map((req, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {req}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Right Side - Upload Area */}
              <div className="flex flex-col space-y-4">
                <div
                  className={`
                        relative border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer
                        ${
                          isDragOver
                            ? "border-blue-500 bg-blue-950/50"
                            : "border-slate-600 hover:border-blue-500 hover:bg-slate-800/50"
                        }
                      `}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    // Removed multiple attribute
                    // multiple
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />

                  <div className="p-6 space-y-3 pointer-events-none">
                    <div className="mx-auto w-14 h-14 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Upload className="w-7 h-7 text-white" />
                    </div>

                    <div className="text-center">
                      <h3 className="text-lg font-bold text-slate-100 mb-1">
                        Drop your CV here
                      </h3>
                      <p className="text-slate-300 text-sm">
                        or click to browse files
                      </p>
                      <p className="text-slate-400 text-xs mt-1">
                        PDF (Max: 10MB)
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        size="lg"
                        className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg pointer-events-auto"
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        {/* Changed text to "Choose File" */}
                        Choose File
                      </Button>
                    </div>
                  </div>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="space-y-3 pointer-events-auto">
                    {files.map((uploadedFile) => (
                      <div
                        key={uploadedFile.id}
                        className="border border-slate-700 rounded-lg p-4 bg-slate-800/80 hover:bg-slate-800 hover:shadow-lg transition-all duration-300 pointer-events-auto relative z-20"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-2.5 bg-blue-900/50 rounded-lg shrink-0">
                            <FileText className="w-5 h-5 text-blue-400" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-slate-100 truncate">
                                  {uploadedFile.file.name}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <p className="text-xs text-slate-400">
                                    {(
                                      uploadedFile.file.size /
                                      1024 /
                                      1024
                                    ).toFixed(2)}{" "}
                                    MB
                                  </p>
                                  {uploadedFile.status === "success" && (
                                    <Badge className="bg-green-900/50 text-green-300 border-green-700 text-xs px-2 py-0">
                                      Ready
                                    </Badge>
                                  )}
                                  {uploadedFile.status === "uploading" && (
                                    <Badge className="bg-blue-900/50 text-blue-300 border-blue-700 text-xs px-2 py-0">
                                      Processing...
                                    </Badge>
                                  )}
                                  {uploadedFile.status === "ready" && (
                                    <Badge className="bg-amber-900/50 text-amber-300 border-amber-700 text-xs px-2 py-0">
                                      Ready
                                    </Badge>
                                  )}
                                  {uploadedFile.status === "error" && (
                                    <Badge className="bg-red-900/50 text-red-300 border-red-700 text-xs px-2 py-0">
                                      Error
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {uploadedFile.file.type ===
                                  "application/pdf" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const fileUrl = URL.createObjectURL(
                                        uploadedFile.file
                                      );
                                      window.open(fileUrl, "_blank");
                                    }}
                                    className="h-8 w-8 p-0 hover:bg-slate-700 hover:text-blue-400 transition-colors"
                                    title="Preview PDF"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                )}
                                {uploadedFile.status === "ready" && (
                                  <Button
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleIndividualSubmit(uploadedFile.id);
                                    }}
                                    className="h-8 px-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300 text-xs"
                                  >
                                    <Send className="w-3.5 h-3.5 mr-1.5" />
                                    Process
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(uploadedFile.id);
                                  }}
                                  className="h-8 w-8 p-0 hover:bg-red-900/50 hover:text-red-400 transition-colors"
                                  title="Remove file"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            {uploadedFile.status === "uploading" && (
                              <div className="mt-3 space-y-2 bg-blue-950/50 rounded-md p-3 border border-blue-800">
                                <div className="flex items-center justify-between">
                                  <p className="text-xs font-medium text-blue-200">
                                    Processing CV...
                                  </p>
                                  <p className="text-xs font-bold text-blue-400">
                                    {Math.round(uploadedFile.progress)}%
                                  </p>
                                </div>
                                <Progress
                                  value={uploadedFile.progress}
                                  className="h-2 bg-blue-900"
                                />
                              </div>
                            )}

                            {uploadedFile.status === "ready" && (
                              <Alert className="mt-3 bg-amber-950/50 border-amber-800 py-2 px-3">
                                <Upload className="h-3.5 w-3.5 text-amber-400" />
                                <AlertDescription className="text-slate-300 text-xs">
                                  CV ready to process. Click the Process button
                                  to analyze your CV.
                                </AlertDescription>
                              </Alert>
                            )}

                            {uploadedFile.status === "error" &&
                              uploadedFile.error && (
                                <Alert className="mt-3 bg-red-950/50 border-red-800 py-2 px-3">
                                  <AlertCircle className="h-3.5 w-3.5 text-red-400" />
                                  <AlertDescription className="text-red-300 text-xs">
                                    {uploadedFile.error}
                                  </AlertDescription>
                                </Alert>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            {successfulFiles.map((uploadedFile) => (
              <Card
                key={uploadedFile.id}
                className="bg-slate-900 border border-slate-700 shadow-xl"
              >
                <CardHeader className="border-b border-slate-700 bg-slate-800/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-slate-100">
                      <div className="p-2 bg-blue-900/50 rounded-lg">
                        <Eye className="w-5 h-5 text-blue-400" />
                      </div>
                      CV Analysis Results - {uploadedFile.file.name}
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadPreviewData(uploadedFile)}
                      className="border-blue-600 text-blue-400 hover:bg-blue-950 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6 bg-slate-900">
                  {renderParsedData(uploadedFile.parsedData)}
                </CardContent>
              </Card>
            ))}

            {successfulFiles.length === 0 && (
              <Card className="border-blue-700 shadow-xl bg-slate-900">
                <CardContent className="p-12 text-center">
                  <div className="mx-auto w-20 h-20 bg-blue-900/50 rounded-full flex items-center justify-center mb-4">
                    <Info className="h-10 w-10 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-100 mb-2">
                    No Processed CVs Yet
                  </h3>
                  <p className="text-slate-400">
                    Upload and process some CVs in the Upload tab to see
                    analysis results here.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
