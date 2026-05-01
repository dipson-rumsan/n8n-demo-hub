import type { StatusDetails } from "@/components/home/types";

export const getStatusDetails = (status: string | undefined): StatusDetails => {
  switch (status) {
    case "operational":
      return {
        color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        dot: "bg-emerald-500",
        label: "Operational",
      };
    case "degraded":
      return {
        color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        dot: "bg-amber-500",
        label: "Degraded",
      };
    case "outage":
      return {
        color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
        dot: "bg-rose-500",
        label: "Outage",
      };
    default:
      return {
        color: "text-slate-400 bg-slate-400/10 border-slate-400/20",
        dot: "bg-slate-400",
        label: "Unknown",
      };
  }
};
