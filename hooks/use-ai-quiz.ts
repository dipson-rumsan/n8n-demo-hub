import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiQuizAPI } from "@/lib/api/ai-quiz";
import { toast } from 'sonner';

export const useDocuments = () => {
    return useQuery<any[]>({
        queryKey: ['documents'],
        queryFn: async () => {
            const res = await aiQuizAPI.getDocuments();
            return Array.isArray(res) ? res : (res as any).documents || (res as any).data || [];
        },
    });
};

export const useQuizzes = () => {
    return useQuery<any[]>({
        queryKey: ['quizzes'],
        queryFn: async () => {
            const res = await aiQuizAPI.getQuizzes();
            return Array.isArray(res) ? res : (res as any).quizzes || [];
        },
    });
};

export const useQuestions = (quizId?: string, params?: any) => {
    return useQuery<any[]>({
        queryKey: ['questions', quizId, params],
        queryFn: async () => {
            const res = await aiQuizAPI.getQuestions(quizId, params);
            return Array.isArray(res) ? res : (res as any).questions || (res as any).data || [];
        },
        enabled: !!quizId || !!params?.documentId,
    });
};

export const useUploadDocument = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (formData: FormData) => aiQuizAPI.uploadDocument(formData),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
        },
    });
};

export const useCreateQuiz = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => aiQuizAPI.createQuiz(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quizzes'] });
        },
    });
};

export const useAddManualQuestion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => aiQuizAPI.createQuestionManual(data),
        onSuccess: (_: any, variables: any) => {
            queryClient.invalidateQueries({ queryKey: ['questions', variables.quiz_id] });
            toast.success('Question added successfully');
        },
    });
};

export const useGenerateAIQuestions = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => aiQuizAPI.generateQuestionsAI(data),
        onSuccess: (_: any, variables: any) => {
            queryClient.invalidateQueries({ queryKey: ['questions', variables.quiz_id] });
            toast.success('AI generation started');
        },
    });
};

export const useUpdateQuestion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => aiQuizAPI.updateQuestion(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['questions'] });
            toast.success('Question updated successfully');
        },
    });
};

export const useDeleteQuestion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, quizId }: { id: string; quizId: string }) => aiQuizAPI.deleteQuestions([id]),
        onSuccess: (_: any, variables: { id: string; quizId: string }) => {
            queryClient.invalidateQueries({ queryKey: ['questions', variables.quizId] });
            toast.success('Question deleted');
        },
    });
};

export const useValidateQuestions = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => aiQuizAPI.validateQuestions(data),
        onSuccess: (_: any, variables: any) => {
            queryClient.invalidateQueries({ queryKey: ['questions', variables.quiz_id] });
            toast.success('Questions validated');
        },
    });
};
