import axios from 'axios';

const baseURL = 'http://localhost:3001'

const axiosInstance = axios.create({
    baseURL
})

export const getEmbedUrl = async (signatureId) => {
    const { data } = await axiosInstance.get(`/embed/${signatureId}`)
    return data;
}

export const generateEmail = async (body) => {
    const { data } = await axiosInstance.post(`/generate/email`, body)
    return data;
}

export const getRequests = async (email, page) => {
    const { data } = await axiosInstance.get(`/requests?email=${email}&page=${page}`)
    return data;
}