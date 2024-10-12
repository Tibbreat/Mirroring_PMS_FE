import axios from '../../axios.customize';

// Add a new child with an image
export const addChildAPI = async (childData, image) => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('request', new Blob([JSON.stringify(childData)], { type: 'application/json' }));
    const URL = `/pms/children/add`;
    return await axios.post(URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// Get children with filters (pagination, fullname, classId)
export const getChildrenAPI = async (page, fullname = '', classId = '') => {
    const URL = `/pms/children?page=${page}&fullname=${fullname}&classId=${classId}`;
    return await axios.get(URL);
};

// Get child details by ID
export const getChildDetailAPI = async (childId) => {
    const URL = `/pms/children/children-detail/${childId}`;
    return await axios.get(URL);
};

// Update transport registration status
export const updateTransportRegistrationAPI = async (childId, isRegisteredForTransport) => {
    const URL = `/pms/children/update-transport/${childId}?isRegisteredForTransport=${isRegisteredForTransport}`;
    return await axios.put(URL);
};

// Update boarding registration status
export const updateBoardingRegistrationAPI = async (childId, isRegisteredForBoarding) => {
    const URL = `/pms/children/update-boarding/${childId}?isRegisteredForBoarding=${isRegisteredForBoarding}`;
    return await axios.put(URL);
};

// Update child information with optional image
export const updateChildAPI = async (childId, updateData, image = null) => {
    const formData = new FormData();
    formData.append('updateRequest', new Blob([JSON.stringify(updateData)], { type: 'application/json' }));
    if (image) {
        formData.append('image', image);
    }
    const URL = `/pms/children/change-information/${childId}`;
    return await axios.put(URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// Get children by class ID (with pagination)
export const getChildrenByClassAPI = async (classId, page) => {
    const URL = `/pms/children/children-by-class/${classId}?page=${page}`;
    return await axios.get(URL);
};

// Get children by class ID (without pagination)
export const getChildrenByClassWithoutPaginationAPI = async (classId) => {
    const URL = `/pms/children/class/${classId}`;
    return await axios.get(URL);
};