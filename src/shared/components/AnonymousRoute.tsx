import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth.hook";
import React from "react";

const AnonymousRoute: React.FC = () => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Navigate to="/" /> : <Outlet />
}

export default AnonymousRoute;