import axios from 'axios';

const baseURL = 'http://localhost:3001'

const axiosInstance = axios.create({
    baseURL
})

export const getEmbedUrl = async (signatureId) => {
    const { data } = await axiosInstance.get(`/embed/${signatureId}`)
    return data;
}
