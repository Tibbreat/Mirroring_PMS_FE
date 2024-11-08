import axios from '../../axios.customize';

export const getSchoolInformationAPI = async (schoolId) => {
    const url = `/pms/school?schoolId=${schoolId}`;
    return await axios.get(url);
}

export const getAcademicYearInformationAPI = async (schoolId, academicYear) => {
    const url = `/pms/school/academic-year?schoolId=${schoolId}&academicYear=${academicYear}`;
    return await axios.get(url);
}
export const updateSchoolInformationAPI = async (principalId, data) => {
}