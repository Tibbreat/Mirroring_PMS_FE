import axios from '../../axios.customize';



// API để thêm trẻ
export const addChildAPI = async (
    childImage,
    parentImage1,
    parentImage2,
    addChildrenRequest,
    addUserRequest1,
    addUserRequest2
) => {
    const formData = new FormData();

    // Thêm hình ảnh trẻ
    if (childImage) {
        formData.append('childImage', childImage);
    }

    // Thêm hình ảnh phụ huynh (nếu có)
    if (parentImage1) {
        formData.append('parentImage1', parentImage1);
    }
    if (parentImage2) {
        formData.append('parentImage2', parentImage2);
    }

    // Thêm dữ liệu cho AddChildrenRequest
    formData.append('request', new Blob([JSON.stringify(addChildrenRequest)], { type: 'application/json' }));

    // Thêm dữ liệu cho AddUserRequest phụ huynh 1
    if (addUserRequest1) {
        formData.append('request1', new Blob([JSON.stringify(addUserRequest1)], { type: 'application/json' }));
    }

    // Thêm dữ liệu cho AddUserRequest phụ huynh 2
    if (addUserRequest2) {
        formData.append('request2', new Blob([JSON.stringify(addUserRequest2)], { type: 'application/json' }));
    }

    // Gọi API để thêm trẻ
    const response = await axios.post('/pms/children/add', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};



// Get children with filters (pagination, fullname, classId)
export const getChildrenAPI = async (page, fullname, classId) => {
    const params = new URLSearchParams();

    if (page) {
        params.append('page', page);
    }
    if (fullname) {
        params.append('fullname', fullname);
    }
    if (classId) {
        params.append('classId', classId);
    }

    const URL = `/pms/children?${params.toString()}`;
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