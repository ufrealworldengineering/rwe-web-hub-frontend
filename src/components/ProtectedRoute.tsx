import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/api/store/authStore';

export type UserRole = 'president' | 'treasurer' | 'program_manager' | 'member' | 'Admin' | 'Guest';

type ProtectedRouteProps = {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles
}) => {
    const { isAuthenticated, role } = useAuthStore();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to='/login' state={{ from: location }} replace />;
    }

    if (allowedRoles && role && !allowedRoles.includes(role as UserRole)) {
        return <Navigate to='/access-denied' replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;