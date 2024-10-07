import { useCallback, useState, useEffect } from "react";
import NoData from "../../component/no-data-page/NoTeachers";
import TeacherTable from "../../component/table/TeacherTable";
import { getUsersAPI } from "../../services/services.user";
import { Pagination, Spin, Card, Row, Col, Input, Select } from "antd";

const { Option } = Select;

const TeacherList = ({ onTeacherAdded }) => {
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

    const handleTeacherAdded = () => {
        fetchTeachers(currentPage); // Reload the teacher table when a teacher is added
    };

    return (
        <Card style={{ margin: 20 }}>
            <Row gutter={[16, 16]} justify="center" style={{ marginBottom: 20 }}>
                <Col xs={24} sm={8}>
                    <Select defaultValue="option 1" style={{ width: '100%' }}>
                        <Option value="option 1">Option 1</Option>
                        <Option value="option 2">Option 2</Option>
                    </Select>
                </Col>
                <Col xs={24} sm={16}>
                    <Input.Search
                        placeholder="Nhập tên giáo viên cần tìm"
                        enterButton
                        onSearch={(value) => console.log(value)}
                    />
                </Col>
            </Row>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <Spin size="large" />
                </div>
            ) : teachers.length > 0 ? (
                <>
                    <TeacherTable data={teachers} />
                    <Pagination
                        current={currentPage}
                        total={total}
                        onChange={(page) => setCurrentPage(page)}
                        style={{ textAlign: 'center', marginTop: 20 }}
                    />
                </>
            ) : (
                <NoData />
            )}
        </Card>
    );
};

export default TeacherList;