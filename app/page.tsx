"use client";

import { useState, useEffect } from "react";
import { workflows } from "@/constants/workflows";
import { useHealthStatus } from "@/hooks/use-health-status";
import { Navbar } from "@/components/home/navbar";
import { HeroSection } from "@/components/home/hero-section";
import { WorkflowCard } from "@/components/home/workflow-card";
import { WorkflowModal } from "@/components/home/workflow-modal";

function HomePage() {
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null);
  const dynamicStatuses = useHealthStatus();

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (expandedWorkflow) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [expandedWorkflow]);

  // Merge dynamic statuses and sort by latest first
  const sortedWorkflows = workflows
    .filter((w) => !w.isHidden)
    .map((w) => ({
      ...w,
      status: dynamicStatuses[w.id] || w.status || "operational",
    }))
    .sort(
      (a, b) =>
        new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
    );

  const activeWorkflow = sortedWorkflows.find(
    (w) => w.id === expandedWorkflow
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Navbar />

      <main className="w-full px-4 pt-24 pb-8 sm:px-6 lg:px-8">
        <HeroSection />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedWorkflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onExpand={setExpandedWorkflow}
            />
          ))}
        </div>
      </main>

      {expandedWorkflow && (
        <WorkflowModal
          workflow={activeWorkflow}
          expandedWorkflowId={expandedWorkflow}
          onClose={() => setExpandedWorkflow(null)}
        />
      )}
    </div>
  );
}

export default HomePage;
