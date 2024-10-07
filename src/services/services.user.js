import axios from '../../axios.customize';

export const getUsersAPI = async (page, role, isActive) => {
    const params = new URLSearchParams();

    if (page) {
        params.append('page', page);
    }
    if (role && Array.isArray(role)) {
        role.forEach(r => params.append('role', r));
    }

    if (isActive) URL += `&isActive=${isActive}`;

    const URL = `/pms/users?${params.toString()}`;
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