import axios from '../../axios.customize';

export const addtransportProviderAPI = async (data) => {
    return await axios.post("/pms/transport-service-provider/add", data);
};

export const gettransportProvidersAPI = async (page, isActive) => {
    return await axios.get(`/pms/transport-service-provider?page=${page}`);
};

export const updateStatusTransportProviderAPI = async (providerId) => {
    return await axios.put(`/pms/transport-service-provider/status/${providerId}`);
}

export const gettransportProviderDetailAPI = async (providerId) => {
    return await axios.get(`/pms/transport-service-provider/${providerId}`);
};
