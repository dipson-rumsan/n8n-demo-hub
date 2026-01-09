"use client";

import { Button } from "@/components/ui/button";
import { SickLeaveForm } from "@/components/contact-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Zap,
  FileText,
  CheckCircle2,
  Mail,
  X,
  Facebook,
  TrendingUp,
  Newspaper,
  Landmark,
  CalendarClock,
  Sheet,
  Code,
  GitBranch,
  ShieldCheck,
  Target,
  Package,
  MessageSquare,
  MessageCircle,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import React from "react";
import { PAGES } from "@/constants";

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z" />
  </svg>
);

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-.962 6.502-.378 1.73-.77 2.237-1.29 2.237-.46 0-.952-.312-1.48-.696l-2.12-1.509c-.664-.45-1.077-.717-1.743-1.148-.766-.498-.266-1.062.219-1.685.127-.163 2.348-2.207 2.399-2.398.006-.024.011-.085-.04-.12-.05-.035-.124-.023-.177-.014-.075.013-1.269.842-3.585 2.472-.433.316-.825.47-1.179.465-.388-.006-1.135-.216-1.69-.393-.678-.218-1.217-.332-1.169-.7.025-.192.308-.39.85-.592 3.508-1.524 5.847-2.529 7.018-3.014 2.791-1.155 3.376-1.356 3.756-1.356z" />
  </svg>
);

const WorkflowIcon = ({
  icon: Icon,
  colorClass,
}: {
  icon: any;
  colorClass: string;
}) => (
  <div
    className={`h-12 w-12 rounded-xl border flex items-center justify-center ${colorClass}`}
  >
    <Icon className="h-6 w-6" />
  </div>
);

