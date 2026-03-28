export type Team = 'general' | 'drone' | 'robotarm' | 'ebike' | 'web';

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'waitlisted';

// core required fields for all applications (regardless of specific team)
export type ApplicationCore = {
    full_name: string;
    email: string;
    major: string;
    year: string;
    team: Team;
    experience: string;
    how_heard: string;
    consent: string;
    resume_url?: string;
};

// TODO: finalize the other application fields (here and in ../Teams/../steps.tsx)
// team specific fields
export type DroneFields = {
    drone_experience1?: string;
    drone_experience2?: string;
    drone_experience3?: string;
    drone_experience4?: string;
    drone_availability?: 'yes' | 'no' | 'other';
    drone_availability_other?: string;
};

export type GeneralFields = {
    onboarding?: 'yes' | 'no';
    first_choice_team?: 'drone' | 'robot_arm' | 'ebike' | 'software';
    second_choice_team?: 'drone' | 'robot_arm' | 'ebike' | 'software';
    team_choice_explanation?: string;
};

export type RobotArmFields = {
    arm_role?: 'mechatronics' | 'payload' | 'controls' | 'project';
    arm_availability?: 'yes' | 'no';
};

export type SWEFields = {
    swe_team: 'web_dev' | 'smart_glasses';
};

export type EBikeFields = {

};

// full submission
export type ApplicationCreate = ApplicationCore &
    DroneFields &
    GeneralFields &
    SWEFields &
    EBikeFields &
    RobotArmFields;

export type ApplicationResponse = ApplicationCreate & {
    id: string;
    status: ApplicationStatus;
    submitted_at: string;
};

// filters
export type ApplicationFilters = {
    team?: Team;
    status?: ApplicationStatus;
    email?: string;
    page?: number;
    limit?: number;
};

export type ResumeUploadResponse = {
    resume_url: string;
};
