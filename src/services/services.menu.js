import axios from '../../axios.customize';


export const addNewMenu = async (data) => {
    return await axios.post('/pms/daily-menu/new-daily-menu', data);
}

export const getDailyMenuByDate = (date) => {
    return axios.get(`/pms/daily-menu/get-daily-menu/${date}`);
};

export const getMonthlyMenu = (year, month) => {
    return axios.get(`/pms/daily-menu/get-monthly-menu/${year}/${month}`);
};