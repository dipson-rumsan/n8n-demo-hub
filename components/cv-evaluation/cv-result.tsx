"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  AlertCircle,
  Award,
  MapPin,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Briefcase,
  Calendar,
  FileText,
} from "lucide-react";
import { MarkdownRenderer } from "./markdown-renderer";
import type { ParsedData } from "./types";

interface Props {
  data: ParsedData;
}

export function CVResult({ data }: Props) {
  const experiences = data.experience ?? [];

  return (
    <div className="space-y-0.5">
      <div className="grid gap-0.5">
        {data.personalInfo && (
          <Card className="border-slate-200 shadow-lg bg-white">
            <CardHeader className="border-b border-slate-200 bg-slate-50 py-3">
              <CardTitle className="flex items-center gap-2 text-slate-900 text-sm">
                <div className="p-1.5 bg-slate-100 rounded-lg">
                  <MapPin className="w-4 h-4 text-slate-700" />
                </div>
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.personalInfo.name && (
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {data.personalInfo.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">{data.personalInfo.name}</div>
                      <div className="text-xs text-slate-600">Full Name</div>
                    </div>
                  </div>
                )}
                {data.personalInfo.email && (
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                    <Mail className="w-4 h-4 text-slate-600" />
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">{data.personalInfo.email}</div>
                      <div className="text-xs text-slate-600">Email Address</div>
                    </div>
                  </div>
                )}
                {data.personalInfo.phone && (
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                    <Phone className="w-4 h-4 text-slate-600" />
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">{data.personalInfo.phone}</div>
                      <div className="text-xs text-slate-600">Phone Number</div>
                    </div>
                  </div>
                )}
                {data.personalInfo.location && (
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                    <MapPin className="w-4 h-4 text-slate-600" />
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">{data.personalInfo.location}</div>
                      <div className="text-xs text-slate-600">Location</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {data.skills && data.skills.length > 0 && (
          <Card className="border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-green-100 bg-linear-to-r from-green-50 to-emerald-50 py-3">
              <CardTitle className="flex items-center gap-2 text-green-900 text-sm">
                <div className="p-1.5 bg-green-100 rounded-lg">
                  <Award className="w-4 h-4 text-green-600" />
                </div>
                Skills & Competencies
                <Badge className="ml-2 bg-green-100 text-green-700 text-xs">{data.skills.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 pb-3">
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-linear-to-r from-green-100 to-emerald-100 text-green-800 hover:from-green-200 hover:to-emerald-200 px-2 py-1 text-xs shadow-sm hover:shadow-md transition-all duration-300 border border-green-200"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {experiences.length > 0 && (
          <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-blue-100 bg-linear-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                Work Experience
                <Badge className="ml-2 bg-blue-100 text-blue-700">{experiences.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {experiences.map((exp, index) => (
                <div
                  key={index}
                  className="bg-linear-to-r from-white to-blue-50 rounded-xl p-5 border-l-4 border-blue-500 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-xl text-blue-900 mb-2">
                        {exp.position || "Position Not Specified"}
                      </h4>
                      <div className="flex items-center gap-2 text-blue-700">
                        <div className="p-1 bg-blue-100 rounded">
                          <Building className="w-4 h-4" />
                        </div>
                        <span className="font-semibold">{exp.company || "Company Not Specified"}</span>
                      </div>
                    </div>
                    {exp.duration && (
                      <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50 px-3 py-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {exp.duration}
                      </Badge>
                    )}
                  </div>
                  {exp.description && (
                    <div className="bg-white rounded-lg p-4 mt-3 border border-blue-100 shadow-sm">
                      <p className="text-sm text-slate-700 leading-relaxed">{exp.description}</p>
                    </div>
                  )}
                  {index < experiences.length - 1 && <Separator className="mt-6 bg-blue-200" />}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {data.education && data.education.length > 0 && (
          <Card className="border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-purple-100 bg-linear-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                </div>
                Education
                <Badge className="ml-2 bg-purple-100 text-purple-700">{data.education.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {data.education.map((edu, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-5 bg-linear-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-300 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-linear-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center shadow-md">
                    <GraduationCap className="w-7 h-7 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-lg text-purple-900">{edu.degree || "Degree Not Specified"}</div>
                    <div className="text-sm text-purple-700 font-medium mt-1">
                      {edu.institution || "Institution Not Specified"}
                    </div>
                  </div>
                  {edu.year && (
                    <Badge className="bg-purple-100 text-purple-800 border border-purple-300 px-3 py-1 text-sm">
                      {edu.year}
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {data.evaluation && (
          <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-slate-200 bg-linear-to-r from-slate-50 to-blue-50 py-2">
              <CardTitle className="flex items-center gap-2 text-slate-800 text-sm">
                <div className="p-1.5 bg-slate-100 rounded-lg">
                  <FileText className="w-4 h-4 text-slate-600" />
                </div>
                Evaluation Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 pt-1 pb-0">
              {data.evaluation.decision && (
                <div
                  className={`p-2 rounded-lg border-2 shadow-sm ${
                    data.evaluation.decision === "Accept"
                      ? "bg-linear-to-r from-green-50 to-emerald-50 border-green-300"
                      : "bg-linear-to-r from-red-50 to-rose-50 border-red-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded-full ${
                        data.evaluation.decision === "Accept" ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {data.evaluation.decision === "Accept" ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <h3
                      className={`text-base font-bold ${
                        data.evaluation.decision === "Accept" ? "text-green-900" : "text-red-900"
                      }`}
                    >
                      Decision: {data.evaluation.decision || "Pending"}
                    </h3>
                  </div>
                </div>
              )}

              {data.evaluation.evaluationReasons && (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <MarkdownRenderer content={data.evaluation.evaluationReasons} />
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
