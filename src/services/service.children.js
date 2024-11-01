import axios from '../../axios.customize';

export const addChildren = async (formData) => {
    return axios.post('/pms/children/new-children', formData);
};

export const getChildrenAPI = async (page, academicYear, childName) => {
    let url = `/pms/children?page=${page}`;
    if (academicYear) url += `&academicYear=${academicYear}`;
    if (childName) url += `&childName=${encodeURIComponent(childName)}`; // Add childName if provided
    return await axios.get(url);
};



export const getChildDetailAPI = async (childId) => {
    const url = `/pms/children/${childId}`;
    return await axios.get(url);
};

export const updateServiceStatus = async (childrenId, serviceName, routeId = null, vehicleId = null) => {
    const url = `/pms/children/service/${childrenId}/${serviceName}`;
    const params = {};

    if (routeId) params.routeId = routeId;
    if (vehicleId) params.vehicleId = vehicleId;

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
export const exportChildrenToExcelByClassId = async (classId) => {
    const url = `/pms/children/excel/${classId}`;
    return await axios.get(url, {
        responseType: 'blob', // Specify blob type to handle file download
    });
};

// Download children data by academic year
export const exportChildrenToExcelByAcademicYear = async (academicYear) => {
    const url = `/pms/children/excel/academic-year/${academicYear}`;
    return await axios.get(url, {
        responseType: 'blob', // Specify blob type to handle file download
    });
};