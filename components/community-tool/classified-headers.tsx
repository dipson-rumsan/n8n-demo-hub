import React from "react";
import { Search, Download, Minimize2, Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClassifiedHeader } from "./schema";

interface ClassifiedHeadersProps {
    classifiedHeaders: ClassifiedHeader[];
    filteredHeaders: ClassifiedHeader[];
    isHeadersMaximized: boolean;
    isMaximized: boolean;
    headerSearchTerm: string;
    setHeaderSearchTerm: (term: string) => void;
    downloadHeadersCSV: () => void;
    toggleHeadersMaximize: () => void;
    setIsHeadersMaximized: (max: boolean) => void;
}

export const ClassifiedHeaders: React.FC<ClassifiedHeadersProps> = ({
    classifiedHeaders,
    filteredHeaders,
    isHeadersMaximized,
    isMaximized,
    headerSearchTerm,
    setHeaderSearchTerm,
    downloadHeadersCSV,
    toggleHeadersMaximize,
    setIsHeadersMaximized
}) => {
    if (!classifiedHeaders || classifiedHeaders.length === 0 || isMaximized) return null;

    return (
        <section className={`
            ${isHeadersMaximized
                ? 'fixed top-14 inset-x-0 bottom-0 z-100 bg-[#f8fafc] dark:bg-[#020617] h-screen overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300 pt-4 pb-12 px-6 lg:px-10'
                : 'space-y-4 animate-in fade-in'}
        `}>
            <div className={`
                border-b-2 border-indigo-500 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4
                ${isHeadersMaximized ? 'bg-transparent' : 'bg-white dark:bg-slate-950'}
            `}>
                <div className="flex items-center gap-2">
                    <span className="text-lg sm:text-xl">🏷️</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200">Classified Headers</h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group w-full sm:w-48">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search headers..."
                            value={headerSearchTerm}
                            onChange={(e) => setHeaderSearchTerm(e.target.value)}
                            className="pl-9 h-10 w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20"
                        />
                    </div>

                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={downloadHeadersCSV}
                        className="h-10 px-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all font-bold flex items-center gap-2 border border-indigo-100 dark:border-indigo-900/50"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </Button>

                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={toggleHeadersMaximize}
                        className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm"
                    >
                        {isHeadersMaximized ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    </Button>

                    {isHeadersMaximized && (
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setIsHeadersMaximized(false)}
                            className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 shadow-sm transition-all"
                            title="Close Maximize"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    )}
                </div>
            </div>

            <div className={`grow flex flex-col min-h-0 ${isHeadersMaximized ? 'px-6 lg:px-10 pb-2' : ''}`}>
                <Card className={`border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden bg-white dark:bg-slate-900 flex flex-col ${isHeadersMaximized ? 'h-auto max-h-[85vh] min-h-0' : 'min-h-[500px]'}`}>
                    <CardContent className="p-0 flex flex-col min-h-0">
                        <Table
                            className="border-separate border-spacing-0"
                            containerClassName={`
                                relative border-t border-slate-100 dark:border-slate-800
                                overflow-auto
                                ${isHeadersMaximized ? 'h-auto max-h-[85vh] min-h-0' : 'max-h-[600px]'}
                            `}
                        >
                            <TableHeader className="bg-slate-50 dark:bg-slate-950">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="sticky top-0 z-40 text-slate-600 font-bold py-3 sm:py-4 text-center w-14 sm:w-20 border-b-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm">
                                        Match
                                    </TableHead>
                                    <TableHead className="sticky top-0 z-40 text-slate-600 font-bold py-3 sm:py-4 border-b-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm">
                                        Header
                                    </TableHead>
                                    <TableHead className="sticky top-0 z-40 text-slate-600 font-bold py-3 sm:py-4 border-b-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm">
                                        Predicted Label
                                    </TableHead>
                                    <TableHead className="sticky top-0 z-40 text-slate-600 font-bold py-3 sm:py-4 border-b-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm">
                                        Other Similar
                                    </TableHead>
                                    <TableHead className="sticky top-0 z-40 text-slate-600 font-bold py-3 sm:py-4 border-b-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-right text-xs sm:text-sm">
                                        Vector
                                    </TableHead>
                                    <TableHead className="sticky top-0 z-40 text-slate-600 font-bold py-3 sm:py-4 border-b-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-right text-xs sm:text-sm">
                                        Fuzzy
                                    </TableHead>
                                    <TableHead className="sticky top-0 z-40 text-slate-600 font-bold py-3 sm:py-4 border-b-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-right text-xs sm:text-sm">
                                        Overall
                                    </TableHead>
                                    <TableHead className="sticky top-0 z-40 text-slate-600 font-bold py-3 sm:py-4 border-b-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-right text-xs sm:text-sm">
                                        Similarity
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {filteredHeaders.map((header, idx) => {
                                    const isMatch =
                                        header.match === true ||
                                        header.match === "true" ||
                                        header.match_status === true;
                                    return (
                                        <TableRow
                                            key={idx}
                                            className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50/50"
                                        >
                                            <TableCell className="py-2.5 sm:py-4 text-center">
                                                <span className="text-base sm:text-lg">{isMatch ? "✅" : "❌"}</span>
                                            </TableCell>
                                            <TableCell className="py-2.5 sm:py-4 font-bold text-slate-800 dark:text-slate-200 text-[11px] sm:text-sm">
                                                {header.header || header.name}
                                            </TableCell>
                                            <TableCell className="py-2.5 sm:py-4">
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800 text-[9px] sm:text-[10px]">
                                                    {header.predicted_label || header.standard_key || "unmapped"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-2.5 sm:py-4 text-slate-500 text-[10px] sm:text-xs italic min-w-[120px]">
                                                {Array.isArray(header.other_similar)
                                                    ? header.other_similar.map((s: any) => typeof s === 'object' ? (s.name || s.label || s.standard_key || JSON.stringify(s)) : s).join(", ")
                                                    : header.other_similar || "-"}
                                            </TableCell>
                                            <TableCell className="py-2.5 sm:py-4 text-right text-slate-600 dark:text-slate-400 font-mono text-[10px] sm:text-xs">
                                                {header.vector_score ?? "-"}
                                            </TableCell>
                                            <TableCell className="py-2.5 sm:py-4 text-right text-slate-600 dark:text-slate-400 font-mono text-[10px] sm:text-xs">
                                                {header.fuzzy_score ?? "-"}
                                            </TableCell>
                                            <TableCell className="py-2.5 sm:py-4 text-right text-slate-600 dark:text-slate-400 font-mono text-[10px] sm:text-xs">
                                                {header.overall_score ?? "-"}
                                            </TableCell>
                                            <TableCell className="py-2.5 sm:py-4 text-right text-slate-600 dark:text-slate-400 font-mono text-[10px] sm:text-xs">
                                                {header.similarity ?? "-"}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
};
