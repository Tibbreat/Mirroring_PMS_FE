import axios from 'axios';

const instance = axios.create({
    // baseURL: 'http://localhost:8080',  
    baseURL: 'http://157.66.27.65:9999',  
});

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
