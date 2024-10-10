import axios from '../../axios.customize';

// API để thêm xe
export const addVehicle = async (vehicleData) => {
    const URL = `/pms/vehicle/add`;
    return await axios.post(URL, vehicleData);
};

// API để lấy danh sách xe với phân trang
export const getVehicles = async (page, model, brand, transportProviderId) => {
    const params = new URLSearchParams();

    if (page) {
        params.append('page', page);
    }
    if (model) {
        params.append('model', model);
    }
    if (brand) {
        params.append('brand', brand);
    }
    if (transportProviderId) {
        params.append('transportProviderId', transportProviderId);
    }

    const URL = `/pms/vehicle?${params.toString()}`;
    return await axios.get(URL);
};

// API để lấy chi tiết xe dựa trên ID
export const getVehicleDetail = async (vehicleId) => {
    const URL = `/pms/vehicle/vehicle-detail/${vehicleId}`;
    return await axios.get(URL);
};

// API để cập nhật thông tin xe
export const updateVehicle= async (vehicleId, vehicleData) => {
    const URL = `/pms/vehicle/change-vehicle-information/${vehicleId}`;
    return await axios.put(URL, vehicleData);
};
export const changeStatusAPI = async (id, status) => {
    const URL = `/pms/vehicle/change-vehicle-status/${id}?newStatus=${status}`;
    return await axios.put(URL);
};