import axios from '../../axios.customize';

export const getUsersAPI = async (schoolId, page, role, isActive, fullName) => {
    let params = new URLSearchParams();

    if (page) {
        params.append('page', page);
    }
    if (role && Array.isArray(role)) {
        role.forEach(r => params.append('role', r));
    }
    if (isActive !== undefined) { // Use !== undefined to allow both true and false
        params.append('isActive', isActive);
    }
    if (fullName) {
        params.append('fullName', fullName);
    }

    const URL = `/pms/users/school/${schoolId}?${params.toString()}`;
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

export const getUserOpnionAPI = async (role) => {
    const URL = `/pms/users/options?role=${role}`;
    return axios.get(URL);
}
export const getUserOpnionWithUserNameAPI = async (role) => {
    const URL = `/pms/users/option-username?role=${role}`;
    return axios.get(URL);
}
export const getParentWithUserNameAPI = async (teacherId) => {
    const URL = `/pms/users/parents-by-teacher/${teacherId}`;
    return axios.get(URL);
}

export const getTeacherAvailableInYear = async(academicYear) => {
    const url = `/pms/users/options/available-teacher/${academicYear}`;
    return axios.get(url);
}
export const changeUserDescription = async (userId, formData) => {
    const URL = `/pms/users/update-user/${userId}`;
    
    return axios.put(URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};