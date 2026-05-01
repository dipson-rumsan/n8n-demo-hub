import { useState, useRef, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { communityAPI } from "@/lib/api/community";
import { CommunityResult, PaginationInfo } from "@/components/community-tool/schema";

export const useCommunityTool = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [lastResult, setLastResult] = useState<CommunityResult | null>(null);
    const [standardName, setStandardName] = useState("sample");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [localData, setLocalData] = useState<any[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [headerSearchTerm, setHeaderSearchTerm] = useState("");
    const [isMaximized, setIsMaximized] = useState(false);
    const [isHeadersMaximized, setIsHeadersMaximized] = useState(false);
    const [isPreloaded, setIsPreloaded] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    useEffect(() => {
        if (isMaximized || isHeadersMaximized) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMaximized, isHeadersMaximized]);

    // Pre-load sample CSV from public folder on mount
    useEffect(() => {
        fetch('/community-tool.csv')
            .then(res => res.blob())
            .then(blob => {
                const sampleFile = new File([blob], 'community-tool.csv', { type: 'text/csv' });
                setFile(sampleFile);
                setStandardName('community_tool');
                setIsPreloaded(true);
                parseCSV(sampleFile);
            })
            .catch(() => { /* silently ignore if not found */ });
    }, []);

    const parseCSV = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            if (!text) return;

            const lines = text.split(/\r?\n/);
            if (lines.length === 0) return;

            const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
            const dataRows = lines.slice(1)
                .filter(line => line.trim() !== '')
                .map(line => {
                    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
                    const row: any = {};
                    headers.forEach((h, i) => {
                        row[h] = values[i] || "";
                    });
                    return row;
                });

            setLocalData(dataRows);
        };
        reader.readAsText(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.type === "text/csv" || droppedFile.name.endsWith('.csv'))) {
            setFile(droppedFile);
            const cleanName = droppedFile.name.split('.')[0].toLowerCase().replace(/[^a-z0-9]/g, '_');
            setStandardName(cleanName);
            parseCSV(droppedFile);
            toast.success("File added: " + droppedFile.name);
            setLastResult(null);
            setCurrentPage(1);
        } else {
            toast.error("Please upload a valid CSV file");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const cleanName = selectedFile.name.split('.')[0].toLowerCase().replace(/[^a-z0-9]/g, '_');
            setStandardName(cleanName);
            parseCSV(selectedFile);
            setLastResult(null);
            setCurrentPage(1);
        }
    };

    const removeFile = () => {
        setFile(null);
        setLastResult(null);
        setLocalData([]);
        setCurrentPage(1);
        setIsPreviewOpen(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const toggleMaximize = () => {
        if (!isMaximized) setIsHeadersMaximized(false);
        setIsMaximized(!isMaximized);
    };

    const toggleHeadersMaximize = () => {
        if (!isHeadersMaximized) setIsMaximized(false);
        setIsHeadersMaximized(!isHeadersMaximized);
    };

    const handleUpload = async (page = 1) => {
        if (!file) {
            toast.error("Please select a file first");
            return;
        }

        setUploading(true);
        setUploadProgress(20);

        try {
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => (prev < 90 ? prev + 10 : prev));
            }, 500);

            const data = await communityAPI.uploadCSV(file, {
                standard_name: standardName,
                page: page,
                page_size: pageSize
            });

            clearInterval(progressInterval);
            setUploadProgress(100);
            setLastResult(data as CommunityResult);
            setCurrentPage(page);

            toast.success(`Data synchronized successfully! Page ${page}`);
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to upload file. Please check your connection.");
        } finally {
            setUploading(false);
            setTimeout(() => setUploadProgress(0), 1000);
        }
    };

    const duplicateIndices = useMemo(() => {
        const indices = new Set<number>();
        const dedupData = lastResult?.deduplication_results;
        if (dedupData?.results) {
            Object.values(dedupData.results).forEach((groups: any) => {
                groups.forEach((group: number[]) => {
                    group.forEach(idx => indices.add(idx));
                });
            });
        }
        return indices;
    }, [lastResult]);

    const getRowInfo = (originalIdx: number, resultIdx: number) => {
        if (!lastResult) return { status: "Pending", isDuplicate: false, isInvalid: false };

        const records = lastResult?.validation?.records || [];
        const isDuplicate = duplicateIndices.has(originalIdx);

        let isInvalid = false;
        const valRecord = records[resultIdx];
        if (valRecord) {
            Object.values(valRecord).forEach((colInfo: any) => {
                if (typeof colInfo === 'object' && colInfo !== null && colInfo.valid === false) {
                    isInvalid = true;
                }
            });
        }

        let statusParts = [];
        if (isInvalid) statusParts.push("❌ Invalid");
        else statusParts.push("✅ Valid");

        if (isDuplicate) statusParts.push("⚠️ Duplicate");

        const status = statusParts.join(" | ");

        return { status, isDuplicate, isInvalid };
    };

    const pagination = useMemo(() => {
        return lastResult?.validation?.pagination || {
            page: currentPage,
            page_size: pageSize,
            total_rows: localData.length,
            total_pages: Math.ceil(localData.length / pageSize),
            has_next: currentPage < Math.ceil(localData.length / pageSize),
            has_previous: currentPage > 1
        };
    }, [lastResult, currentPage, pageSize, localData.length]);

    const rows = useMemo(() => {
        let baseRows: any[] = [];
        if (lastResult?.data || lastResult?.rows) {
            baseRows = lastResult.data || lastResult.rows || [];
        } else if (localData.length > 0) {
            const start = (currentPage - 1) * pageSize;
            baseRows = localData.slice(start, start + pageSize);
        }

        if (!searchTerm) return baseRows;

        return baseRows.filter(row =>
            Object.values(row).some(val =>
                String(val).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [lastResult, localData, currentPage, pageSize, searchTerm]);

    const downloadCSV = () => {
        const dataToDownload = lastResult?.data || lastResult?.rows || localData;
        if (!dataToDownload || dataToDownload.length === 0) return;

        const headers = Object.keys(dataToDownload[0]);
        const csvContent = [
            headers.join(','),
            ...dataToDownload.map((row: any) =>
                headers.map(header => {
                    const cell = row[header]?.toString() || "";
                    return `"${cell.replace(/"/g, '""')}"`;
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `processed_data_${standardName || 'sync'}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Download started");
    };

    const downloadHeadersCSV = () => {
        if (!lastResult?.classified_headers || lastResult.classified_headers.length === 0) return;

        const headers = ["Match", "Header", "Predicted Label", "Other Similar", "Vector Score", "Fuzzy Score", "Overall Score", "Similarity"];
        const csvContent = [
            headers.join(','),
            ...lastResult.classified_headers.map((h: any) => [
                h.match || h.match_status ? "YES" : "NO",
                `"${(h.header || h.name || "").replace(/"/g, '""')}"`,
                `"${(h.predicted_label || h.standard_key || "unmapped").replace(/"/g, '""')}"`,
                `"${(Array.isArray(h.other_similar)
                    ? h.other_similar.map((s: any) => typeof s === 'object' ? (s.name || s.label || s.standard_key || JSON.stringify(s)) : s).join(';')
                    : (h.other_similar || "")).replace(/"/g, '""')}"`,
                h.vector_score || "",
                h.fuzzy_score || "",
                h.overall_score || "",
                h.similarity || ""
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `classified_headers_${standardName}.csv`);
        link.click();
        toast.success("Headers exported");
    };

    const filteredHeaders = useMemo(() => {
        if (!lastResult?.classified_headers) return [];
        if (!headerSearchTerm) return lastResult.classified_headers;

        return lastResult.classified_headers.filter((h: any) =>
            Object.values(h).some(val =>
                String(val).toLowerCase().includes(headerSearchTerm.toLowerCase())
            )
        );
    }, [lastResult?.classified_headers, headerSearchTerm]);

    return {
        file,
        isDragging,
        uploading,
        lastResult,
        uploadProgress,
        pageSize,
        setPageSize,
        rows,
        pagination,
        searchTerm,
        setSearchTerm,
        headerSearchTerm,
        setHeaderSearchTerm,
        isMaximized,
        setIsMaximized,
        isHeadersMaximized,
        setIsHeadersMaximized,
        isPreloaded,
        isPreviewOpen,
        setIsPreviewOpen,
        fileInputRef,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleFileChange,
        removeFile,
        handleUpload,
        toggleMaximize,
        toggleHeadersMaximize,
        downloadCSV,
        downloadHeadersCSV,
        filteredHeaders,
        getRowInfo
    };
};
