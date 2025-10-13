import axios from "axios";

const api = axios.create({
   baseURL: process.env.EXPO_PUBLIC_API_URL,
   timeout: 10000,
   timeoutErrorMessage: 'Process Timed out. Check your internet connection and try again.'
});

export default api;
