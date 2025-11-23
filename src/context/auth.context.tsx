import React, { createContext, ReactNode, useEffect, useState } from "react";
import { LoginResponseModel, UserInformation } from "../models/auth/login-response.model";
import { ToastType } from "../enums/core/common/toast-type.enum";
import { useToast } from "../hooks/use-toast.hook";
import { LocalStorageConstants } from "../constants/localStorage.constant";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (data: LoginResponseModel) => void;
    logout: () => void;
    updateProfile: (data: UserInformation) => void;
    currentUser?: UserInformation;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<UserInformation | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const { showToast } = useToast(); // Initialize useViewTransitionState;

    // Check if user is already authenticated based on token inlocal storage
    useEffect(() => {
        Promise.resolve().then(() => {
            const token = localStorage.getItem(LocalStorageConstants.accessToken);
            const user = localStorage.getItem(LocalStorageConstants.user);
            if (token) {
                setIsAuthenticated(true);
                if (user) {
                    setCurrentUser(JSON.parse(user));
                }
            }
            setLoading(false);
        });
    }, []);

    // Handle Login
    const login = (data: LoginResponseModel) => {
        if (data) {
            setIsAuthenticated(true);
            setCurrentUser(data.user);
            localStorage.setItem(LocalStorageConstants.accessToken, data.accessToken);
            localStorage.setItem(LocalStorageConstants.user, JSON.stringify(data.user));
            showToast(ToastType.Info, "Logged in successfully"); // Show cuccess toast
        }
    }

    const updateProfile = (data: UserInformation) => {
        if (data) {
            setCurrentUser(data);
            localStorage.setItem(LocalStorageConstants.user, JSON.stringify(data));
        }
    }

    // Handle Logout
    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem(LocalStorageConstants.accessToken);
        localStorage.removeItem(LocalStorageConstants.user);
        setCurrentUser(undefined);
        showToast(ToastType.Info, "Logged out successfully"); // Show logout success toast
    }

    const value = { isAuthenticated, login, logout, updateProfile, currentUser, loading };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider};