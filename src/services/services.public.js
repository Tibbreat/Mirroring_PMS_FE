import axios from 'axios';

export const getBankListAPI = async () => {
    const URL = `https://api.vietqr.io/v2/banks`;
    return await axios.get(URL);
}
