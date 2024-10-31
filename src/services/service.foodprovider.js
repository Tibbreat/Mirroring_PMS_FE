import axios from '../../axios.customize';

//Đơn vị cung cấp thực phẩm
export const addFoodProviderAPI = async (data) => {
    return await axios.post("/pms/food-service-provider/add", data);
};

export const getFoodProvidersAPI = async (page) => {
    return await axios.get(`/pms/food-service-provider?page=${page}`);
};

export const getFoodProviderDetailAPI = async (providerId) => {
    return await axios.get(`/pms/food-service-provider/${providerId}`);
};

export const updateStatusFoodProviderAPI = async (providerId) => {
    return await axios.put(`/pms/food-service-provider/status/${providerId}`);
}


//Yêu cầu thực phẩm
export const requestFoodAPI = async (data) => {
    return await axios.post("/pms/food-request/add", data);
};

export const getFoodRequestsAPI = async (providerId, page) => {
    return await axios.get(`/pms/food-request/provider/${providerId}?page=${page}`);
};

export const getFoodRequestItems = async (requestId) => {
    return await axios.get(`/pms/food-request/request/${requestId}`);
};

export const updateAcceptFoodRequestAPI = async (requestId, status, data) => {
    return await axios.put(`/pms/food-request/accept/${requestId}?status=${status}`, data);
};