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

export const handleExcelData = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
        const response = await axios.post("/pms/children/excel/import", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading Excel file:", error);
        throw error;
    }
};

export const saveChildrenFromExcel = async (childrenData) => {
    return axios.post(`/pms/children/excel/import/save`, childrenData);
}

export const uploadImageAPI = async (childrenId, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    return await axios.put(`/pms/children/upload-image/${childrenId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

// Download children data by vehicle 
export const exportChildrenToExcelByVehicle = async (vehicleId) => {
    const url = `/pms/children/excel/vehicle/${vehicleId}`;
    return await axios.get(url, {
        responseType: 'blob',
    });
};
export const getChildrenByTeacherIdAPI = async (teacherId) => {
    const url = `/pms/children/by-teacher/${teacherId}`;
    return await axios.get(url);
};

