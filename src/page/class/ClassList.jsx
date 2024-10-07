import { useCallback, useState, useEffect } from "react";
import NoData from "../../component/no-data-page/NoTeachers";
import { ClassTable } from "../../component/table/ClassTable";
import { getClassesAPI } from "../../services/services.class";
import { Pagination, Spin, Card, Row, Col, Input, Select } from "antd";


const { Option } = Select;

const ClassList = () => {
    const [classes, setClasses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchClasses = useCallback(async (page) => {
        setLoading(true);
        try {
            const response = await getClassesAPI(page, null, null);
            setClasses(response.data.listData);
            setTotal(response.data.total);
        } catch (error) {
            console.error('Error fetching classes:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchClasses(currentPage);
    }, [currentPage, fetchClasses]);

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
                        placeholder="Nhập tên lớp cần tìm"
                        enterButton
                        onSearch={(value) => console.log(value)}
                    />
                </Col>
            </Row>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <Spin size="large" />
                </div>
            ) : classes.length > 0 ? (
                <>
                    <ClassTable data={classes} />
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

export default ClassList;