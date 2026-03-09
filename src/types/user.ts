import type { UserRole } from '@/api/store/authStore';

export type { UserRole };

// user record returned by the backend
export type UserResponse = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    first_name: string | null;
    last_name: string | null;
    created_at: string;
};

// for creating a new user (admin)
export type UserCreate = {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    first_name?: string;
    last_name?: string;
};

// for updating an existing user (admin)
export type UserUpdate = Partial<Omit<UserCreate, 'password'>> & {
    password?: string;
};

// query filters for listing users
export type UserFilters = {
    role?: UserRole;
    email?: string;
    page?: number;
    limit?: number;
};
