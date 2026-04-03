export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'waitlisted';

// core required fields for all applications (regardless of specific team)
export type ApplicationCore = {
    first_name: string;
    last_name: string;
    email: string;
    major: string;
    year: string;
    team_id: string;
    experience: string;
    how_heard: string;
    consent: string;
    resume_url: string;
    resume: File;
};

// full submission
export type ApplicationCreate = ApplicationCore & {
    answers_json: any;
};

export type ApplicationResponse = ApplicationCreate & {
    id: string;
    status: ApplicationStatus;
    submitted_at: string;
};

// filters
export type ApplicationFilters = {
    team?: string;
    status?: ApplicationStatus;
    email?: string;
    page?: number;
    limit?: number;
};

export type ResumeUploadResponse = {
    resume_url: string;
};
