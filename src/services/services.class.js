import axios from '../../axios.customize';

export const getClassesAPI = async (page, className, ageRange) => {
    let URL = `/pms/classes?page=${page}`;
    if (className) URL += `&className=${className}`; // Replace schoolYear with className
    if (ageRange) URL += `&ageRange=${ageRange}`;
    return await axios.get(URL);
};

export const addClassAPI = async (classData) => {
    const URL = `/pms/classes/add`;
    return await axios.post(URL, classData);
}

export const getClassBaseOnTeacher = async (teacherId, page) => {
    const URL = `/pms/classes/class/teacher/${teacherId}?page=${page}`;
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
export const getClassListBaseOnManagerId = async (managerId) => {
    const url = `/pms/classes/${managerId}`;
    return await axios.get(url);
}

export const getClassesBaseOnStudentId = async (studentId) => {
    const url = `/pms/classes/byChildren/${studentId}`;
    return await axios.get(url);
}