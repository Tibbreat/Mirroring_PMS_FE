import axios from 'axios';

// Tạo instance của axios
const instance = axios.create({
    baseURL: 'http://localhost:8080',
});

// Interceptor cho request
instance.interceptors.request.use(
    function (config) {
        const token = window.localStorage.getItem('access_token');  
        if (token && config.url.startsWith('/pms')) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// Interceptor cho response
instance.interceptors.response.use(
    function (response) {
        if (response.data && response.data.data) {
            return response.data;
        }
        return response;
    },
    function (error) {
        if (error.response) {
            return Promise.reject(error.response);
        } else {
            return Promise.reject(error);
        }
    }
);

export default instance;
