import axios from '../../axios.customize';

export const loginAPI = async (username, password) => {
    const URL = "/pms/auth/login";
    const login_request = {
        username: username,
        password: password
    }
    return await axios.post(URL, login_request)
}

export const getAccountAPI = async () => {

    const URL = "/pms/auth/account";
    return await axios.get(URL)
}
export const logoutAPI = async () => {
    const URL = "/pms/auth/logout";
    return await axios.post(URL);
}

