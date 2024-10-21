import axios from '../../axios.customize';

export const addChildren = async (formData) => {
  return axios.post('/pms/children/new-children', formData);
};

export const getChildrenAPI = async (page, fullname, classId) => {
    const params = new URLSearchParams();

    if (page) {
        params.append('page', page);
    }
    if (fullname) {
        params.append('fullname', fullname);
    }
    if (classId) {
        params.append('classId', classId);
    }

    const URL = `/pms/children?${params.toString()}`;
    return await axios.get(URL);
};


export const getChildDetailAPI = async (childId) => {
    const URL = `/pms/children/${childId}`;
    return await axios.get(URL);
};



export const updateServiceStatus = async (childrenId, serviceName) => {
    const URL = `/pms/children/service/${childrenId}/${serviceName}`;
    return await axios.put(URL);
}