import axios from '../../axios.customize';

export const createBaseLogAPI = async (classId, userId) => {
    const url = `/pms/attendance/base-log`;

    try {
        const response = await axios.post(url, null, {
            params: { classId, userId }
        });
        return response.data;
    } catch (error) {
        console.error("Error creating base log:", error);
        throw error;
    }
};

export const getClassLogAPI = async (classId) => {
    const url = `/pms/attendance/class-log`;

    try {
        const response = await axios.get(url, {
            params: { classId }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching class log:", error);
        throw error;
    }
}
