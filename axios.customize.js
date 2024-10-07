import axios from 'axios';

// Create axios instance
const instance = axios.create({
    baseURL: 'http://localhost:8080',
});

// Request interceptor
instance.interceptors.request.use(
    (config) => {
        const token = window.localStorage.getItem('access_token');
        if (token && config.url.startsWith('/pms')) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
instance.interceptors.response.use(
    (response) => {
        if (response.data && response.data.data) {
            return response.data;
        }
        return response;
    },
    (error) => {
        if (error.response) {
            return Promise.reject(error.response);
        }
        return Promise.reject(error);
    }
);

export default instance;