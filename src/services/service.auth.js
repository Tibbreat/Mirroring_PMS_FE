import axios from '../../axios.customize';

export const loginAPI = async (username, password) => {
    const URL = "/pms/auth/login";
    const loginRequest = { username, password };
    return axios.post(URL, loginRequest);
};

export const getAccountAPI = async () => {
    const URL = "/pms/auth/account";
    return axios.get(URL);
};

export const logoutAPI = async () => {
    const URL = "/pms/auth/logout";
    return axios.post(URL);
};