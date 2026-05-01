"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, Download, ArrowLeft } from "lucide-react";
import type { UploadedFile } from "./types";
import { CVResult } from "./cv-result";
import { downloadPreviewData } from "./utils";

interface Props {
  files: UploadedFile[];
  onBack: () => void;
}

export function CVResultsView({ files, onBack }: Props) {
  return (
    <div className="w-full">
      <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300 max-h-[calc(100vh-200px)] overflow-hidden flex flex-col">
        <CardHeader className="bg-linear-to-r from-purple-600 via-purple-700 to-indigo-600 py-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={onBack}
                variant="ghost"
                size="sm"
                className="p-2 bg-white/20 hover:bg-white/30 text-white border-none transition-all rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-xl font-bold">AI Analysis Results</CardTitle>
                <CardDescription className="text-purple-100 text-sm font-medium mt-1">
                  Comprehensive evaluation and insights
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              {files.map((file) => (
                <Button
                  key={file.id}
                  onClick={() => downloadPreviewData(file)}
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/20 hover:border-white/40 transition-all"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 overflow-y-auto flex-1">
          <div className="space-y-2">
            {files.map((file) => (
              <div key={file.id}>
                <div className="mb-1 p-1.5 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 text-sm">📄 {file.file.name}</h4>
                </div>
                {file.parsedData ? (
                  <CVResult data={file.parsedData} />
                ) : (
                  <div className="p-3 bg-slate-50 rounded-lg text-slate-600">
                    No analysis data available for this file
                  </div>
                )}
                {files.length > 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
