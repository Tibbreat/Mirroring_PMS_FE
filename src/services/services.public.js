import axios from 'axios';

import axios_v2 from '../../axios.customize';

export const getBankListAPI = async () => {
    const URL = `https://api.vietqr.io/v2/banks`;
    return await axios.get(URL);
}

export const getAcademicYearsAPI = async () => {
    return await axios_v2.get("/pms/public/academic-year");
}