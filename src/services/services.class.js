import axios from '../../axios.customize';

export const getClassesAPI = async (academicYear) => {
    const url = `/pms/classes?academicYear=${academicYear}`;
    return await axios.get(url);
};

export const addClassAPI = async (classData) => {
    const URL = `/pms/classes/add`;
    return await axios.post(URL, classData);
}

export const getClassBaseOnTeacher = async (teacherId) => {
    const URL = `/pms/classes/class/teacher/${teacherId}`;
    return await axios.get(URL);
}

export const getClassBaseOnClassId = async (classId) => {
    const URL = `/pms/classes/class/${classId}`;
    return await axios.get(URL);
}

export const getTeacherOfClass = async (classId) => {
    const URL = `/pms/classes/teacher/class/${classId}`;
    return await axios.get(URL);
}
export const changeClassStatusAPI = async (classId) => {
    const URL = `/pms/classes/change-class-status/${classId}`;
    return await axios.put(URL);
}
export const changeClassInformationAPI = async (classId, data) => {
    const URL = `/pms/classes/change-class-description/${classId}`;
    return await axios.put(URL, data, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export const getClassList = async (academicYear) => {
    const url = `/pms/classes/available/${academicYear}`;
    return await axios.get(url);
}

export const getClassListToTransfer = async (academicYear, childrenId) => {
    const url = `/pms/classes/transfer-options/academic-year/${academicYear}/children/${childrenId}`;
    return await axios.get(url);
}
export const getClassListBaseOnManagerId = async (managerId) => {
    const url = `/pms/classes/${managerId}`;
    return await axios.get(url);
}

export const getClassesBaseOnStudentId = async (studentId) => {
    const url = `/pms/classes/byChildren/${studentId}`;
    return await axios.get(url);
}

export const getKitchenReport = async (academicYear) => {
    const url = `/pms/classes/kitchen/report/${academicYear}`;
    return await axios.get(url);
}