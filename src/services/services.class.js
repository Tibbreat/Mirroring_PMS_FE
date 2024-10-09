import axios from '../../axios.customize';

export const getClassesAPI = async (page, schoolYear, ageRange) => {
    let URL = `/pms/classes?page=${page}`;
    if (schoolYear) URL += `&schoolYear=${schoolYear}`;
    if (ageRange) URL += `&ageRange=${ageRange}`;
    return await axios.get(URL);
}

export const addClassAPI = async (classData) => {
    const URL = `/pms/classes/add`;
    return await axios.post(URL, classData);
}

export const getClassBaseOnTeacher = async (teacherId, page) => {
    const URL = `/pms/classes/class/teacher/${teacherId}?page=${page}`;
    return await axios.get(URL);
}

export const getClassBaseOnManager = async (managerId, page) => {
    const URL = `/pms/classes/class/manager/${managerId}?page=${page}`;
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