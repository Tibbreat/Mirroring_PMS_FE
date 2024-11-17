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

export const fetchRouteAPI = async (id) => {
    const url = `/pms/route/${id}`;
    return await axios.get(url);
}

export const fetchStopLocationAPI = async (id) => {
    const url = `/pms/route/stop-location/${id}`;
    return await axios.get(url);
}

export const changeStatusRouteAPI = async (id) => {
    const url = `/pms/route/change-status/${id}`;
    return await axios.put(url);
}

export const fetchRouteApplications = async (academicYear, routeId) => {
    let url = `/api/application/get-all-application-form/${academicYear}`;
    if (routeId) {
        url += `?routeId=${routeId}`;
    }
    return await axios.get(url);
}

export const fetchRouteReportByAcademicYear = async (academicYear) => {
    const url = `/api/application/get-all-route-report/${academicYear}`;
    return await axios.get(url);
}

export const approveApplicationAPI = async (data) => {
    const url = `/api/application/approve-application`;
    return await axios.put(url, data);
}