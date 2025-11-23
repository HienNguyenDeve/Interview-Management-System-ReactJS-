import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth.hook";

interface PrivateRouteProps {
    requiredRoles: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ requiredRoles }) => {
    const { isAuthenticated, currentUser, loading } = useAuth();

    if (loading) {
        return null; // or a loading spinner
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" />;
    }

    if (requiredRoles && currentUser?.roles) {
        const hasAccess = requiredRoles.some(role => currentUser.roles.includes(role));
        if (!hasAccess) {
            return <Navigate to="/403" />;
        }
    }
    return <Outlet />;
}

export default PrivateRoute;