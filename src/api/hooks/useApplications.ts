import { useState, useCallback } from 'react';
import type { AxiosError } from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api.ts';
import type {
    ApplicationCreate,
    ApplicationFilters,
    ApplicationResponse,
    ResumeUploadResponse,
} from '@/types/application';

const applicationKeys = {
    all: ['applications'] as const,
    filtered: (filters?: ApplicationFilters) =>
        [...applicationKeys.all, filters ?? {}] as const,
    detail: (id: string) => [...applicationKeys.all, id] as const,
};

const toError = (error: unknown, fallback: string): Error => {
    if (error instanceof Error) {
        return error;
    }

    if (error && typeof error === 'object') {
        const axiosError = error as AxiosError<{ detail?: string }>;
        const message = axiosError.response?.data?.detail;
        if (message) {
            return new Error(message);
        }
    }

    return new Error(fallback);
};

// (ADMIN) FETCH ALL/FILTERED APPLICATIONS
// GET /applications/filter
export const useApplications = (filters?: ApplicationFilters) => {
    return useQuery<ApplicationResponse[]>({
        queryKey: applicationKeys.filtered(filters),
        queryFn: async () => {
            try {
                const { data } = await api.get<ApplicationResponse[]>(
                    '/applications/filter',
                    { params: filters }
                );
                return data;
            }
            catch (error) {
				throw toError(error, 'Failed to fetch applications');
            }
        },
        staleTime: 1000 * 60 * 2,  // 2 minutes (cache is fresh)
        gcTime: 1000 * 60 * 5,     // 5 minutes (how long inactive before removed)
    });
};

// (ADMIN) FETCH SINGLE APPLICATION BY ID
// GET /applications/:id
export const useApplication = (id: string) => {
    return useQuery<ApplicationResponse>({
        queryKey: applicationKeys.detail(id),
        queryFn: async () => {
            try {
                const { data } = await api.get<ApplicationResponse>(
                    `/applications/${id}`
                );
                return data;
            }
            catch (error) {
				throw toError(error, 'Failed to fetch application');
            }
        },
        enabled: Boolean(id),
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 5,
    });
};

// (CLIENT) UPLOAD RESUME
// POST /applications/resume
// sends a multipart/form-data POST, returns stored resume URL
export const useUploadResume = () => {
    return useMutation<ResumeUploadResponse, Error, File>({
        mutationFn: async (file: File) => {
            try {
                const form = new FormData();
                form.append('resume', file);
                const { data } = await api.post<ResumeUploadResponse>(
                    '/apply/resume',
                    form,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );
                return data;
            }
            catch (error) {
				throw toError(error, 'Failed to upload resume');
            }
        },
    });
};

// (CLIENT) SUBMIT APPLICATION
// POST /apply
export const useCreateApplication = () => {
    const queryClient = useQueryClient();

    return useMutation<ApplicationResponse, Error, ApplicationCreate>({
        mutationFn: async (payload: ApplicationCreate) => {
            try {
                const { data } = await api.post<ApplicationResponse>(
                    '/apply',
                    payload
                );
                return data;
            }
            catch (error) {
				throw toError(error, 'Failed to submit application');
            }
        },
        onSuccess: () => {
            // invalidate the admin list to trigger refresh
            queryClient.invalidateQueries({ queryKey: applicationKeys.all });
        },
    });
};

type SubmitPayload = {
    values: Record<string, any>;
    file?: File;
};

type SubmitState = {
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: Error | null;
    submit: (payload: SubmitPayload) => Promise<void>;
    reset: () => void;
};

export const useSubmitApplication = (): SubmitState => {
    const uploadResume = useUploadResume();
    const createApplication = useCreateApplication();

    const [state, setState] = useState<{
        isPending: boolean;
        isSuccess: boolean;
        isError: boolean;
        error: Error | null;
    }>({
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
    });

    const submit = useCallback(async ({ values, file }: SubmitPayload) => {
        setState({ isPending: true, isSuccess: false, isError: false, error: null });
        try {
            // upload resume if a file was attached
            let resume_url: string | undefined;
            if (file) {
                const uploadResult = await uploadResume.mutateAsync(file);
                resume_url = uploadResult.resume_url;
            }

            // strip the FileList from the values and attach the URL
            const { resume: _rawFile, ...rest } = values;
            const payload: ApplicationCreate = {
                ...(rest as ApplicationCreate),
                ...(resume_url ? { resume_url } : {}),
            };

            // submit the application
            await createApplication.mutateAsync(payload);
            setState({ isPending: false, isSuccess: true, isError: false, error: null });
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Submission failed');
            setState({ isPending: false, isSuccess: false, isError: true, error });
        }
    }, [uploadResume, createApplication]);

    const reset = useCallback(() => {
        setState({ isPending: false, isSuccess: false, isError: false, error: null });
    }, []);

    return { ...state, submit, reset };
};

// (ADMIN) UPDATE APPLICATION STATUS
export const useUpdateApplicationStatus = () => {
    const queryClient = useQueryClient();

    return useMutation<
        ApplicationResponse,
        Error,
        { id: string; status: ApplicationResponse['status'] }
    >({
        mutationFn: async ({ id, status }) => {
            try {
                const { data } = await api.patch<ApplicationResponse>(
                    `/applications/${id}/status`,
                    { status }
                );
                return data;
            }
            catch (error) {
				throw toError(error, 'Failed to update application status');
            }
        },
        onSuccess: (updatedApplication) => {
            // update specific record in cache immediately
            queryClient.setQueryData(
                applicationKeys.detail(updatedApplication.id),
                updatedApplication
            );
            // invalidate the filtered list for refetch
            queryClient.invalidateQueries({ queryKey: applicationKeys.all });
        },
    });
};