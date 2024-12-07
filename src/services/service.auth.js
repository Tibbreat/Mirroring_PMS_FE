import axios from '../../axios.customize';

export const loginAPI = async (username, password) => {
    const url = "/pms/auth/login";
    const loginRequest = { username, password };
    return axios.post(url, loginRequest);
};

export const getAccountAPI = async () => {
    const url = "/pms/auth/account";
    return axios.get(url);
};

export const logoutAPI = async () => {
    const url = "/pms/auth/logout";
    return axios.post(url);
};

export const generateCodeAPI = async (email) => {
    const url = `/pms/auth/generate-code?email=${email}`;
    return axios.get(url);
}

export const changePasswordAPI = async (changePasswordRequest) => {
    const url = "/pms/auth/change-password";
    return axios.put(url, changePasswordRequest);
}