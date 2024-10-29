import axios from '../../axios.customize';

export const getSchoolInformationAPI = async (schoolId) => {
    const URL = `/pms/school?schoolId=${schoolId}`;
    return await axios.get(URL);
}

export const updateSchoolInformationAPI = async (principalId, data) => {
}