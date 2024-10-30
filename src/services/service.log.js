import axios from '../../axios.customize';

export const createBaseLogAPI = async (classId, today) => {
    const url = `/pms/attendance/${classId}?today=${today}`;
    return await axios.get(url);
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
