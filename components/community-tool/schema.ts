export interface PaginationInfo {
    page: number;
    page_size: number;
    total_rows: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
}

export interface ClassifiedHeader {
    header?: string;
    name?: string;
    match?: boolean | string;
    match_status?: boolean;
    predicted_label?: string;
    standard_key?: string;
    other_similar?: any;
    vector_score?: number;
    fuzzy_score?: number;
    overall_score?: number;
    similarity?: number;
}

export interface CommunityResult {
    data?: any[];
    rows?: any[];
    classified_headers?: ClassifiedHeader[];
    validation?: {
        records: any[];
        pagination: PaginationInfo;
    };
    deduplication_results?: {
        results: Record<string, number[][]>;
        statistics: any;
    };
}
