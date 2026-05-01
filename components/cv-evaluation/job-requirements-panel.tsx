"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase } from "lucide-react";
import { JOB_POSITIONS } from "./constants";

interface Props {
  selectedJobPosition: string;
  onSelectPosition: (value: string) => void;
}

export function JobRequirementsPanel({ selectedJobPosition, onSelectPosition }: Props) {
  return (
    <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-h-125 min-h-100 overflow-hidden flex flex-col">
      <CardHeader className="bg-linear-to-r from-blue-600 via-blue-700 to-indigo-600 shrink-0 py-1.5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
        <div className="relative flex items-center gap-2">
          <div className="p-1 bg-white/20 backdrop-blur-sm rounded-lg">
            <Briefcase className="w-3 h-3 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-white text-sm font-bold leading-tight">
              {JOB_POSITIONS.find((p) => p.id === selectedJobPosition)?.title || "Job Requirements"}
            </CardTitle>
            <CardDescription className="text-blue-100 text-[10px] font-medium">
              {selectedJobPosition ? "Review requirements below" : "Select position to begin"}
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
              <p className="text-sm text-slate-600 mb-1">Select the role you're applying for</p>
            </div>
          </div>
          <Select value={selectedJobPosition} onValueChange={onSelectPosition}>
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

        <div className="space-y-1">
          {selectedJobPosition ? (
            JOB_POSITIONS.find((p) => p.id === selectedJobPosition)?.requirements.map((req, index) => (
              <div
                key={index}
                className="flex gap-2 items-start p-2 bg-white rounded border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200"
              >
                <div className="w-2 h-2 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 mt-1.5 shrink-0" />
                <p className="text-sm text-slate-800 leading-relaxed">{req}</p>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center py-4 text-slate-400">
              <div className="text-center">
                <Briefcase className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                <p className="text-sm font-medium">Please select a job position above</p>
                <p className="text-xs mt-0.5">Requirements will appear here</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
