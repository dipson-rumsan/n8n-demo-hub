import type { ComponentType } from "react";

interface WorkflowIconProps {
  icon: ComponentType<{ className?: string }>;
  colorClass: string;
}

export const WorkflowIcon = ({ icon: Icon, colorClass }: WorkflowIconProps) => (
  <div
    className={`h-12 w-12 rounded-xl border flex items-center justify-center ${colorClass}`}
  >
    <Icon className="h-6 w-6" />
  </div>
);
