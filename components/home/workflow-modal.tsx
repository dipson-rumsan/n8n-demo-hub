import { ArrowRight, X, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Workflow } from "@/components/home/types";

interface WorkflowModalProps {
  workflow: (Workflow & { status: string }) | undefined;
  expandedWorkflowId: string;
  onClose: () => void;
}

export const WorkflowModal = ({
  workflow,
  expandedWorkflowId,
  onClose,
}: WorkflowModalProps) => {
  if (!workflow) return null;

  const isOperational = workflow.status === "operational";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4 md:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <Card className="w-full max-w-4xl max-h-[90vh] relative z-10 bg-white border-slate-200 shadow-2xl overflow-y-auto rounded-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors z-20 bg-white/80 backdrop-blur-sm shadow-sm"
        >
          <X className="h-5 w-5 text-slate-600" />
        </button>
        <CardHeader className="px-5 sm:px-8 pt-6 sm:pt-8 pb-2 sm:pb-3">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold ring-1 ring-inset backdrop-blur-sm bg-blue-500/10 text-blue-600 ring-blue-500/30 transition-all duration-300">
              <div className="relative flex h-2 w-2 shrink-0">
                {!isOperational && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${isOperational
                      ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                      : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                    }`}
                ></span>
              </div>
              {workflow.badge}
            </span>
          </div>
          <CardTitle className="text-xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
            {workflow.title}
          </CardTitle>
          <CardDescription className="text-sm sm:text-lg lg:text-xl mt-3 sm:mt-4 text-slate-600 leading-relaxed">
            {workflow.fullDescription}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-5 sm:px-8 pb-6 sm:pb-8 space-y-5 sm:space-y-8 mt-2 sm:mt-4">
          {/* Problems */}
          {(workflow.problems?.length ?? 0) > 0 && (
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 sm:mb-3">
                Problems
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600">
                {workflow.problems.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Use Cases */}
          {(workflow.useCases?.length ?? 0) > 0 && (
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 sm:mb-3">
                Use Cases
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600">
                {workflow.useCases?.map((u, idx) => (
                  <li key={idx}>{u}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Demo Video Placeholder */}
          <div className="mt-6 sm:mt-8">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">
              Product Demo
            </h3>
            <div className="relative aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xl group">
              {expandedWorkflowId === "ai-quiz" ? (
                <iframe
                  className="w-full h-full"
                  src="https://drive.google.com/file/d/1K6R2zoAn7jT4iv-KZYKefg4r8emUdlTE/preview"
                  title="AI Quiz Demo Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              ) : expandedWorkflowId === "invoice-validation" ? (
                <iframe
                  className="w-full h-full"
                  src="https://drive.google.com/file/d/1myreoB0qLbeelmOmzvX7mll7CD2MFRoO/preview"
                  title="Invoice Validation Demo Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              ) : expandedWorkflowId === "cv-evaluation" ? (
                <iframe
                  className="w-full h-full"
                  src="https://drive.google.com/file/d/1_QLTHsJA9VFsT9h5HDGCJVaHEBVLzvtt/preview"
                  title="CV Evaluation Demo Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              ) : expandedWorkflowId === "vox-flow" ? (
                <iframe
                  className="w-full h-full"
                  src="https://drive.google.com/file/d/16uCAlIBkNMd_gHdUv443rUOcmvt482WP/preview"
                  title="Voxflow Demo Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              ) : expandedWorkflowId === "community-tool" ? (
                <iframe
                  className="w-full h-full"
                  src="https://drive.google.com/file/d/1__jnuM-C3DT6KaTeVmtODl5q_-9f2DLC/preview"
                  title="Community Tool Demo Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              ) : (
                <>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/40 group-hover:scale-110 transition-transform">
                      <Volume2 className="h-6 w-6 sm:h-8 sm:w-8 text-white fill-current ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-linear-to-t from-slate-900/80 to-transparent">
                    <p className="text-white text-xs sm:text-sm font-bold">
                      Watch {workflow.title} Demo
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Key Steps */}
          {(workflow.steps?.length ?? 0) > 0 && (
            <div>
              <h3 className="text-base sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4">
                User Manual Steps
              </h3>
              <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2">
                {workflow.steps?.map((step, idx) => {
                  const StepIcon = step.icon;
                  return (
                    <div
                      key={idx}
                      className="flex gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg border border-slate-200 bg-slate-50"
                    >
                      <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                        <StepIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs sm:text-sm">{`${
                          idx + 1
                        }. ${step.title}`}</p>
                        <p className="text-slate-600 text-[10px] sm:text-xs mt-0.5 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Launch Button Area */}
          <div className="pt-5 sm:pt-6 border-t border-slate-100">
            {isOperational &&
              workflow.workflowUrl &&
              expandedWorkflowId !== "gmail-application" && (
                <Button
                  size="lg"
                  className="w-full h-12 sm:h-16 text-sm sm:text-lg font-bold bg-linear-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-xl shadow-blue-500/25 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 sm:gap-3"
                  asChild
                >
                  <a
                    href={workflow.workflowUrl}
                    target={workflow.isInternalRoute ? "_self" : "_blank"}
                    rel={
                      workflow.isInternalRoute
                        ? undefined
                        : "noopener noreferrer"
                    }
                  >
                    Launch Live Portal
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </a>
                </Button>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
