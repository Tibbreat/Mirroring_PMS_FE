import { useCallback, useState, useEffect } from "react";
import { Pagination, Spin, Card, Row, Col, Input, Select, Button, Form, Modal } from "antd";
import NoData from "../../../component/no-data-page/NoData";
import { ProviderTable } from "../../../component/table/ProviderTable";

const ListFoodProvider = () => {
    const [provider, setProvider] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const fetchProvider = useCallback(async (page) => {
        setLoading(true);
        try {

            setProvider(response.data.listData);
            setTotal(response.data.total);
        } catch (error) {
            console.error('Error fetching provider:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProvider(currentPage);
    }, [currentPage, fetchProvider]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            console.log('Form values:', values);
            // Add your logic to handle form submission here
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            console.error('Form validation failed:', error);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    return (
        <Card style={{ margin: 20 }}>
            <Row gutter={[16, 16]} justify="center" style={{ marginBottom: 20 }}>
                <Col xs={24} sm={16}>
                    <Input.Search
                        placeholder="Nhập tên nhà cung cấp cần tìm"
                        enterButton
                        onSearch={(value) => console.log(value)}
                    />
                </Col>
            </Row>
            <Col span={24} style={{ marginBottom: 20, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" onClick={() => setIsModalOpen(true)} >Thêm đối tác</Button>
            </Col>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <Spin size="large" />
                </div>
            ) : provider.length > 0 ? (
                <>

                    <ProviderTable data={provider} />
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
                        title={"Không có nhà cung cấp vận chuyển nào"}
                        subTitle={"Danh sách nhà cung cấp sẽ xuất hiện khi bạn thêm dữ liệu vào hệ thống"}
                    />
                </div>

            )}
            <Modal
                title="Thêm đối tác"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}> Hủy</Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>Thêm</Button>
                ]}
                width={800}
            >

            </Modal>
        </Card>
    );
};

export default ListFoodProvider;