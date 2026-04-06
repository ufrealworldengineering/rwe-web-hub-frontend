import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuthStore, type UserRole } from '@/api/store/authStore';


type ProtectedRouteProps = {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
    bypassAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles,
    bypassAuth = false,
}) => {
    const { isAuthenticated, role } = useAuthStore();
    const location = useLocation();

    if (bypassAuth) {
        return <>{children}</>;
    }

    if (!isAuthenticated) {
        return <Navigate to='/login' state={{ from: location }} replace />;
    }

    if (allowedRoles && role && !allowedRoles.includes(role as UserRole)) {
        return <Navigate to='/access-denied' replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
