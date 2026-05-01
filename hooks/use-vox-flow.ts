import { useMutation, useQuery } from '@tanstack/react-query'
import { voxAPI, ApiParams } from "@/lib/api/vox-flow";

export function useVoxLogin() {
  return useMutation({
    mutationFn: (formData: FormData) => voxAPI.login(formData)
  })
}

export function useVoxRegister() {
  return useMutation({
    mutationFn: (data: Record<string, any>) => voxAPI.register(data)
  })
}

export function useVoxTranscribeShort() {
  return useMutation({
    mutationFn: ({ formData, params, useSample, languages }: { formData: FormData; params?: ApiParams; useSample?: boolean; languages?: string }) => {
      // Always ensure access_token is passed
      let token = params?.token;
      if (!token && typeof document !== 'undefined') {
        const match = document.cookie.match(/(^| )access_token=([^;]+)/);
        if (match) token = match[2];
      }
      return voxAPI.transcribeShort(formData, { ...params, token }, useSample, languages);
    }
  })
}

export function useVoxTranscribeLong() {
  return useMutation({
    mutationFn: ({ formData, params, useSample, languages }: { formData: FormData; params?: ApiParams; useSample?: boolean; languages?: string }) => {
      let token = params?.token;
      if (!token && typeof document !== 'undefined') {
        const match = document.cookie.match(/(^| )access_token=([^;]+)/);
        if (match) token = match[2];
      }
      return voxAPI.transcribeLong(formData, { ...params, token }, useSample, languages);
    }
  })
}

export function useVoxTranscribeOnly() {
  return useMutation({
    mutationFn: ({ formData, type, params, useSample }: { formData: FormData; type: 'short' | 'long'; params?: ApiParams; useSample?: boolean }) => {
      let token = params?.token;
      if (!token && typeof document !== 'undefined') {
        const match = document.cookie.match(/(^| )access_token=([^;]+)/);
        if (match) token = match[2];
      }
      return voxAPI.transcribeOnly(formData, type, { ...params, token }, useSample);
    }
  })
}

export function useVoxTranslate() {
  return useMutation({
    mutationFn: ({ text, currentLang, targetLang, params }: { text: string; currentLang: string; targetLang: string; params?: ApiParams }) =>
      voxAPI.translateOnly(text, currentLang, targetLang, params)
  })
}

export function useVoxTTS() {
  return useMutation({
    mutationFn: ({ text, language, params }: { text: string; language: string; params?: ApiParams }) =>
      voxAPI.ttsOnly(text, language, params)
  })
}

export function useVoxLanguages() {
  return useQuery<string[] | Record<string, any>>({
    queryKey: ['vox-languages'],
    queryFn: () => voxAPI.getLanguages()
  })
}

export function useVoxFormats() {
  return useQuery<string[] | Record<string, any>>({
    queryKey: ['vox-formats'],
    queryFn: () => voxAPI.getSupportedFormats()
  })
}
