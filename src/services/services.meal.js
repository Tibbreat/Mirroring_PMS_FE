import axios from '../../axios.customize';

export const createMeal = async (data) => {
    const url = `/pms/meal/create`
    return axios.post(url, data);
}

export const getMealsByDate = async (date) => {
    const url = `/pms/meal/date/${date}`;
    return axios.get(url);
}

export const getMealsByMonth = async (yearMonth) => {
    const url = `/pms/meal/month/${yearMonth}`;
    return axios.get(url);
}

export const getMealsByWeek = async () => {
    const url = `/pms/meal/week`;
    return axios.get(url);
}