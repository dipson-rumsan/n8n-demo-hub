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
} from "lucide-react"
import Image from "next/image"
import { useState } from "react"

const WorkflowIcon = ({ icon: Icon, colorClass }: { icon: any; colorClass: string }) => (
  <div className={`h-12 w-12 rounded-xl border flex items-center justify-center ${colorClass}`}>
    <Icon className="h-6 w-6" />
  </div>
)

function HomePage() {
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null)

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
      steps: [
        { icon: Facebook, title: "Connect to Messenger", description: "Seamlessly connect via Facebook Messenger webhook." },
        { icon: TrendingUp, title: "Track Market Data", description: "Instantly access real-time gold, silver, stock, and Forex prices." },
        { icon: Newspaper, title: "Get Latest News", description: "Receive verified updates from The Kathmandu Post directly in Messenger." },
        { icon: Landmark, title: "Compare Loan Rates", description: "Check and compare current loan rates from multiple Nepali banks easily." },
      ],
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
        { icon: FileText, title: "Upload Resumes", description: "Securely upload CVs through the portal." },
        { icon: Zap, title: "AI Evaluation", description: "Automatically assess skills, experience, and match to job requirements." },
        { icon: CheckCircle2, title: "Generate Reports", description: "Create detailed scorecards for each candidate." },
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
        { icon: FileText, title: "Receive Invoices", description: "Invoices are captured via webhook." },
        { icon: Zap, title: "Extract Data", description: "Use AI to automatically extract key invoice information." },
        { icon: Mail, title: "Notify Departments", description: "Send notifications to relevant teams for validation." },
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
    <div className="min-h-screen bg-[#020617] text-slate-50 font-sans mx-auto max-w-7xl px-8">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-60 border-b border-slate-800 bg-[#020617]/80 backdrop-blur-md">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
                Rumsan Automations
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="w-full px-4 py-30 sm:px-6 lg:px-8">
        <div className="mb-20">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-4xl mb-4">
            Intelligent Workflow Solutions
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl leading-relaxed">
            Enterprise-grade n8n automations integrated with cutting-edge AI for seamless business operations.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {workflows.map((workflow) => (
            <Card
              key={workflow.id}
              className="group bg-[#030712] border-slate-800/50 hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden h-110"
            >
              <div className="absolute top-0 right-0 p-6">
                <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20">
                  {workflow.badge}
                </span>
              </div>
              <CardHeader className="p-8">
                <WorkflowIcon icon={workflow.icon} colorClass={workflow.iconColor} />
                <CardTitle className="mt-6 text-3xl font-bold text-white leading-tight">{workflow.title}</CardTitle>
                <CardDescription className="text-lg text-slate-400 mt-4 leading-relaxed">
                  {workflow.shortDescription}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <Button
                  className="w-full bg-[#030712] border border-slate-800 hover:bg-slate-800 text-white h-14 text-lg font-medium group-hover:border-slate-700 transition-colors"
                  onClick={() => setExpandedWorkflow(workflow.id)}
                >
                  Explore <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Expanded Workflow Modal */}
      {expandedWorkflow && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 mt-10">
          <Card className="max-h-[90vh] w-full max-w-4xl overflow-y-auto relative bg-[#020617] border-slate-800 shadow-2xl">
            <button
              onClick={() => setExpandedWorkflow(null)}
              className="absolute top-6 right-6 p-2 hover:bg-slate-800 rounded-full transition-colors z-10"
            >
              <X className="h-6 w-6 text-slate-400" />
            </button>
            <CardHeader className="p-10 border-b border-slate-800">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold ring-1 ring-blue-500/20">
                  {workflows.find((w) => w.id === expandedWorkflow)?.badge}
                </span>
              </div>
              <CardTitle className="text-4xl font-bold text-white">
                {workflows.find((w) => w.id === expandedWorkflow)?.title}
              </CardTitle>
              <CardDescription className="text-xl mt-4 text-slate-400 leading-relaxed">
                {workflows.find((w) => w.id === expandedWorkflow)?.fullDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-12">
              
              {/* Problems & Use Cases for all workflows */}
              {(workflows.find((w) => w.id === expandedWorkflow)?.problems?.length ?? 0) > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Problems</h3>
                  <ul className="list-disc pl-6 space-y-2 text-slate-400">
                    {workflows.find((w) => w.id === expandedWorkflow)?.problems.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {(workflows.find((w) => w.id === expandedWorkflow)?.useCases?.length ?? 0) > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Use Cases</h3>
                  <ul className="list-disc pl-6 space-y-2 text-slate-400">
                    {workflows.find((w) => w.id === expandedWorkflow)?.useCases.map((u, idx) => (
                      <li key={idx}>{u}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Steps */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">User Manual Steps</h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  {workflows
                    .find((w) => w.id === expandedWorkflow)
                    ?.steps.map((step, idx) => {
                      const StepIcon = step.icon
                      return (
                        <div key={idx} className="flex gap-5 p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
                          <div className="h-12 w-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                            <StepIcon className="h-6 w-6 text-blue-400" />
                          </div>
                          <div>
                            <p className="font-bold text-white text-lg">{`${idx + 1}. ${step.title}`}</p>
                            <p className="text-slate-400 mt-1 leading-relaxed">{step.description}</p>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>

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

// Sick Leave Form Page Component
function SickLeaveFormPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-8 text-balance">Employee Sick Leave Request</h1>
        <SickLeaveForm />
      </div>
    </main>
  )
}

// Export the main component as default
export default HomePage

// Export the SickLeaveFormPage as a named export if needed elsewhere
export { SickLeaveFormPage }
