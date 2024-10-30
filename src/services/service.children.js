import axios from '../../axios.customize';

export const addChildren = async (formData) => {
    return axios.post('/pms/children/new-children', formData);
};

export const getChildrenAPI = async (page, academicYear) => {
    const url = `/pms/children?academicYear=${academicYear}&page=${page}`;
    return await axios.get(url);
};


export const getChildDetailAPI = async (childId) => {
    const url = `/pms/children/${childId}`;
    return await axios.get(url);
};



export const updateServiceStatus = async (childrenId, serviceName, routeId = null) => {
    const url = `/pms/children/service/${childrenId}/${serviceName}`;
    const params = routeId ? { routeId } : {};
    return await axios.put(url, null, { params });
};

export const getChildrenByClassAPI = async (classId, page) => {
    const url = `/pms/children/class/${classId}?page=${page}`;
    return await axios.get(url);
};
export const getChildrenByRoute = async (routeId, page) => {
    const url = `/pms/children/route/${routeId}?page=${page}`;
    return await axios.get(url);
};