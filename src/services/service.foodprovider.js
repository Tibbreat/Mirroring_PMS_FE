import axios from '../../axios.customize';

export const addFoodProviderAPI = async (data) => {
    return  await axios.post("/pms/food-service-provider/add", data);
};

export const getFoodProvidersAPI = async (page) => {
    return  await axios.get(`/pms/food-service-provider?page=${page}`);
};


export const updateFoodProviderAPI = async (foodProviderId, updateFoodProviderData) => {

};


export const changeStatusAPI = async (id, status) => {

};

// API để lấy chi tiết nhà cung cấp thức ăn dựa trên ID
export const getFoodProviderDetailAPI = async (providerId) => {
    return  await axios.get(`/pms/food-service-provider/${providerId}`);
};
