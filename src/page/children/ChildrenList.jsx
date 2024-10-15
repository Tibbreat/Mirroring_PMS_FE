import { Pagination, Spin, Card, Row, Col, Input, Select, Button, Form, Modal, notification } from "antd";
import { useCallback, useState, useEffect, useContext } from "react";
import { ChildrenTable } from "../../component/table/ChildrenTable";
import { getChildrenAPI } from "../../services/service.children";
import { AuthContext } from "../../component/context/auth.context";
import NoData from "../../component/no-data-page/NoData";
import { useNavigate } from "react-router-dom";
const ChildrenList = () => {
    const [loading, setLoading] = useState(true);
    const [childrenList, setChildrenList] = useState(null);
    const [form] = Form.useForm();
    const { user } = useContext(AuthContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();
    const fetchChildrenList = useCallback(async (page) => {
        setLoading(true);
        try {
            const response = await getChildrenAPI(page, null); // isActive is null here
            setChildrenList(response.data.listData);
            setTotal(response.data.total);
        } catch (error) {
            console.error('Error fetching provider:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchChildrenList(currentPage);
    }, [currentPage, fetchChildrenList]);
    return (
    <Card style={{ margin: 20 }}>
        <Row gutter={[16, 16]} justify="center" style={{ marginBottom: 20 }}>
            <Col xs={24} sm={16}>
                <Input.Search
                    placeholder="Nhập tên trẻ cần tìm"
                    enterButton
                    onSearch={(value) => console.log(value)}
                />
            </Col>
        </Row>
        <Col span={24} style={{ marginBottom: 20, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" onClick={() => navigate('/pms/manage/children/add-children')} >
                Thêm học sinh
            </Button>
        </Col>
        {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <Spin size="large" />
            </div>
        ) : childrenList.length > 0 ? (
            <>

                <ChildrenTable data={childrenList}
                    providerType="transport" />
                <Pagination
                    current={currentPage}
                    total={total}
                    onChange={(page) => setCurrentPage(page)}
                    style={{ textAlign: 'center', marginTop: 20 }}
                />
            </>
        ) : (
            <div className="d-flex justify-content-center align-items-center">
                <NoData
                    title={"Không có trẻ nào"}
                    subTitle={"Danh sách trẻ sẽ xuất hiện khi bạn thêm dữ liệu vào hệ thống"}
                />
            </div>

        )}
        

    </Card>
    );
};

export default ChildrenList;