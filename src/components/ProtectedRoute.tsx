import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';


export type UserRole = 'Guest' | 'Admin';

// TODO: this function simply returns dummy data to demonstrate functionality.
//       should be replaced with a real AuthStore that returns the user's state using JWT
const useAuthStore = () => {
    //return { isAuthenticated: true, user: { role: 'Guest' as UserRole } }
    return { isAuthenticated: true, user: { role: 'Admin' as UserRole } }
};

type ProtectedRouteProps = {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles
}) => {
    const { isAuthenticated, user } = useAuthStore();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to='/login' state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to='/access-denied' replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;