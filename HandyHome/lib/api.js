import axios from "axios";

const api = axios.create({
   baseURL: `http://192.168.254.100:5001/api/v1`,
   timeout: 10000,
   timeoutErrorMessage: 'Process Timed out. Check your internet connection and try again.'
});

export default api;