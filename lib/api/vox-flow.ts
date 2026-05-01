import { URLS } from '@/constants'


// Using the absolute URL for direct API access as requested
const BASE_URL = URLS.VOX_FLOW;
export interface ApiParams {
    apiKey?: string;
    token?: string;
}

function getCookie(name: string) {
    if (typeof document === 'undefined') return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift();
    }
    return undefined;
}

function getHeaders(params?: ApiParams, isFormData = false) {
    const headers: Record<string, string> = {}
    // Only set Content-Type if NOT FormData
    if (!isFormData) headers['Content-Type'] = 'application/json'

    const authCookie = getCookie('access_token');
    const finalToken = params?.token || authCookie;

    if (finalToken) {
        headers['Authorization'] = `Bearer ${finalToken}`;
    }

    return headers
}

export const voxAPI = {
    // Authentication
    login: async (formData: FormData) => {
        const urlEncoded = new URLSearchParams()
        formData.forEach((value, key) => {
            urlEncoded.append(key, value.toString())
        })

        const res = await fetch(`${BASE_URL}/auth/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: urlEncoded
        })
        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Login failed: ${res.status} ${errText.substring(0, 50)}`);
        }
        return res.json()
    },

    register: async (data: Record<string, any>) => {
        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Registration failed: ${res.status} ${errText.substring(0, 50)}`);
        }
        return res.json()
    },

    // Transcribe API
    transcribeShort: async (formData: FormData, params?: ApiParams, useSample?: boolean, languages?: string) => {
        const url = new URL(`${BASE_URL}/transcribe/short`);
        if (languages && languages !== 'auto') url.searchParams.append('languages', languages);
        if (useSample) url.searchParams.append('sample_audio', 'true');

        const res = await fetch(url.toString(), {
            method: 'POST',
            headers: getHeaders(params, true),
            body: formData
        })
        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Transcription failed: ${res.status} ${errText.substring(0, 50)}`);
        }
        return res.json()
    },

    transcribeLong: async (formData: FormData, params?: ApiParams, useSample?: boolean, languages?: string) => {
        const url = new URL(`${BASE_URL}/transcribe/long`);
        if (languages && languages !== 'auto') url.searchParams.append('languages', languages);
        if (useSample) url.searchParams.append('sample_audio', 'true');

        const res = await fetch(url.toString(), {
            method: 'POST',
            headers: getHeaders(params, true),
            body: formData
        })
        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Transcription failed: ${res.status} ${errText.substring(0, 50)}`);
        }
        return res.json()
    },

    transcribeOnly: async (formData: FormData, type: 'short' | 'long', params?: ApiParams, useSample?: boolean) => {
        const url = new URL(`${BASE_URL}/transcribe-only`);
        url.searchParams.append('model_type', type);
        if (useSample) url.searchParams.append('sample_audio', 'true');

        const res = await fetch(url.toString(), {
            method: 'POST',
            headers: getHeaders(params, true),
            body: formData
        })
        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Transcription failed: ${res.status} ${errText.substring(0, 50)}`);
        }
        return res.json()
    },

    // Translate API
    translateOnly: async (text: string, currentLang: string, targetLang: string, params?: ApiParams) => {
        const url = new URL(`${BASE_URL}/translate-only`)
        url.searchParams.append('text', text)
        if (targetLang) url.searchParams.append('target_language', targetLang)
        if (currentLang && currentLang !== 'auto') url.searchParams.append('current_language', currentLang)

        const res = await fetch(url.toString(), {
            method: 'POST',
            headers: getHeaders(params, true)
        })
        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Translation failed: ${res.status} ${errText.substring(0, 50)}`);
        }
        return res.json()
    },

    // TTS API
    ttsOnly: async (text: string, language: string, params?: ApiParams) => {
        const res = await fetch(`${BASE_URL}/tts-only?language=${language}`, {
            method: 'POST',
            headers: getHeaders(params),
            body: JSON.stringify({ text })
        })
        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`TTS failed: ${res.status} ${errText.substring(0, 50)}`);
        }
        return res.json()
    },

    // Metadata API
    getLanguages: async (params?: ApiParams) => {
        const url = new URL(`${BASE_URL}/languages`);
        const res = await fetch(url.toString(), {
            headers: getHeaders(params)
        });
        if (!res.ok) throw new Error(`Failed to fetch languages: ${res.status}`);
        return res.json();
    },

    getSupportedFormats: async (params?: ApiParams) => {
        const url = new URL(`${BASE_URL}/supported-formats`);
        const res = await fetch(url.toString(), {
            headers: getHeaders(params)
        });
        if (!res.ok) throw new Error(`Failed to fetch formats: ${res.status}`);
        return res.json();
    }
}
