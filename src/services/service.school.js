import axios from '../../axios.customize';

export const getSchoolInformationAPI = async (schoolId) => {
    const url = `/pms/school?schoolId=${schoolId}`;
    return await axios.get(url);
}

export const getAcademicYearInformationAPI = async (academicYear) => {
    const url = `/pms/public/school/academic-year?academicYear=${academicYear}`;
    return await axios.get(url);
}
export const updateAcademicInformation = async (data) => {
    const url = `/pms/school/update-academic-information`;
    return await axios.put(url, data);
}