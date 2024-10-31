import { useCallback, useState, useEffect, useContext } from "react";
import { Pagination, Spin, Card, Row, Col, Input, Button, Form, Modal, notification, Select } from "antd";
import NoData from "../../../component/no-data-page/NoData";
import { ProviderTable } from "../../../component/table/ProviderTable";
import { addFoodProviderAPI, getFoodProvidersAPI } from "../../../services/service.foodprovider";
import { AuthContext } from "../../../component/context/auth.context";
import { getBankListAPI } from "../../../services/services.public";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();

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
        fetchBankList();
    }, [currentPage, searchTerm, fetchProviders, fetchBankList]);

    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleOk = async () => {
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
                message: "Thêm đối tác thành công",
                description: `Đã thêm đối tác ${response.data.providerName}`
            });
            form.resetFields();
            navigate(`/pms/manage/kitchen/provider/${response.data.id}`);
        } catch (error) {
            notification.error({
                message: "Thêm đối tác thất bại"
            });
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    return (
        <Card className="m-2">
            <Row gutter={[16, 16]} justify="center" style={{ marginBottom: 20 }}>
                <Col xs={24} sm={16}>
                    <Input.Search
                        placeholder="Nhập tên đối tác cần tìm"
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
                        title="Không có đối tác vận chuyển nào"
                        subTitle="Danh sách đối tác sẽ xuất hiện khi bạn thêm dữ liệu vào hệ thống"
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
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập tên công ty' },
                                        { pattern: /^[a-zA-Z0-9À-ỹ\s]{2,100}$/, message: 'Tên công ty phải từ 2 đến 100 ký tự và chỉ bao gồm chữ cái, số, và khoảng trắng.' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || value.trim().length !== 0) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Tên công ty không được để trống'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input placeholder="Tên công ty" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="providerTaxCode"
                                    label="Mã số thuế"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập mã số thuế' },
                                        { pattern: /^\d{10,13}$/, message: 'Mã số thuế phải từ 10 đến 13 chữ số.' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || value.trim().length !== 0) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Mã số thuế không được để trống'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input placeholder="Mã số thuế" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="providerPhone"
                                    label="Điện thoại"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập số điện thoại' },
                                        { pattern: /^[0-9]{8,10}$/, message: 'Số điện thoại phải gồm từ 8 đến 10 chữ số.' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || value.trim().length !== 0) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Số điện thoại không được để trống'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input placeholder="Số điện thoại" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="providerEmail"
                                    label="Email"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập email' },
                                        { type: 'email', message: 'Email không hợp lệ.' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || value.trim().length !== 0) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Email không được để trống'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input placeholder="Email" />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="providerAddress"
                                    label="Địa chỉ"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập địa chỉ' },
                                        { pattern: /^[a-zA-Z0-9À-ỹ\s,.-]{5,200}$/, message: 'Địa chỉ phải từ 5 đến 200 ký tự và chỉ bao gồm chữ cái, số, và các dấu câu.' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || value.trim().length !== 0) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Địa chỉ không được để trống'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input placeholder="Địa chỉ" />
                                </Form.Item>
                            </Col>
                            <Col span={16}>
                                <Form.Item
                                    name="representativeName"
                                    label="Người đại diện"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập tên người đại diện' },
                                        { pattern: /^[a-zA-ZÀ-ỹ\s]{2,50}$/, message: 'Tên người đại diện chỉ được chứa chữ cái và khoảng trắng, từ 2 đến 50 ký tự.' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || value.trim().length !== 0) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Tên người đại diện không được để trống'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input placeholder="Người đại diện" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="representativePosition"
                                    label="Chức vụ"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập chức vụ' },
                                        { pattern: /^[a-zA-Z0-9À-ỹ\s]{2,50}$/, message: 'Chức vụ chỉ được chứa chữ cái, số và khoảng trắng, từ 2 đến 50 ký tự.' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || value.trim().length !== 0) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Chức vụ không được để trống'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input placeholder="Chức vụ" />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
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
                            <Col span={12}>
                                <Form.Item
                                    name="bankAccountNumber"
                                    label="Số tài khoản"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập số tài khoản' },
                                        { pattern: /^\d{6,20}$/, message: 'Số tài khoản phải từ 6 đến 20 chữ số.' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || value.trim().length !== 0) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Số tài khoản không được để trống'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input placeholder="Số tài khoản" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="beneficiaryName"
                                    label="Tên người thụ hưởng"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập tên người thụ hưởng' },
                                        { pattern: /^[a-zA-ZÀ-ỹ\s]{2,50}$/, message: 'Tên người thụ hưởng chỉ được chứa chữ cái và khoảng trắng, từ 2 đến 50 ký tự.' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || value.trim().length !== 0) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Tên người thụ hưởng không được để trống'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input placeholder="Tên người thụ hưởng" />
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
