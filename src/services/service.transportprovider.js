import axios from '../../axios.customize';

// API để thêm nhà cung cấp thức ăn
export const addtransportProviderAPI = async (transportProviderData, contractFile) => {
    const formData = new FormData();
    formData.append('tpa', new Blob([JSON.stringify(transportProviderData)], { type: 'application/json' }));
    formData.append('contractFile', contractFile);
    
    const URL = `/pms/transportServiceProvider/add`;
    return await axios.post(URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// API để lấy danh sách nhà cung cấp thức ăn với phân trang
export const gettransportProvidersAPI = async (page, isActive) => {
    const params = new URLSearchParams();

    if (page) {
        params.append('page', page);
    }
    if (isActive !== undefined) {
        params.append('isActive', isActive);
    }

    const URL = `/pms/transportServiceProvider?${params.toString()}`;
    return await axios.get(URL);
};

// API để cập nhật thông tin nhà cung cấp thức ăn
export const updatetransportProviderAPI = async (transportProviderId, updatetransportProviderData) => {
    const URL = `/pms/transportServiceProvider/change-information/${transportProviderId}`;
    return await axios.put(URL, updatetransportProviderData);
};

// API để thay đổi trạng thái của nhà cung cấp thức ăn
export const changeStatusAPI = async (id, status) => {
    const URL = `/pms/transportServiceProvider/change-status?transportProviderId=${id}&status=${status}`;
    return await axios.put(URL);
};

// API để lấy chi tiết nhà cung cấp thức ăn dựa trên ID
export const gettransportProviderDetailAPI = async (providerId) => {
    const URL = `/pms/transportServiceProvider/${providerId}`;
    return await axios.get(URL);
};
