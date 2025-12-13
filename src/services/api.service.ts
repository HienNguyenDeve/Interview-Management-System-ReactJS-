import axios, { AxiosInstance } from "axios";
import { LocalStorageConstants } from "../constants/localStorage.constant";
import { hideSpinner, showSpinner } from "../core/common/Spinner";
import { jwtDecode } from "jwt-decode";

const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_API_URL
});

interface JwtPayload {
    exp: number;
}

const isTokenExpired = (token: string): boolean => {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now().valueOf() / 1000;
    return decoded.exp < currentTime;
};

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(LocalStorageConstants.accessToken);
        if (token) {
            if (isTokenExpired(token)) {
                // Auto logout
                localStorage.removeItem(LocalStorageConstants.accessToken);
                localStorage.removeItem(LocalStorageConstants.user);
                window.location.href = "/auth/login?tokenExpired=true";
                return Promise.reject(new Error("Token expired"));
            }
            config.headers.Authorization = `Bearer ${token}`;
        }
        showSpinner();
        return config;
    },
    (error) => {
        return Promise.reject(new Error(error));
    }
);

api.interceptors.response.use(
    (response) => {
        hideSpinner();
        return response;
    },
    (error) => {
        hideSpinner();
        return Promise.reject(new Error(error.message || error));
    }
);

export default api;

// Refresh Token tự động

// Retry request khi token hết hạn

// Phòng lỗi 429 rate limit

// Logging request/response

// Toast error tự động trong Interceptor