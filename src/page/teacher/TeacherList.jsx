import { useCallback, useState, useEffect } from "react";
import NoData from "../../component/no-data-page/NoTeachers";
import TeacherTable from "../../component/table/TeacherTable";
import { getUsersAPI } from "../../services/services.user";
import { Pagination, Spin } from "antd";

const TeacherList = () => {
    const [teachers, setTeachers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0); 
    const [loading, setLoading] = useState(true); 

    const fetchTeachers = useCallback(async (page) => {
        setLoading(true); 
        try {
            const response = await getUsersAPI(page, "TEACHER", null);
            setTeachers(response.data.listData);
            setTotal(response.data.total);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        } finally {
            setLoading(false); // Set loading to false after fetching data
        }
    }, []);

    useEffect(() => {
        fetchTeachers(currentPage);
    }, [currentPage, fetchTeachers]);

    return (
        <>
            <div className="teacher-page-filter d-flex justify-content-center">
                <div className="col-8 d-flex">
                    <div className="col-2">
                        <select className="form-select" name="teacher-filter">
                            <option value="option 1">Option 1</option>
                            <option value="option 2">Option 2</option>
                        </select>
                    </div>

                    <div className="col-10">
                        <div className="form-outline" data-mdb-input-init>
                            <input
                                type="search"
                                id="form1"
                                className="form-control"
                                placeholder="Nhập tên giáo viên cần tìm"
                                aria-label="Search"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="teacher-page d-flex justify-content-center mt-3">
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center">
                        <Spin size="large" />
                    </div>
                ) : teachers.length === 0 ? (
                    <NoData
                        title="Không có giáo viên trong hệ thống"
                        subTitle="Danh sách giáo viên sẽ hiển thị khi bạn thêm dữ liệu"
                    />
                ) : (
                    <TeacherTable 
                        data={teachers} 
                        currentPage={currentPage} 
                        total={total} 
                        setCurrentPage={setCurrentPage} 
                    />
                )}
            </div>
        </>
    );
};

export default TeacherList;
