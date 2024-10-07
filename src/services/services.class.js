import axios from '../../axios.customize';

export const getClassesAPI = async (page, schoolYear, ageRange) => {
    const token = localStorage.getItem('authToken'); // Assuming the token is stored in localStorage
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    let URL = `/pms/classes?page=${page}`;
    if (schoolYear) URL += `&schoolYear=${schoolYear}`;
    if (ageRange) URL += `&ageRange=${ageRange}`;
    return await axios.get(URL, { headers });
}