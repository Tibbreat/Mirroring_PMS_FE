import axios from '../../axios.customize';

export const getClassesAPI = async (page, schoolYear, ageRange) => {
    let URL = `/pms/classes?page=${page}`;
    if (schoolYear) URL += `&schoolYear=${schoolYear}`;
    if (ageRange) URL += `&ageRange=${ageRange}`;
    return await axios.get(URL);
}