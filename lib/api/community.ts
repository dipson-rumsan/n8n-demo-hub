import { URLS } from '@/constants'

const BASE_URL = URLS.COMMUNITY_TOOL;

export interface CommunityUploadParams {
    standard_name?: string;
    page?: number;
    page_size?: number;
}

export const communityAPI = {
    uploadCSV: async (file: File, params: CommunityUploadParams = { page: 1, page_size: 100, standard_name: 'sample' }): Promise<any> => {
        const formData = new FormData();
        formData.append('file', file);

        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.page_size) queryParams.append('page_size', params.page_size.toString());
        if (params.standard_name) queryParams.append('standard_name', params.standard_name);

        const res = await fetch(`${BASE_URL}/api/csv/upload/?${queryParams.toString()}`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'accept': 'application/json',
            },
            body: formData,
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Upload failed: ${res.status} - ${errorText}`);
        }

        return res.json();
    }
}
