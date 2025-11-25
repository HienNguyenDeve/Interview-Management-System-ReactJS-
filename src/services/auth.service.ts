import axios, { AxiosInstance } from "axios";
import { LoginResponseModel } from "../models/auth/login-response.model";
import { LocalStorageConstants } from "../constants/localStorage.constant";
import LoginRequestModel from "../models/auth/login-request.model";

const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_API_AUTH_URL,
});

const login = async (data: LoginRequestModel) => {
    const response = await api.post<LoginResponseModel>('/login', data);

    if (response) {
        localStorage.setItem(LocalStorageConstants.accessToken, response.data.accessToken);
        localStorage.setItem(LocalStorageConstants.user, JSON.stringify(response.data.user));
    }

    return response
}

const logout = () => {
    localStorage.removeItem(LocalStorageConstants.accessToken);
    localStorage.removeItem(LocalStorageConstants.user);
}

export const AuthService = {
    login,
    logout
}