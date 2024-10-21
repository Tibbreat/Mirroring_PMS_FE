import axios from '../../axios.customize';

export const addtransportProviderAPI = async (data) => {
    return await axios.post("/pms/transport-service-provider/add", data);
};

export const gettransportProvidersAPI = async (page, isActive) => {
    return  await axios.get(`/pms/transport-service-provider?page=${page}`);
};

export const updateTransportProvider = async (id, data) => {

};

export const changeStatusAPI = async (id, status) => {

};

export const gettransportProviderDetailAPI = async (providerId) => {
    return await axios.get(`/pms/transport-service-provider/${providerId}`);
};
