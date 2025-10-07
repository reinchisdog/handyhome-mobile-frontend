import axios from "axios";

const api = axios.create({
   baseURL: `https://handyhome-mobile-backend.vercel.app/api/v1`,
   timeout: 10000,
   timeoutErrorMessage: 'Process Timed out. Check your internet connection and try again.'
});

export default api;
