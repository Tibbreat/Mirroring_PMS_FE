import { useCallback, useEffect, useState } from "react";
import { getUsersAPI } from "../../services/services.user";
import { Button, Card, Col, Input, Pagination, Row, Select, Spin } from "antd";
import StaffTable from "../../component/table/StaffTable";
import NoData from "../../component/no-data-page/NoTeachers";

export const StaffList = () => {
    const [staff, setStaff] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchStaff = useCallback(async (page) => {
        setLoading(true);
        try {
            const response = await getUsersAPI(currentPage, ["KITCHEN_MANAGER", "CLASS_MANAGER", "TRANSPORT_MANAGER"], null);
            setStaff(response.data.listData)
            setTotal(response.data.total);
        } catch (error) {
            console.error('Error fetching staffs:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStaff(staff);
    }, [currentPage], fetchStaff)
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
                        placeholder="Nhập tên nhân viên cần tìm"
                        enterButton
                        onSearch={(value) => console.log(value)}
                    />
                </Col>
            </Row>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <Spin size="large" />
                </div>
            ) : staff.length > 0 ? (
                <>
                    <Col span={24} style={{ marginBottom: 20, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type="primary" >Thêm quản lý</Button>
                    </Col>
                    <StaffTable data={staff} />
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
}