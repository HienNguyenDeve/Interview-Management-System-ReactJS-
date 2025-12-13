import api from "./api.service";

const apiUrl = "files";

const uploadFileToAzure = async (file: File): Promise<string | undefined> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post<string>(`${apiUrl}/upload-file`, formData)
    return response.data;
}

const fileService = {
    uploadFileToAzure
}

export default fileService;