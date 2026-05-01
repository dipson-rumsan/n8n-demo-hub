import React from "react";
import { Search, Download, Minimize2, Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginationInfo, CommunityResult } from "./schema";

interface ResultsTableProps {
    lastResult: CommunityResult | null;
    rows: any[];
    pagination: PaginationInfo;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    isMaximized: boolean;
    isHeadersMaximized: boolean;
    isPreviewOpen: boolean;
    file: File | null;
    toggleMaximize: () => void;
    setIsMaximized: (max: boolean) => void;
    downloadCSV: () => void;
    getRowInfo: (originalIdx: number, resultIdx: number) => { status: string; isDuplicate: boolean; isInvalid: boolean };
}

export const ResultsTable: React.FC<ResultsTableProps> = ({
    lastResult,
    rows,
    pagination,
    searchTerm,
    setSearchTerm,
    isMaximized,
    isHeadersMaximized,
    isPreviewOpen,
    file,
    toggleMaximize,
    setIsMaximized,
    downloadCSV,
    getRowInfo
}) => {
    if ((!lastResult && !(file && isPreviewOpen)) || isHeadersMaximized) return null;

    return (
        <section className={`
            ${isMaximized
                ? 'fixed top-14 inset-x-0 bottom-0 z-90 bg-[#f8fafc] dark:bg-[#020617] flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300 pt-2 pb-10 px-4 lg:px-8 overflow-hidden'
                : 'space-y-6 flex flex-col grow animate-in fade-in pb-10'}
        `}>
            <div className={`
                border-b-2 border-indigo-500 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4
                ${isMaximized ? 'bg-transparent' : 'bg-white dark:bg-slate-950'}
            `}>
                <div className="flex items-center gap-2">
                    <span className="text-lg sm:text-xl">{lastResult ? '📊' : ''}</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200">
                        {lastResult ? 'Data Analysis Results' : 'Preview Dataset Content'}
                    </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search in table..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-10 w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20"
                        />
                    </div>

                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={downloadCSV}
                        className="h-10 px-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all font-bold flex items-center gap-2 border border-indigo-100 dark:border-indigo-900/50"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </Button>

                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={toggleMaximize}
                        className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm"
                    >
                        {isMaximized ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    </Button>

                    {isMaximized && (
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setIsMaximized(false)}
                            className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 shadow-sm transition-all"
                            title="Close Maximize"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    )}
                </div>
            </div>

            <div className={`flex items-center justify-between flex-wrap gap-4 ${isMaximized ? 'px-4 md:px-6 pb-2' : ''}`}>
                <div className="flex flex-col">
                    <div className="bg-slate-100/80 dark:bg-slate-800/50 px-3 py-2 sm:p-4 rounded-lg text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 w-fit">
                        Showing {rows.length} records on this page
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-400 font-mono mt-1 px-3 sm:px-4">
                        Total: {pagination.total_rows} | Page: {pagination.page}/{pagination.total_pages}
                    </div>
                </div>

                {lastResult && (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
                        <div className="flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-[#065f46] bg-[#d1fae5] text-[#065f46] text-[10px] sm:text-xs font-bold shadow-sm">
                            ✅ Valid
                        </div>
                        <div className="flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-[#991b1b] bg-[#fee2e2] text-[#991b1b] text-[10px] sm:text-xs font-bold shadow-sm">
                            ❌ Invalid
                        </div>
                        <div className="flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-[#f97316] bg-[#ffedd5] text-[#9a3412] text-[10px] sm:text-xs font-bold shadow-sm">
                            ⚠️ Duplicate
                        </div>
                    </div>
                )}
            </div>

            <Card className={`border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 ${isMaximized ? 'flex flex-col h-auto max-h-[85vh] min-h-0 overflow-hidden' : 'h-auto'}`}>
                <CardContent className={`p-0 ${isMaximized ? 'flex flex-col min-h-0' : 'relative h-auto'}`}>
                    {rows.length > 0 ? (
                        <Table
                            className="border-separate border-spacing-0"
                            containerClassName={`
                                relative border-t border-slate-100 dark:border-slate-800
                                overflow-auto
                                ${isMaximized ? 'h-auto max-h-[85vh] min-h-0' : 'max-h-[700px]'}
                            `}
                        >
                            <TableHeader className="bg-slate-50 dark:bg-slate-950">
                                <TableRow className="hover:bg-transparent">
                                    {lastResult && (
                                        <TableHead className="sticky top-0 z-40 w-[40px] sm:w-[50px] py-3 sm:py-4 text-slate-600 text-center border-b-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 whitespace-nowrap text-xs sm:text-sm">
                                            #
                                        </TableHead>
                                    )}
                                    {lastResult && (
                                        <TableHead className="sticky top-0 z-40 py-3 sm:py-4 text-slate-600 font-bold border-b-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 whitespace-nowrap text-xs sm:text-sm">
                                            Status
                                        </TableHead>
                                    )}
                                    {rows[0] && Object.keys(rows[0]).map((key) => (
                                        <TableHead
                                            key={key}
                                            className="sticky top-0 z-40 py-3 sm:py-4 text-slate-600 font-bold px-3 sm:px-4 border-b-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 whitespace-nowrap text-xs sm:text-sm"
                                        >
                                            {key}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {rows.map((row: any, idx: number) => {
                                    const originalIdx = (pagination.page - 1) * pagination.page_size + idx;
                                    const { status, isDuplicate, isInvalid } = getRowInfo(originalIdx, idx);

                                    let rowStyle = "hover:bg-slate-50 dark:hover:bg-slate-800/50";
                                    let textColor = "text-slate-700 dark:text-slate-300";
                                    let statusColor = "text-slate-600";

                                    if (isDuplicate) {
                                        rowStyle = "bg-[#ffedd5] hover:bg-[#fed7aa] border-b border-orange-100";
                                        textColor = "text-[#9a3412] font-medium";
                                        statusColor = "text-[#9a3412]";
                                    } else if (isInvalid) {
                                        rowStyle = "bg-[#fee2e2] hover:bg-[#fecaca] border-b border-red-100";
                                        textColor = "text-[#b91c1c] font-medium";
                                        statusColor = "text-[#b91c1c]";
                                    }

                                    return (
                                        <TableRow
                                            key={idx}
                                            className={`transition-all duration-200 ${rowStyle} border-b border-slate-100 dark:border-slate-800 last:border-0`}
                                        >
                                            {lastResult && (
                                                <TableCell className="text-center text-slate-400 text-[10px] sm:text-xs font-mono py-2 sm:py-3 whitespace-nowrap px-2">
                                                    {originalIdx}
                                                </TableCell>
                                            )}
                                            {lastResult && (
                                                <TableCell className={`py-2 sm:py-3 text-[11px] sm:text-sm font-bold ${statusColor} whitespace-nowrap px-2 sm:px-4`}>
                                                    {status}
                                                </TableCell>
                                            )}
                                            {Object.values(row).map((val: any, vIdx: number) => (
                                                <TableCell key={vIdx} className={`text-[11px] sm:text-sm py-2 sm:py-3 px-3 sm:px-4 ${textColor} whitespace-nowrap`}>
                                                    {val?.toString() || ""}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-20 text-slate-400">
                            <Search className="w-12 h-12 mb-4 opacity-20" />
                            <p className="text-sm font-medium">No results found matching your search</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    );
};
