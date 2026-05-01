import type { ComponentType } from "react";

export interface WorkflowStep {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

export interface Workflow {
  id: string;
  icon: ComponentType<{ className?: string }>;
  iconColor: string;
  badge: string;
  title: string;
  status?: string;
  shortDescription: string;
  fullDescription: string;
  workflowUrl?: string;
  isInternalRoute?: boolean;
  image?: string;
  dateCreated: Date;
  steps?: WorkflowStep[];
  problems: string[];
  useCases: string[];
  isHidden?: boolean;
}

export interface StatusDetails {
  color: string;
  dot: string;
  label: string;
}
