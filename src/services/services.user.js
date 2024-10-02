import axios from '../../axios.customize';

export const getUsersAPI = async (page, role, isActive) => {
    let URL = `/pms/users?page=${page}`;
    if (role) URL += `&role=${role}`;
    if (isActive) URL += `&isActive=${isActive}`;
    return await axios.get(URL);
}

export const getUserAPI = async (id) => {
    const URL = `/pms/users/user/${id}`;
    return await axios.get(URL);
}

export const addUserAPI = async (userData) => {
    const URL = `/pms/users/user`;
    return await axios.post(URL, userData);

}