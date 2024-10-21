import axios from '../../axios.customize';

export const getSchoolInformationAPI = async (principalId) => {
    const URL = `/pms/school?principalId=${principalId}`;
    return await axios.get(URL);
}

export const updateSchoolInformationAPI = async (principalId, data) => {
}