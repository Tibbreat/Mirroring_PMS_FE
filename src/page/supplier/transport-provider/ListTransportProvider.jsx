import { useCallback, useState, useEffect, useContext } from "react";
import { Pagination, Spin, Card, Row, Col, Input, Select, Button, Form, Modal, notification } from "antd";
import NoData from "../../../component/no-data-page/NoData";
import { ProviderTable } from "../../../component/table/ProviderTable";
import UploadContract from "../../../component/input/UploadContract";
import { AuthContext } from "../../../component/context/auth.context";
import { addtransportProviderAPI, gettransportProvidersAPI } from "../../../services/service.transportprovider";



const ListTransportProvider = () => {
    const [form] = Form.useForm();
    const { user } = useContext(AuthContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [provider, setProvider] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const fetchProvider = useCallback(async (page) => {
        setLoading(true);
        try {
            const response = await gettransportProvidersAPI(page, null); // isActive is null here
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
            const payload = {
                ...values,
                createdBy: user.id,
            };

            console.log('Contract file:', imageFile); // Kiểm tra file hợp đồng

            try {
                const response = await addtransportProviderAPI(payload, imageFile); // Gửi payload kèm theo file hợp đồng
                fetchProvider(currentPage);
                setIsModalOpen(false);
                notification.success({
                    message: "Thêm nhà cung cấp thành công",
                });
                form.resetFields();
            } catch (error) {
                console.error('Error adding transport provider:', error);
                notification.error({
                    message: "Lỗi khi thêm nhà cung cấp",
                    description: error.message,
                });
            }
        } catch (error) {
            console.error('Form validation failed:', error);
            notification.error({
                message: "Form validation failed",
                description: "Vui lòng kiểm tra lại các trường nhập liệu.",
            });
        }
    };
    const handleImageChange = (file) => {
        setImageFile(file);
        form.setFieldsValue({ contractFile: file }); // Cập nhật giá trị vào form
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

                    <ProviderTable data={provider}
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
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item label="Hợp đồng" name="contractFile">
                                <UploadContract onImageChange={handleImageChange} />
                            </Form.Item>
                        </Col>
                        <Col span={16}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="providerName"
                                        label="Tên nhà cung cấp"
                                        rules={[{ required: true, message: 'Vui lòng nhập tên nhà cung cấp' }]}
                                    >
                                        <Input placeholder="Nhập tên nhà cung cấp" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="representativeName"
                                        label="Tên đại diện"
                                        rules={[{ required: true, message: 'Vui lòng nhập tên đại diện' }]}
                                    >
                                        <Input placeholder="Nhập tên đại diện" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="providerEmail"
                                        label="Email"
                                        rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}
                                    >
                                        <Input placeholder="Nhập email" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="providerAddress"
                                        label="Địa chỉ"
                                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                                    >
                                        <Input placeholder="Nhập địa chỉ" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="providerRegisterNumber"
                                        label="Số đăng kí"
                                        rules={[{ required: true, message: 'Vui lòng nhập số đăng kí' }]}
                                    >
                                        <Input placeholder="Nhập số đăng kí" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="providerLicenseNumber"
                                        label="Số bằng"
                                        rules={[{ required: true, message: 'Vui lòng nhập số bằng' }]}
                                    >
                                        <Input placeholder="Nhập số bằng" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="providerPhone"
                                        label="Số điện thoại"
                                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }, { pattern: /^[0-9]+$/, message: 'Số điện thoại không hợp lệ' }]}
                                    >
                                        <Input placeholder="Nhập số điện thoại" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            </Modal>

        </Card>
    );
};

export default ListTransportProvider;