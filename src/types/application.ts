/** Matches backend `AppStatus` */
export type ApplicationStatus = 'applied' | 'accepted' | 'denied' | 'in_review';

/** Core fields collected in the multi-step apply form (client-side names). */
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
    resume_url?: string;
    resume?: FileList | File;
};

/** Payload built for multipart POST /applications/apply */
export type ApplicationCreate = Omit<ApplicationCore, 'resume' | 'team_id'> & {
    team_id: string;
    answers_json: Record<string, unknown>;
    resume_url?: string;
};

/** Matches backend `ApplicationResponse` + JSON serialization */
export type ApplicationResponse = {
    id: string;
    team: string;
    first_name: string;
    last_name: string;
    email: string;
    year: string;
    major: string;
    resume: string | null;
    status: ApplicationStatus;
    notified: boolean;
    metadata_json: Record<string, unknown> | null;
};

export type ApplicationFilters = {
    team_id?: string;
    status?: ApplicationStatus;
    email?: string;
    page?: number;
    limit?: number;
    notified?: boolean;
};

export type ResumeUploadResponse = {
    resume_url: string;
};

/** UUID of the team an application belongs to */
export function applicationTeamId(app: ApplicationResponse): string {
    return app.team;
}
