import api from "./api.service"
import qs from "qs";


export const BaseService = <B, M, R, F, P>(apiUrl: string) => ({
    getAll: async (): Promise<B[] | undefined> => {
        try {
            const response = await api.get<B[]>(apiUrl);
            return response.data;
        } catch (error) {
            console.error('Error', error);
            return undefined;
        }
    },
    getById: async (id: string): Promise<M | undefined> => {
        try {
            const response = await api.get<M>(`${apiUrl}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error', error);
            return undefined;
        }
    },
    search: async (filter: F): Promise<P | undefined> => {
        try {
            const response = await api.get<P>(`${apiUrl}/search`, {
                params: filter,
                paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
            });
            return response.data;
        } catch (error) {
            console.error('Error', error);
            return undefined;
        }
    },
    create: async (data: R): Promise<R | undefined> => {
        try {
            const response = await api.post<R>(apiUrl, data);
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            return undefined;
        }
    },
    update: async (id: string, data: R): Promise<R | undefined> => {
        try {
            const response = await api.put<R>(`${apiUrl}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error', error);
            return undefined;
        }
    },
    remove: async (id: string): Promise<boolean> => {
        try {
            const response = await api.delete<boolean>(`${apiUrl}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    }
});