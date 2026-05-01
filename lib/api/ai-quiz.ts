import { URLS } from '@/constants'

// Using direct backend API URL
const BASE_URL = URLS.AI_QUIZ; // Proxy to backend API defined in next.config.js

if (!BASE_URL && typeof window !== 'undefined') {
    console.error('AI_QUIZ_API_URL is not defined in environment variables');
}

export interface ApiParams {
    difficulty?: 'easy' | 'medium' | 'hard';
    questionType?: 'mcq';
    documentId?: string;
    page?: number;
    limit?: number;
}

function getHeaders(isFormData = false) {
    const headers: Record<string, string> = {
        'accept': 'application/json'
    }
    if (!isFormData) headers['Content-Type'] = 'application/json'

    return headers
}

export const aiQuizAPI = {
    // Document Management
    uploadDocument: async (formData: FormData): Promise<any> => {
        const res = await fetch(`${BASE_URL}/upload_document`, {
            method: 'POST',
            mode: 'cors',
            headers: getHeaders(true),
            body: formData
        })
        if (!res.ok) {
            if (res.status === 409) {
                return { message: 'Document already exists', status: 409 };
            }
            const errorText = await res.text();
            console.error('Server error response:', errorText);
            throw new Error(`Upload failed: ${res.status} - ${errorText.substring(0, 100)}`);
        }
        return res.json()
    },

    getDocuments: async (): Promise<any[]> => {
        const res = await fetch(`${BASE_URL}/documents/public`, {
            mode: 'cors',
            headers: getHeaders()
        })
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to fetch documents: ${res.status} - ${errorText.substring(0, 100)}`);
        }
        return res.json() as Promise<any[]>
    },

    // Quiz Management
    createQuiz: async (data: { title: string; document_id: string; question_ids: number[] }): Promise<any> => {
        const res = await fetch(`${BASE_URL}/quiz/create_quiz`, {
            method: 'POST',
            mode: 'cors',
            headers: getHeaders(),
            body: JSON.stringify(data)
        })
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to create quiz: ${res.status} - ${errorText.substring(0, 100)}`);
        }
        return res.json()
    },

    getQuizzes: async (): Promise<any[]> => {
        const query = 'skip=0&limit=20';
        const res = await fetch(`${BASE_URL}/quiz/public?${query}`, {
            mode: 'cors',
            headers: getHeaders()
        })
        if (!res.ok) throw new Error(`Failed to fetch quizzes: ${res.status}`);
        return res.json() as Promise<any[]>
    },

    // Questions Management
    getQuestions: async (quizId?: string, params?: ApiParams): Promise<any[]> => {
        const docId = params?.documentId;
        const page = params?.page || 1;
        const limit = params?.limit || 10;

        // Build query string matching the curl order exactly
        let queryParts = [];
        if (docId) queryParts.push(`document_id=${docId}`);
        else if (quizId) queryParts.push(`quiz_id=${quizId}`);

        queryParts.push(`page=${page}`);
        queryParts.push(`limit=${limit}`);

        const queryString = queryParts.join('&');
        
        const headers = getHeaders();
        if (params?.difficulty) {
            headers['Difficulty'] = params.difficulty;
        }

        const res = await fetch(`${BASE_URL}/questions/public?${queryString}`, {
            mode: 'cors',
            headers: headers
        })
        if (!res.ok) {
            const errorText = await res.text();
            console.error('Failed to fetch questions:', {
                status: res.status,
                statusText: res.statusText,
                error: errorText,
                url: `${BASE_URL}/questions/?${queryString}`
            });
            throw new Error(`Failed to fetch questions: ${res.status} - ${errorText.substring(0, 200)}`);
        }
        return res.json() as Promise<any[]>
    },

    deleteQuestions: async (questionIds: string[]): Promise<any> => {
        const res = await fetch(`${BASE_URL}/questions`, {
            method: 'DELETE',
            mode: 'cors',
            headers: getHeaders(),
            body: JSON.stringify({ question_ids: questionIds })
        })
        if (!res.ok) throw new Error(`Failed to delete questions: ${res.status}`);
        return res.json()
    },

    updateQuestion: async (questionId: string, data: any): Promise<any> => {
        const res = await fetch(`${BASE_URL}/questions/update/${questionId}`, {
            method: 'PATCH',
            mode: 'cors',
            headers: getHeaders(),
            body: JSON.stringify(data)
        })
        if (!res.ok) throw new Error(`Failed to update question: ${res.status}`);
        return res.json()
    },

    validateQuestions: async (data: any): Promise<any> => {
        const res = await fetch(`${BASE_URL}/questions/validate`, {
            method: 'PATCH',
            mode: 'cors',
            headers: getHeaders(),
            body: JSON.stringify(data)
        })
        if (!res.ok) throw new Error(`Failed to validate questions: ${res.status}`);
        return res.json()
    },

    createQuestionManual: async (data: any): Promise<any> => {
        const { quiz_id, ...payload } = data; // Strip quiz_id from API call if present
        const res = await fetch(`${BASE_URL}/questions/generate-questions/manual`, {
            method: 'POST',
            mode: 'cors',
            headers: getHeaders(),
            body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error(`Failed to create question: ${res.status}`);
        return res.json()
    },

    generateQuestionsAI: async (data: any): Promise<any> => {
        const res = await fetch(`${BASE_URL}/questions/generate-questions/ai`, {
            method: 'POST',
            mode: 'cors',
            headers: getHeaders(),
            body: JSON.stringify(data)
        })
        if (!res.ok) throw new Error(`Failed to generate questions: ${res.status}`);
        return res.json()
    },

    generateQuestions: async (data: any): Promise<any> => {
        const res = await fetch(`${BASE_URL}/questions/generate-questions`, {
            method: 'POST',
            mode: 'cors',
            headers: getHeaders(),
            body: JSON.stringify(data)
        })
        if (!res.ok) {
            const errorText = await res.text();
            console.error('Generate questions error:', errorText);
            throw new Error(`Failed to generate questions: ${res.status} - ${errorText.substring(0, 200)}`);
        }
        return res.json()
    }
}
