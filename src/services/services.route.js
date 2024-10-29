import axios from '../../axios.customize';

export const fetchRoutesAPI = async (page) => {
    const url = `/pms/route/all-routes?page=${page}`;
    return await axios.get(url);
}
export const fetchAvailableRoutesAPI = async (page) => {
    const url = `/pms/route/available`;
    return await axios.get(url);
}

export const newRouteAPI = async (data) => {
    const url = `/pms/route/new-route`;
    return await axios.post(url, data);
}

export const fetchRouteAPI = async(id) => {
    const url = `/pms/route/${id}`;
    return await axios.get(url);
}

export const fetchStopLocationAPI = async(id) => {
    const url = `/pms/route/stop-location/${id}`;
    return await axios.get(url);
}
