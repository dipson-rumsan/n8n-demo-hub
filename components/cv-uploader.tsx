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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
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
  ArrowLeft,
} from "lucide-react";
import { URLS } from "@/constants";

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
    <div className="prose prose-sm max-w-none bg-white rounded-lg p-3 border border-slate-200">
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
  const [selectedJobPosition, setSelectedJobPosition] = useState<string>("");
  const { toast } = useToast();

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

  const webhookUrl = URLS.CV_FORM;

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
      console.log("Starting file upload to processing workflow:", webhookUrl);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("filename", file.name);
      formData.append("filesize", file.size.toString());

      const selectedPosition = JOB_POSITIONS.find(
        (pos) => pos.id === selectedJobPosition
      );

      // Always pass job title and requirements if a position is selected
      if (selectedPosition) {
        formData.append("jobTitle", selectedPosition.title);
        formData.append(
          "jobRequirements",
          selectedPosition.requirements.join("\n")
        );
      }

      // Also pass custom job requirements if they exist (in addition to position requirements)
      if (customJobRequirements) {
        formData.append("customJobRequirements", customJobRequirements);
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

      console.log("Processing response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, progress: 70 } : f))
      );

      const responseText = await response.text();
      console.log(
        "Raw response text:",
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
        console.log("Found", lines.length, "JSON lines to parse");

        let combinedContent = "";
        let metadata: any = null;

        for (const line of lines) {
          try {
            const jsonObj = JSON.parse(line);
            console.log("Parsed JSON object:", jsonObj);

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
              "Failed to parse line as JSON:",
              line.substring(0, 100)
            );
          }
        }

        // If we have combined content, try to parse it as the final result
        if (combinedContent.trim()) {
          console.log(
            "Combined content:",
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

        console.log("Final processed result:", result);
        console.log("Evaluation data:", result.evaluation);
        console.log("Skills:", result.skills);
        console.log("Experience:", result.experience);
        console.log("Education:", result.education);
      } catch (parseError) {
        console.error("Error parsing NDJSON response:", parseError);

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
      console.error("Error processing file:", error);

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
      <div className="space-y-0.5">
        <div className="grid gap-0.5">
          {data.personalInfo && (
            <Card className="border-slate-200 shadow-lg bg-white">
              <CardHeader className="border-b border-slate-200 bg-slate-50 py-3">
                <CardTitle className="flex items-center gap-2 text-slate-900 text-sm">
                  <div className="p-1.5 bg-slate-100 rounded-lg">
                    <MapPin className="w-4 h-4 text-slate-700" />
                  </div>
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.personalInfo.name && (
                    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {data.personalInfo.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">
                          {data.personalInfo.name}
                        </div>
                        <div className="text-xs text-slate-600">Full Name</div>
                      </div>
                    </div>
                  )}
                  {data.personalInfo.email && (
                    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                      <Mail className="w-4 h-4 text-slate-600" />
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">
                          {data.personalInfo.email}
                        </div>
                        <div className="text-xs text-slate-600">
                          Email Address
                        </div>
                      </div>
                    </div>
                  )}
                  {data.personalInfo.phone && (
                    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                      <Phone className="w-4 h-4 text-slate-600" />
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">
                          {data.personalInfo.phone}
                        </div>
                        <div className="text-xs text-slate-600">
                          Phone Number
                        </div>
                      </div>
                    </div>
                  )}
                  {data.personalInfo.location && (
                    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                      <MapPin className="w-4 h-4 text-slate-600" />
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">
                          {data.personalInfo.location}
                        </div>
                        <div className="text-xs text-slate-600">Location</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {data.skills && data.skills.length > 0 && (
            <Card className="border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="border-b border-green-100 bg-linear-to-r from-green-50 to-emerald-50 py-3">
                <CardTitle className="flex items-center gap-2 text-green-900 text-sm">
                  <div className="p-1.5 bg-green-100 rounded-lg">
                    <Award className="w-4 h-4 text-green-600" />
                  </div>
                  Skills & Competencies
                  <Badge className="ml-2 bg-green-100 text-green-700 text-xs">
                    {data.skills.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 pb-3">
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-linear-to-r from-green-100 to-emerald-100 text-green-800 hover:from-green-200 hover:to-emerald-200 px-2 py-1 text-xs shadow-sm hover:shadow-md transition-all duration-300 border border-green-200"
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
              <CardHeader className="border-b border-slate-200 bg-linear-to-r from-slate-50 to-blue-50 py-2">
                <CardTitle className="flex items-center gap-2 text-slate-800 text-sm">
                  <div className="p-1.5 bg-slate-100 rounded-lg">
                    <FileText className="w-4 h-4 text-slate-600" />
                  </div>
                  Evaluation Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 pt-1 pb-0">
                {data.evaluation.decision && (
                  <div
                    className={`p-2 rounded-lg border-2 shadow-sm ${
                      data.evaluation.decision === "Accept"
                        ? "bg-linear-to-r from-green-50 to-emerald-50 border-green-300"
                        : "bg-linear-to-r from-red-50 to-rose-50 border-red-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1.5 rounded-full ${
                          data.evaluation.decision === "Accept"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        {data.evaluation.decision === "Accept" ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <h3
                          className={`text-base font-bold ${
                            data.evaluation.decision === "Accept"
                              ? "text-green-900"
                              : "text-red-900"
                          }`}
                        >
                          Decision: {data.evaluation.decision || "Pending"}
                        </h3>
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
          yPosition += fontSize * 0.6;
        });
        yPosition += 3;
      };

      // Helper function to properly format markdown content
      const formatMarkdownForPDF = (content: string): string => {
        return content
          .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold markers
          .replace(/^#{1,6}\s+/gm, "") // Remove heading markers
          .replace(/^[-*+]\s+/gm, "• ") // Convert list markers to bullets
          .replace(/\n{3,}/g, "\n\n") // Reduce multiple line breaks
          .trim();
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
        const formattedContent = formatMarkdownForPDF(
          data.evaluation.evaluationReasons
        );

        // Split content into paragraphs and format properly
        const paragraphs = formattedContent.split("\n\n");
        paragraphs.forEach((paragraph) => {
          if (paragraph.trim()) {
            if (paragraph.startsWith("•")) {
              // Handle bullet points
              addText(paragraph, 10, false);
            } else if (
              paragraph.toLowerCase().includes("strengths") ||
              paragraph.toLowerCase().includes("weaknesses") ||
              paragraph.toLowerCase().includes("recommendation")
            ) {
              // Handle section headers
              addText(paragraph, 11, true);
            } else {
              // Regular content
              addText(paragraph, 10, false);
            }
          }
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
    <div className="min-h-screen bg-white">
      <div className="max-w-350 mx-auto px-4 space-y-2">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
            AI-Powered CV Evaluation
          </h1>
          <p className="text-slate-700 text-sm font-medium mb-2">
            Get professional feedback in 3 steps
          </p>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto mb-3">
            <div className="flex items-center justify-between mb-2 relative px-4">
              <div
                className={`flex flex-col items-center gap-1 ${
                  selectedJobPosition ? "text-blue-600" : "text-slate-400"
                } z-10 relative`}
              >
                <div
                  className={`w-7 h-7 rounded-full ${
                    selectedJobPosition ? "bg-blue-600" : "bg-slate-300"
                  } text-white flex items-center justify-center transition-all shadow-sm`}
                >
                  {selectedJobPosition ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Briefcase className="w-4 h-4" />
                  )}
                </div>
                <span className="text-[11px] font-medium text-center">
                  Choose Position
                </span>
              </div>
              <div
                className={`flex flex-col items-center gap-1 ${
                  files.length > 0 ? "text-indigo-600" : "text-slate-400"
                } z-10 relative`}
              >
                <div
                  className={`w-7 h-7 rounded-full ${
                    files.length > 0 ? "bg-indigo-600" : "bg-slate-300"
                  } text-white flex items-center justify-center transition-all shadow-sm`}
                >
                  {files.length > 0 ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                </div>
                <span className="text-[11px] font-medium text-center">
                  Upload CV
                </span>
              </div>
              <div
                className={`flex flex-col items-center gap-1 ${
                  files.some((f) => f.status === "success")
                    ? "text-purple-600"
                    : "text-slate-400"
                } z-10 relative`}
              >
                <div
                  className={`w-7 h-7 rounded-full ${
                    files.some((f) => f.status === "success")
                      ? "bg-purple-600"
                      : "bg-slate-300"
                  } text-white flex items-center justify-center transition-all shadow-sm`}
                >
                  {files.some((f) => f.status === "success") ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Award className="w-4 h-4" />
                  )}
                </div>
                <span className="text-[11px] font-medium text-center">
                  Get Results
                </span>
              </div>
              {/* Progress bar - only show background when there's progress */}
              {selectedJobPosition && files.length > 0 && (
                <div
                  className="absolute top-3.5 z-0"
                  style={{ left: "45px", right: "45px" }}
                >
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 transition-all duration-500 ease-out rounded-full"
                      style={{
                        width: `${
                          files.some((f) => f.status === "success") ? 100 : 50
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {successfulFiles.length > 0 ? (
          // Results Layout - Full Width
          <div className="w-full">
            <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300 max-h-[calc(100vh-200px)] overflow-hidden flex flex-col">
              <CardHeader className="bg-linear-to-r from-purple-600 via-purple-700 to-indigo-600 py-4 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={() => setFiles([])}
                      variant="ghost"
                      size="sm"
                      className="p-2 bg-white/20 hover:bg-white/30 text-white border-none transition-all rounded-lg"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-xl font-bold">
                        AI Analysis Results
                      </CardTitle>
                      <CardDescription className="text-purple-100 text-sm font-medium mt-1">
                        Comprehensive evaluation and insights
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {successfulFiles.map((file) => (
                      <Button
                        key={file.id}
                        onClick={() => downloadPreviewData(file)}
                        variant="secondary"
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white border-white/20 hover:border-white/40 transition-all"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Report
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 overflow-y-auto flex-1">
                <div className="space-y-2">
                  {successfulFiles.map((file) => (
                    <div key={file.id}>
                      <div className="mb-1 p-1.5 bg-purple-50 rounded-lg border border-purple-200">
                        <h4 className="font-semibold text-purple-900 text-sm">
                          📄 {file.file.name}
                        </h4>
                      </div>
                      {file.parsedData ? (
                        renderParsedData(file.parsedData)
                      ) : (
                        <div className="p-3 bg-slate-50 rounded-lg text-slate-600">
                          No analysis data available for this file
                        </div>
                      )}
                      {successfulFiles.length > 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Upload Layout - Two Columns
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-stretch">
            {/* Left Side - Job Requirements */}
            <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-h-125 min-h-100 overflow-hidden flex flex-col">
              <CardHeader className="bg-linear-to-r from-blue-600 via-blue-700 to-indigo-600 shrink-0 py-1.5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                <div className="relative flex items-center gap-2">
                  <div className="p-1 bg-white/20 backdrop-blur-sm rounded-lg">
                    <Briefcase className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-white text-sm font-bold leading-tight">
                      {JOB_POSITIONS.find((p) => p.id === selectedJobPosition)
                        ?.title || "Job Requirements"}
                    </CardTitle>
                    <CardDescription className="text-blue-100 text-[10px] font-medium">
                      {selectedJobPosition
                        ? "Review requirements below"
                        : "Select position to begin"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-2 space-y-1 bg-linear-to-b from-slate-50 to-white flex-1 overflow-y-auto">
                <div className="shrink-0 bg-blue-50 p-1.5 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                      1
                    </div>
                    <div>
                      <label className="block text-base font-bold text-slate-800 mb-0.5">
                        Step 1: Choose Job Position
                      </label>
                      <p className="text-sm text-slate-600 mb-1">
                        Select the role you're applying for
                      </p>
                    </div>
                  </div>
                  <Select
                    value={selectedJobPosition}
                    onValueChange={setSelectedJobPosition}
                  >
                    <SelectTrigger className="w-full bg-white border-slate-300 text-slate-900 text-sm">
                      <SelectValue placeholder="Select Job Position" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      {JOB_POSITIONS.map((position) => (
                        <SelectItem
                          key={position.id}
                          value={position.id}
                          className="text-slate-900 focus:bg-slate-100 focus:text-slate-900 text-sm"
                        >
                          {position.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Job Requirements List */}
                <div className="space-y-1">
                  {selectedJobPosition ? (
                    JOB_POSITIONS.find(
                      (p) => p.id === selectedJobPosition
                    )?.requirements.map((req, index) => (
                      <div
                        key={index}
                        className="flex gap-2 items-start p-2 bg-white rounded border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200"
                      >
                        <div className="w-2 h-2 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 mt-1.5 shrink-0" />
                        <p className="text-sm text-slate-800 leading-relaxed">
                          {req}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center py-4 text-slate-400">
                      <div className="text-center">
                        <Briefcase className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                        <p className="text-sm font-medium">
                          Please select a job position above
                        </p>
                        <p className="text-xs mt-0.5">
                          Requirements will appear here
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Right Side - Upload Area */}
            <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300 w-full min-h-100">
              <CardHeader className="bg-linear-to-r from-indigo-600 via-purple-600 to-purple-700 shrink-0 py-1.5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                <div className="relative flex items-center gap-2">
                  <div className="p-1 bg-white/20 backdrop-blur-sm rounded-lg">
                    <Upload className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-white text-sm font-bold leading-tight">
                      Upload Your CV
                    </CardTitle>
                    <CardDescription className="text-purple-100 text-[10px] font-medium">
                      Upload your own CV or process with the sample provided
                      below
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-2 space-y-1 flex-1 bg-linear-to-b from-slate-50 to-white overflow-y-auto">
                <div
                  className={`
                        relative border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer
                        ${
                          isDragOver
                            ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                            : "border-slate-300 hover:border-blue-400 hover:bg-slate-50 hover:shadow-md"
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

                  <div className="p-3 space-y-1.5 pointer-events-none">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <h3 className="text-base font-bold text-slate-900">
                        Step 2: Upload Your CV
                      </h3>
                    </div>
                    <div className="mx-auto w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Upload className="w-5 h-5 text-white" />
                    </div>

                    <div className="text-center">
                      <p className="text-slate-700 text-sm font-semibold mb-0.5">
                        Drag & drop here
                      </p>
                      <p className="text-slate-600 text-sm mb-1">
                        or click button below
                      </p>
                      <p className="text-slate-500 text-sm bg-slate-100 inline-block px-2 py-0.5 rounded-full">
                        PDF • Max 10MB
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        size="sm"
                        className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 pointer-events-auto font-semibold text-sm h-8"
                      >
                        <Upload className="w-4 h-4 mr-1.5" />
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
                        className="border-2 border-blue-200 rounded-xl p-3 bg-linear-to-br from-blue-50 via-white to-indigo-50 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 pointer-events-auto relative overflow-hidden group"
                      >
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-400/10 to-indigo-400/10 rounded-full -mr-16 -mt-16"></div>

                        <div className="flex items-center gap-3 relative z-10">
                          <div className="p-2.5 bg-linear-to-br from-blue-600 to-indigo-700 rounded-xl shrink-0 shadow-lg">
                            <FileText className="w-5 h-5 text-white" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-base text-slate-900 truncate mb-1">
                                  {uploadedFile.file.name}
                                </p>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <span className="text-xs text-slate-600 font-medium">
                                      {(
                                        uploadedFile.file.size /
                                        1024 /
                                        1024
                                      ).toFixed(2)}{" "}
                                      MB
                                    </span>
                                  </div>
                                  {uploadedFile.status === "success" && (
                                    <Badge className="bg-linear-to-r from-green-500 to-emerald-600 text-white text-[10px] px-2 py-0.5 font-bold shadow-md">
                                      ✓ Ready
                                    </Badge>
                                  )}
                                  {uploadedFile.status === "uploading" && (
                                    <Badge className="bg-linear-to-r from-blue-500 to-indigo-600 text-white text-[10px] px-2 py-0.5 font-bold animate-pulse shadow-md">
                                      ⟳ Processing...
                                    </Badge>
                                  )}
                                  {uploadedFile.status === "ready" && (
                                    <Badge className="bg-linear-to-r from-orange-500 to-amber-600 text-white text-[10px] px-2 py-0.5 font-bold shadow-md">
                                      ⚡ Ready
                                    </Badge>
                                  )}
                                  {uploadedFile.status === "error" && (
                                    <Badge className="bg-linear-to-r from-red-500 to-rose-600 text-white text-[10px] px-2 py-0.5 font-bold shadow-md">
                                      ✕ Error
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
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
                                    className="h-8 w-8 p-0 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all rounded-lg shadow-sm hover:shadow-md"
                                    title="Preview PDF"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(uploadedFile.id);
                                  }}
                                  className="h-8 w-8 p-0 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all rounded-lg shadow-sm hover:shadow-md"
                                  title="Remove file"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            {uploadedFile.status === "uploading" && (
                              <div className="mt-2 space-y-1 bg-blue-50 rounded-lg p-2 border-2 border-blue-200">
                                <div className="flex items-center justify-between">
                                  <p className="text-xs font-medium text-blue-700">
                                    Processing CV...
                                  </p>
                                  <p className="text-xs font-bold text-blue-800">
                                    {Math.round(uploadedFile.progress)}%
                                  </p>
                                </div>
                                <Progress
                                  value={uploadedFile.progress}
                                  className="h-1.5 bg-blue-200"
                                />
                              </div>
                            )}

                            {uploadedFile.status === "ready" &&
                              selectedJobPosition && (
                                <div className="mt-2 pt-2 border-t border-blue-100">
                                  <Button
                                    size="sm"
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      console.log("Button clicked!", {
                                        selectedJobPosition,
                                      }); // Debug log
                                      handleIndividualSubmit(uploadedFile.id);
                                    }}
                                    className="w-full h-9 bg-linear-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-300 text-sm font-bold rounded-lg cursor-pointer pointer-events-auto"
                                  >
                                    <Send className="w-4 h-4 mr-1.5" />
                                    <span>Analyze CV</span>
                                  </Button>
                                </div>
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
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
