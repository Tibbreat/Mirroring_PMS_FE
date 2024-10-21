import { useCallback, useState, useEffect, useContext } from "react";
import { Pagination, Spin, Card, Row, Col, Input, Button, Form, Modal, notification, Select } from "antd";
import NoData from "../../../component/no-data-page/NoData";
import { ProviderTable } from "../../../component/table/ProviderTable";
import { addFoodProviderAPI, getFoodProvidersAPI } from "../../../services/service.foodprovider";
import { AuthContext } from "../../../component/context/auth.context";
import { getBankListAPI } from "../../../services/services.public";

const ListFoodProvider = () => {
    const [form] = Form.useForm();
    const { user } = useContext(AuthContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [providers, setProviders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [banks, setBanks] = useState([]);

    const fetchProviders = useCallback(async (page = 1, term = "") => {
        setLoading(true);
        try {
            const response = await getFoodProvidersAPI(page, term);
            setProviders(response.data.listData);
            setTotal(response.data.total);
        } catch (error) {
            console.error("Error fetching providers:", error);
        } finally {
            setLoading(false);
        }
    }, []);


    const fetchBankList = useCallback(async () => {
        try {
            const response = await getBankListAPI();
            setBanks(response.data.data);
        } catch (error) {
            console.error("Error fetching banks:", error);
        }
    }, []);

    useEffect(() => {
        fetchProviders(currentPage, searchTerm);
        fetchBankList(); // Fetch bank list when the component mounts
    }, [currentPage, searchTerm, fetchProviders, fetchBankList]);

    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                ...values,
                createdBy: user.id
            };
            try {
                const response = await addFoodProviderAPI(payload);
                fetchProviders();
                setIsModalOpen(false);
                notification.success({
                    message: "Thêm nhà đối tác thành công",
                    description: `Đã thêm nhà cung cấp ${response.data.providerName}`
                });
                form.resetFields();
            } catch (error) {
                notification.error({
                    message: "Thêm nhà đối tác thất bại"
                });
            }
        } catch (error) {
            console.error("Error adding provider:", error);
            notification.error({
                message: "Thêm nhà đối tác thất bại",
                description: "Vui lòng kiểm tra lại các trường nhập liệu.",
            });
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
                        onSearch={handleSearch}
                    />
                </Col>
            </Row>
            <Col span={24} style={{ marginBottom: 20, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" onClick={() => setIsModalOpen(true)}>Thêm đối tác</Button>
            </Col>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <Spin size="large" />
                </div>
            ) : providers.length > 0 ? (
                <>
                    <ProviderTable data={providers} providerType="food" />
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
                        title="Không có nhà cung cấp vận chuyển nào"
                        subTitle="Danh sách nhà cung cấp sẽ xuất hiện khi bạn thêm dữ liệu vào hệ thống"
                    />
                </div>
            )}
            <Modal
                title="Thêm đối tác"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>Hủy</Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>Thêm</Button>
                ]}
                width={800}
            >
                <Form form={form} layout="vertical">
                    <Col>
                        <Row gutter={16}>
                            <Col span={16}>
                                <Form.Item
                                    name="providerName"
                                    label="Tên công ty"
                                    rules={[{ required: true, message: 'Vui lòng nhập tên công ty' }]}
                                >
                                    <Input placeholder="Tên công ty" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="providerTaxCode"
                                    label="Mã số thuế"
                                    rules={[{ required: true, message: 'Vui lòng nhập mã số thuế' }]}
                                >
                                    <Input placeholder="Mã số thuế" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="providerPhone"
                                    label="Điện thoại"
                                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                                >
                                    <Input placeholder="Số điện thoại" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="providerEmail"
                                    label="Email"
                                    rules={[{ required: true, message: 'Vui lòng nhập email' }]}
                                >
                                    <Input placeholder="Email" />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="providerAddress"
                                    label="Địa chỉ"
                                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                                >
                                    <Input placeholder="Địa chỉ" />
                                </Form.Item>
                            </Col>
                            <Col span={16}>
                                <Form.Item
                                    name="representativeName"
                                    label="Người đại diện"
                                    rules={[{ required: true, message: 'Vui lòng nhập tên người đại diện' }]}
                                >
                                    <Input placeholder="Người đại diện" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="representativePosition"
                                    label="Chức vụ"
                                    rules={[{ required: true, message: 'Vui lòng nhập chức vụ' }]}
                                >
                                    <Input placeholder="Chức vụ" />
                                </Form.Item>
                            </Col>
                            <Col span={16}>
                                <Form.Item
                                    name="bankName"
                                    label="Ngân hàng"
                                >
                                    <Select placeholder="Chọn ngân hàng">
                                        {banks.map((bank) => (
                                            <Select.Option key={bank.code} value={bank.code}>
                                                {bank.shortName} - {bank.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="bankAccountNumber"
                                    label="Số tài khoản"
                                    type="number"
                                >
                                    <Input placeholder="Số tài khoản" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Form>
            </Modal>
        </Card>
    );
};

export default ListFoodProvider;
