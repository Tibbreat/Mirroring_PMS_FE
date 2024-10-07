import axios from '../../axios.customize';

export const getUsersAPI = async (page, role, isActive) => {
    let URL = `/pms/users?page=${page}`;
    if (role) URL += `&role=${role}`;
    if (isActive) URL += `&isActive=${isActive}`;
    return axios.get(URL);
};

export const getUserAPI = async (id) => {
    const URL = `/pms/users/user/${id}`;
    return axios.get(URL);
};

export const addUserAPI = async (userData) => {
    const URL = `/pms/users/user`;
    return axios.post(URL, userData);
};

export const changeUserStatusAPI = async (userId) => {
    const URL = `/pms/users/user/${userId}/status`;
    return axios.put(URL);
};