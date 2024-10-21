import axios from '../../axios.customize';

export const addVehicle = async (data) => {
    return await axios.post('/pms/vehicle/add', data);
};

export const getVehicles = async (transportProviderId, page) => {
    return await axios.get(`/pms/vehicle/provider/${transportProviderId}?page=${page}`);
};

export const getVehicleDetail = async (vehicleId) => {

};

export const updateVehicle = async (vehicleId, vehicleData) => {
    const URL = `/pms/vehicle/change-vehicle-information/${vehicleId}`;
    return await axios.put(URL, vehicleData);
};
export const changeStatusAPI = async (id, status) => {

};