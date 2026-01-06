"use client"

import { Button } from "@/components/ui/button"
import { SickLeaveForm } from "@/components/contact-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
} from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import React from "react"

const WorkflowIcon = ({ icon: Icon, colorClass }: { icon: any; colorClass: string }) => (
  <div className={`h-12 w-12 rounded-xl border flex items-center justify-center ${colorClass}`}>
    <Icon className="h-6 w-6" />
  </div>
)

function HomePage() {
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null)

  // Prevent background scrolling when modal is open
  React.useEffect(() => {
    if (expandedWorkflow) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [expandedWorkflow])

  const workflows = [
    {
      id: "askbhunte",
      icon: Facebook,
      iconColor: "text-green-500 border-green-500/20 bg-green-500/5",
      badge: "Real-time AI",
      title: "AskBhunte AI Chatbot",
      shortDescription: "Your all-in-one Facebook AI assistant for real-time market updates, loans, and news.",
      fullDescription:
        "AskBhunte is a multimodal AI assistant integrated with Facebook Messenger. It delivers real-time updates on Forex, Stocks, Gold/Silver prices, Nepalese bank loan rates, and the latest news from The Kathmandu Post — all in one conversational interface.",
      workflowUrl: "https://www.facebook.com/askbhunte",
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
      shortDescription: "AI-powered resume analysis and intelligent candidate evaluation with instant reports.",
      fullDescription: "Automatically evaluate CVs using AI. Extract information, score candidates, and generate detailed reports.",
      workflowUrl: "/cvEvaluation",
      isInternalRoute: true,
      steps: [
        { icon: CheckCircle2, title: "Select Job Position", description: "Choose the job role and requirements for candidate evaluation." },
        { icon: FileText, title: "Upload Resumes", description: "Securely upload CVs through the portal." },
        { icon: Zap, title: "AI Evaluation", description: "Automatically assess skills, experience, and match to job requirements." },
        { icon: Mail, title: "Generate Reports", description: "Create detailed scorecards for each candidate." },
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
      shortDescription: "Automated leave request processing with Google Sheets sync and duplicate detection.",
      fullDescription:
        "Manage employee sick leave requests automatically. Validates duplicates, formats data, and archives entries in Google Sheets.",
      image: "/images/image.png",
      workflowUrl: "/sickLeave",
      isInternalRoute: true,
      steps: [
        { icon: FileText, title: "Form Submission", description: "Receive leave requests from employees via a web form." },
        { icon: Sheet, title: "Check Duplicates", description: "Verify if the leave request already exists in the sheet." },
        { icon: Code, title: "Process Request", description: "Format and validate data for proper record-keeping." },
        { icon: GitBranch, title: "Update Sheet", description: "Append validated requests to the master Google Sheet." },
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
      shortDescription: "Automated invoice processing, data extraction, and cross-department validation.",
      fullDescription:
        "Streamline invoice validation with automated extraction, notifications, and archiving.",
      image: "/invoice-validation-workflow.png",
      workflowUrl: "/invoiceValidation",
      isInternalRoute: true,
      steps: [
        { icon: FileText, title: "Upload Invoice", description: "Upload purchase receipt for warranty verification and product validation." },
        { icon: Package, title: "Select Products", description: "Choose affected products and specify support type (warranty claim, troubleshooting, etc.)." },
        { icon: MessageSquare, title: "Describe Issue", description: "Provide detailed description of the problem and desired resolution." },
        { icon: Mail, title: "Submit & Notify", description: "Submit claim and receive email confirmation with tracking details." },
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
  ]

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans mx-auto max-w-7xl px-8">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-60 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer">
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

      <main className="w-full px-4 py-30 sm:px-6 lg:px-8">
        <div className="mb-20">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
            Intelligent Workflow Solutions
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl leading-relaxed">
            Enterprise-grade n8n automations integrated with cutting-edge AI for seamless business operations.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {workflows.map((workflow) => (
            <Card
              key={workflow.id}
              className="group bg-linear-to-br from-white to-slate-50 border-slate-200 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 relative overflow-hidden flex flex-col"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute top-0 right-0 p-6 z-10">
                <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-400 ring-1 ring-inset ring-blue-500/30 backdrop-blur-sm">
                  {workflow.badge}
                </span>
              </div>
              
              <CardHeader className="p-8 relative z-10 grow">
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-500">
                  <WorkflowIcon icon={workflow.icon} colorClass={workflow.iconColor} />
                </div>
                <CardTitle className="text-3xl font-bold text-slate-900 leading-tight mb-4 group-hover:text-blue-900 transition-colors">
                  {workflow.title}
                </CardTitle>
                <CardDescription className="text-base text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">
                  {workflow.shortDescription}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-8 pb-8 relative z-10 mt-auto">
                <Button
                  className="w-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 border-0 text-white h-12 text-base font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 group/btn"
                  onClick={() => setExpandedWorkflow(workflow.id)}
                >
                  Explore Workflow 
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Expanded Workflow Modal */}
      {expandedWorkflow && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xl z-50 flex items-center justify-center p-4 mt-10">
          <Card className="h-[90vh] w-full max-w-4xl relative bg-white border-slate-200 shadow-2xl overflow-y-auto">
            <button
              onClick={() => setExpandedWorkflow(null)}
              className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors z-10"
            >
              <X className="h-6 w-6 text-slate-600" />
            </button>
            <CardHeader className="p-10 border-b border-slate-200">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-semibold ring-1 ring-blue-500/20">
                  {workflows.find((w) => w.id === expandedWorkflow)?.badge}
                </span>
              </div>
              <CardTitle className="text-4xl font-bold text-slate-900">
                {workflows.find((w) => w.id === expandedWorkflow)?.title}
              </CardTitle>
              <CardDescription className="text-xl mt-4 text-slate-600 leading-relaxed">
                {workflows.find((w) => w.id === expandedWorkflow)?.fullDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              
              {/* Problems & Use Cases for all workflows */}
              {(workflows.find((w) => w.id === expandedWorkflow)?.problems?.length ?? 0) > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Problems</h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600">
                    {workflows.find((w) => w.id === expandedWorkflow)?.problems.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {(workflows.find((w) => w.id === expandedWorkflow)?.useCases?.length ?? 0) > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Use Cases</h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600">
                    {workflows.find((w) => w.id === expandedWorkflow)?.useCases.map((u, idx) => (
                      <li key={idx}>{u}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Steps */}
              {(workflows.find((w) => w.id === expandedWorkflow)?.steps?.length ?? 0) > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">User Manual Steps</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {workflows
                      .find((w) => w.id === expandedWorkflow)
                      ?.steps?.map((step, idx) => {
                        const StepIcon = step.icon
                        return (
                          <div key={idx} className="flex gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
                            <div className="h-8 w-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                              <StepIcon className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 text-sm">{`${idx + 1}. ${step.title}`}</p>
                              <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">{step.description}</p>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}

              {/* Launch Button */}
              {workflows.find((w) => w.id === expandedWorkflow)?.workflowUrl && (
                <Button
                  size="lg"
                  className="w-full h-16 text-xl font-semibold bg-blue-600 hover:bg-blue-500 text-white"
                  asChild
                >
                  <a
                    href={workflows.find((w) => w.id === expandedWorkflow)?.workflowUrl}
                    target={
                      workflows.find((w) => w.id === expandedWorkflow)?.isInternalRoute
                        ? "_self"
                        : "_blank"
                    }
                    rel={
                      workflows.find((w) => w.id === expandedWorkflow)?.isInternalRoute
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
  )
}

export default HomePage
