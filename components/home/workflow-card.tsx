import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WorkflowIcon } from "@/components/home/workflow-icon";
import type { Workflow } from "@/components/home/types";

interface WorkflowCardProps {
  workflow: Workflow & { status: string };
  onExpand: (id: string) => void;
}

export const WorkflowCard = ({ workflow, onExpand }: WorkflowCardProps) => (
  <Card className="group bg-linear-to-br from-white to-slate-50 border-slate-200 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 relative overflow-hidden flex flex-col">
    {/* Gradient overlay on hover */}
    <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    <div className="absolute top-0 right-0 p-4 z-10">
      <span className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 ring-inset backdrop-blur-sm bg-blue-500/10 text-blue-600 ring-blue-500/30 transition-all duration-300">
        <div className="relative flex h-2 w-2 shrink-0">
          {workflow.status !== "operational" && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              workflow.status === "operational"
                ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
            }`}
          ></span>
        </div>
        {workflow.badge}
      </span>
    </div>

    <CardHeader className="p-5 sm:p-6 relative z-10 grow">
      <div className="mb-4 transform group-hover:scale-110 transition-transform duration-500">
        <WorkflowIcon icon={workflow.icon} colorClass={workflow.iconColor} />
      </div>
      <CardTitle className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight mb-2 sm:mb-3 group-hover:text-blue-900 transition-colors">
        {workflow.title}
      </CardTitle>
      <CardDescription className="text-xs sm:text-sm text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">
        {workflow.shortDescription}
      </CardDescription>
    </CardHeader>

    <CardContent className="px-5 sm:px-6 pb-5 sm:pb-6 relative z-10 mt-auto">
      <Button
        className="w-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 border-0 text-white h-11 text-sm font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 group/btn cursor-pointer"
        onClick={() => onExpand(workflow.id)}
      >
        Explore Workflow
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
      </Button>
    </CardContent>
  </Card>
);
