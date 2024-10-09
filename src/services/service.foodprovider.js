import axios from '../../axios.customize';

// API để thêm nhà cung cấp thức ăn
export const addFoodProviderAPI = async (foodProviderData, contractFile) => {
    const formData = new FormData();
    formData.append('fpa', new Blob([JSON.stringify(foodProviderData)], { type: 'application/json' }));
    formData.append('contractFile', contractFile);
    
    const URL = `/pms/foodServiceProvider/add`;
    return await axios.post(URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// API để lấy danh sách nhà cung cấp thức ăn với phân trang
export const getFoodProvidersAPI = async (page, isActive) => {
    const params = new URLSearchParams();

    if (page) {
        params.append('page', page);
    }
    if (isActive !== undefined) {
        params.append('isActive', isActive);
    }

    const URL = `/pms/foodServiceProvider?${params.toString()}`;
    return await axios.get(URL);
};

// API để cập nhật thông tin nhà cung cấp thức ăn
export const updateFoodProviderAPI = async (foodProviderId, updateFoodProviderData) => {
    const URL = `/pms/foodServiceProvider/change-information/${foodProviderId}`;
    return await axios.put(URL, updateFoodProviderData);
};

// API để thay đổi trạng thái của nhà cung cấp thức ăn
export const changeStatusAPI = async (id, status) => {
    const URL = `/pms/foodServiceProvider/change-status?id=${id}&status=${status}`;
    return await axios.put(URL);
};

// API để lấy chi tiết nhà cung cấp thức ăn dựa trên ID
export const getFoodProviderDetailAPI = async (providerId) => {
    const URL = `/pms/foodServiceProvider/${providerId}`;
    return await axios.get(URL);
};