function HomePage() {
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null);

  // Prevent background scrolling when modal is open
  React.useEffect(() => {
    if (expandedWorkflow) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [expandedWorkflow]);

  const workflows = [
    {
      id: "askbhunte",
      icon: Facebook,
      iconColor: "text-blue-500 border-blue-500/20 bg-blue-500/5",
      badge: "Real-time AI",
      title: "AskBhunte AI Chatbot",
      shortDescription:
        "Your all-in-one Facebook AI assistant for real-time market updates, loans, and news.",
      fullDescription:
        "AskBhunte is a multimodal AI assistant integrated with Facebook Messenger. It delivers real-time updates on Forex, Stocks, Gold/Silver prices, Nepalese bank loan rates, and the latest news from The Kathmandu Post — all in one conversational interface.",
      workflowUrl: PAGES.FACEBOOK_URL,
      problems: [
        "Keeping track of gold, silver, stocks, and Forex prices in real-time is tedious.",
        "Manually checking loan rates from multiple Nepali banks is inefficient.",
        "Staying updated with reliable news from The Kathmandu Post requires browsing multiple sources.",
        "Investors and advisors lack a single platform that consolidates market data, bank loans, and news.",
        "Critical financial and political insights are often delayed, impacting timely decisions.",
      ],
      useCases: [
        "Investors and traders get instant updates on gold, silver, stocks, and Forex markets.",
        "Compare loan rates from various Nepali banks to make informed borrowing decisions.",
        "Receive daily verified news updates from The Kathmandu Post in Messenger.",
        "Financial advisors provide real-time guidance to clients using consolidated data.",
        "Students, professionals, and business owners track market trends and political news efficiently.",
      ],
    },

    {
      id: "cv-evaluation",
      icon: FileText,
      iconColor: "text-blue-500 border-blue-500/20 bg-blue-500/5",
      badge: "AI-Powered",
      title: "CV Evaluation & Scoring",
      shortDescription:
        "AI-powered resume analysis and intelligent candidate evaluation with instant reports.",
      fullDescription:
        "Automatically evaluate CVs using AI. Extract information, score candidates, and generate detailed reports.",
      workflowUrl: "/cvEvaluation",
      isInternalRoute: true,
      steps: [
        {
          icon: CheckCircle2,
          title: "Select Job Position",
          description:
            "Choose the job role and requirements for candidate evaluation.",
        },
        {
          icon: FileText,
          title: "Upload Resumes",
          description: "Securely upload CVs through the portal.",
        },
        {
          icon: Zap,
          title: "AI Evaluation",
          description:
            "Automatically assess skills, experience, and match to job requirements.",
        },
        {
          icon: Mail,
          title: "Generate Reports",
          description: "Create detailed scorecards for each candidate.",
        },
      ],
      problems: [
        "Manual resume screening consumes excessive recruiter time",
        "Inconsistent candidate evaluations across teams",
        "Difficulty comparing large volumes of CVs objectively",
        "Difficulty comparing large volumes of CVs objectively",
        "High risk of human bias in initial candidate shortlisting",
        "Delays in recruitment affecting business timelines",
        "Challenges in documenting candidate scoring consistently",
      ],
      useCases: [
        "HR teams screening hundreds of resumes efficiently",
        "Recruitment agencies ranking candidates for clients",
        "Campus recruitment programs",
        "Startups hiring without a dedicated HR team",
        "Enterprises standardizing evaluation across departments",
        "Pre-interview shortlisting to reduce interviewer workload",
      ],
    },
    {
      id: "sick-leave",
      icon: CalendarClock,
      iconColor: "text-purple-500 border-purple-500/20 bg-purple-500/5",
      badge: "HR Automation",
      title: "Sick Leave Management",
      shortDescription:
        "Automated leave request processing with Google Sheets sync and duplicate detection.",
      fullDescription:
        "Manage employee sick leave requests automatically. Validates duplicates, formats data, and archives entries in Google Sheets.",
      image: "/images/image.png",
      workflowUrl: "/sickLeave",
      isInternalRoute: true,
      steps: [
        {
          icon: FileText,
          title: "Form Submission",
          description: "Receive leave requests from employees via a web form.",
        },
        {
          icon: Sheet,
          title: "Check Duplicates",
          description:
            "Verify if the leave request already exists in the sheet.",
        },
        {
          icon: Code,
          title: "Process Request",
          description: "Format and validate data for proper record-keeping.",
        },
        {
          icon: GitBranch,
          title: "Update Sheet",
          description: "Append validated requests to the master Google Sheet.",
        },
      ],
      problems: [
        "Manual leave tracking is error-prone",
        "Duplicate entries cause confusion",
        "Managers spend too much time verifying requests",
        "Employees face delays in approval notifications",
      ],
      useCases: [
        "HR teams automating employee leave management",
        "Small businesses managing leave without HR staff",
        "Organizations tracking sick leave trends over time",
        "Companies reducing errors in leave records",
        "Integrate the Gmail into Google Sheets for seamless data management",
      ],
    },
    {
      id: "invoice-validation",
      icon: ShieldCheck,
      iconColor: "text-orange-500 border-orange-500/20 bg-orange-500/5",
      badge: "Finance Bot",
      title: "Invoice Validation Portal",
      shortDescription:
        "Automated invoice processing, data extraction, and cross-department validation.",
      fullDescription:
        "Streamline invoice validation with automated extraction, notifications, and archiving.",
      image: "/invoice-validation-workflow.png",
      workflowUrl: "/invoiceValidation",
      isInternalRoute: true,
      steps: [
        {
          icon: FileText,
          title: "Upload Invoice",
          description:
            "Upload purchase receipt for warranty verification and product validation.",
        },
        {
          icon: Package,
          title: "Select Products",
          description:
            "Choose affected products and specify support type (warranty claim, troubleshooting, etc.).",
        },
        {
          icon: MessageSquare,
          title: "Describe Issue",
          description:
            "Provide detailed description of the problem and desired resolution.",
        },
        {
          icon: Mail,
          title: "Submit & Notify",
          description:
            "Submit claim and receive email confirmation with tracking details.",
        },
      ],
      problems: [
        "Manual invoice processing is slow and error-prone",
        "Difficulty ensuring cross-department validation",
        "Late approvals can delay payments",
        "High operational cost for finance teams",
      ],
      useCases: [
        "Finance teams automating invoice workflow",
        "Businesses tracking invoice approvals efficiently",
        "Accounting departments reducing manual errors",
        "Companies scaling finance operations without increasing headcount",
      ],
    },
    {
      id: "discord-integration",
      icon: DiscordIcon,
      iconColor: "text-indigo-500 border-indigo-500/20 bg-indigo-500/5",
      badge: "Community Bot",
      title: "Discord Chatbot Integration",
      shortDescription:
        "Intelligent Discord bot for community management and automated responses.",
      fullDescription:
        "Advanced Discord bot integration with AI-powered moderation, automated responses, and community engagement features.",
      workflowUrl: PAGES.DISCORD_URL,
      isInternalRoute: false,
      problems: [
        "Keeping track of gold, silver, stocks, and Forex prices in real-time is tedious.",
        "Manually checking loan rates from multiple Nepali banks is inefficient.",
        "Staying updated with reliable news from The Kathmandu Post requires browsing multiple sources.",
        "Investors and advisors lack a single platform that consolidates market data, bank loans, and news.",
        "Critical financial and political insights are often delayed, impacting timely decisions.",
      ],
      useCases: [
        "Investors and traders get instant updates on gold, silver, stocks, and Forex markets.",
        "Compare loan rates from various Nepali banks to make informed borrowing decisions.",
        "Receive daily verified news updates from The Kathmandu Post in Messenger.",
        "Financial advisors provide real-time guidance to clients using consolidated data.",
        "Students, professionals, and business owners track market trends and political news efficiently.",
      ],
    },
    {
      id: "telegram-integration",
      icon: TelegramIcon,
      iconColor: "text-sky-500 border-sky-500/20 bg-sky-500/5",
      badge: "Messaging Bot",
      title: "Telegram Chatbot Integration",
      shortDescription:
        "Smart Telegram bot for instant communication and automated customer support.",
      fullDescription:
        "Advanced Telegram bot integration with AI-powered responses, automated support, and seamless communication features for instant customer engagement.",
      workflowUrl: PAGES.TELEGRAM_URL,
      isInternalRoute: false,
      problems: [
        "Keeping track of gold, silver, stocks, and Forex prices in real-time is tedious.",
        "Manually checking loan rates from multiple Nepali banks is inefficient.",
        "Staying updated with reliable news from The Kathmandu Post requires browsing multiple sources.",
        "Investors and advisors lack a single platform that consolidates market data, bank loans, and news.",
        "Critical financial and political insights are often delayed, impacting timely decisions.",
      ],
      useCases: [
        "Investors and traders get instant updates on gold, silver, stocks, and Forex markets.",
        "Compare loan rates from various Nepali banks to make informed borrowing decisions.",
        "Receive daily verified news updates from The Kathmandu Post in Messenger.",
        "Financial advisors provide real-time guidance to clients using consolidated data.",
        "Students, professionals, and business owners track market trends and political news efficiently.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans mx-auto max-w-7xl px-8">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-60 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <a
              href="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-600">
                Rumsan Automations
              </span>
            </a>
          </div>
        </div>
      </nav>

      <main className="w-full px-4 pt-24 pb-8 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
            Intelligent Workflow Solutions
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl leading-relaxed">
            Enterprise-grade n8n automations integrated with cutting-edge AI for
            seamless business operations.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {workflows.map((workflow) => (
            <Card
              key={workflow.id}
              className="group bg-linear-to-br from-white to-slate-50 border-slate-200 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 relative overflow-hidden flex flex-col"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute top-0 right-0 p-4 z-10">
                <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-400 ring-1 ring-inset ring-blue-500/30 backdrop-blur-sm">
                  {workflow.badge}
                </span>
              </div>

              <CardHeader className="p-6 relative z-10 grow">
                <div className="mb-4 transform group-hover:scale-110 transition-transform duration-500">
                  <WorkflowIcon
                    icon={workflow.icon}
                    colorClass={workflow.iconColor}
                  />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 leading-tight mb-3 group-hover:text-blue-900 transition-colors">
                  {workflow.title}
                </CardTitle>
                <CardDescription className="text-sm text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">
                  {workflow.shortDescription}
                </CardDescription>
              </CardHeader>

              <CardContent className="px-6 pb-6 relative z-10 mt-auto">
                <Button
                  className="w-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 border-0 text-white h-11 text-sm font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 group/btn"
                  onClick={() => setExpandedWorkflow(workflow.id)}
                >
                  Explore Workflow
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      {/*
            description section
            */}
      {/* Expanded Workflow Modal */}
      {expandedWorkflow && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xl z-50 flex items-start justify-center p-4 pt-16 ">
          <Card className="h-[95vh] w-full max-w-4xl relative bg-white border-slate-200 shadow-2xl overflow-y-auto rounded-xl ">
            <button
              onClick={() => setExpandedWorkflow(null)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors z-20 bg-white/80 backdrop-blur-sm shadow-sm"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>
            <CardHeader className="px-6 sm:px-8 pt-6 sm:pt-8 pb-2 sm:pb-3">
              <div className="flex items-center gap-4 mb-4 ">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-semibold ring-1 ring-blue-500/20">
                  {workflows.find((w) => w.id === expandedWorkflow)?.badge}
                </span>
              </div>
              <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
                {workflows.find((w) => w.id === expandedWorkflow)?.title}
              </CardTitle>
              <CardDescription className="text-base sm:text-lg lg:text-xl mt-4 text-slate-600 leading-relaxed">
                {
                  workflows.find((w) => w.id === expandedWorkflow)
                    ?.fullDescription
                }
              </CardDescription>
            </CardHeader>

            <CardContent
              className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 space-y-4 -mt-2 sm:-mt-3
            "
            >
              {/* Problems & Use Cases for all workflows */}
              {(workflows.find((w) => w.id === expandedWorkflow)?.problems
                ?.length ?? 0) > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    Problems
                  </h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600">
                    {workflows
                      .find((w) => w.id === expandedWorkflow)
                      ?.problems.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                  </ul>
                </div>
              )}

              {(workflows.find((w) => w.id === expandedWorkflow)?.useCases
                ?.length ?? 0) > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    Use Cases
                  </h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600">
                    {workflows
                      .find((w) => w.id === expandedWorkflow)
                      ?.useCases?.map((u, idx) => (
                        <li key={idx}>{u}</li>
                      ))}
                  </ul>
                </div>
              )}

              {/* Key Steps */}
              {(workflows.find((w) => w.id === expandedWorkflow)?.steps
                ?.length ?? 0) > 0 && (
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
                    User Manual Steps
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2">
                    {workflows
                      .find((w) => w.id === expandedWorkflow)
                      ?.steps?.map((step, idx) => {
                        const StepIcon = step.icon;
                        return (
                          <div
                            key={idx}
                            className="flex gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50"
                          >
                            <div className="h-8 w-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                              <StepIcon className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 text-sm">{`${
                                idx + 1
                              }. ${step.title}`}</p>
                              <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Launch Button */}
              {workflows.find((w) => w.id === expandedWorkflow)
                ?.workflowUrl && (
                <Button
                  size="lg"
                  className="w-full h-12 sm:h-14 lg:h-16 text-base sm:text-lg lg:text-xl font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all duration-200"
                  asChild
                >
                  <a
                    href={
                      workflows.find((w) => w.id === expandedWorkflow)
                        ?.workflowUrl
                    }
                    target={
                      workflows.find((w) => w.id === expandedWorkflow)
                        ?.isInternalRoute
                        ? "_self"
                        : "_blank"
                    }
                    rel={
                      workflows.find((w) => w.id === expandedWorkflow)
                        ?.isInternalRoute
                        ? undefined
                        : "noopener noreferrer"
                    }
                  >
                    Launch Live Portal
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default HomePage;
