import React, { useState, useEffect, useContext } from 'react';
import { Spin, Row, Col, Button, Descriptions, Divider, Pagination, Card, Modal, Form, Input, TimePicker, Switch, notification } from 'antd';
import { useParams } from 'react-router-dom';
import { gettransportProviderDetailAPI } from '../../../services/service.transportprovider';
import Title from 'antd/es/typography/Title';
import { VehicleTable } from '../../../component/table/VehicleTable';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { AuthContext } from '../../../component/context/auth.context';
import { addVehicle, getVehicles } from '../../../services/service.vehicle';

const TransportProviderInformation = () => {
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [vehicle, setVehicle] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const { user } = useContext(AuthContext);

    const fetchTransportProvider = async (id) => {
        try {
            const response = await gettransportProviderDetailAPI(id);
            setProvider(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchVehicle = async (id, page) => {
        try {
            const response = await getVehicles(id, page);
            setVehicle(response.data.listData);
            setTotal(response.data.total);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchTransportProvider(id);
        fetchVehicle(id, currentPage);
    }, [id]);

    const handleAddVehicle = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                ...values,
                createdBy: user?.id,
                providerId: id
            };

            console.log('Form Values:', payload);
            await addVehicle(payload);
            setIsModalVisible(false);
            form.resetFields();
            notification.success({
                message: 'Thêm phương tiện thành công',
                placement: 'bottomRight',
            });
            fetchVehicle(id, currentPage);
        } catch (error) {
            console.error('Lỗi khi thêm phương tiện:', error);
        }
    };


    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    if (loading) {
        return (
            <div className='d-flex justify-content-center align-items-center' style={{ height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="container">
            <Card style={{ marginTop: 20 }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24}>
                        <Row justify="space-between" className='mb-3'>
                            <Col>
                                <Title level={5}>Thông tin đơn vị</Title>
                            </Col>
                            <Col>
                                <Button type="link" icon={<EditOutlined />} >
                                    Chỉnh sửa thông tin
                                </Button>
                            </Col>
                        </Row>
                        <Descriptions bordered column={6}>
                            <Descriptions.Item label="Tên đơn vị" span={4}>
                                <span>{provider?.providerName}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái" span={2}>
                                <Switch checked={provider?.isActive} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Người đại diện" span={2}>
                                <span>{provider?.representativeName}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Chức vụ" span={2}>
                                <span>{provider?.representativePosition}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Mã số thuế" span={2}>
                                <span>{provider?.providerTaxCode}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại" span={2}>
                                <span>{provider?.providerPhone}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Email" span={4}>
                                <span>{provider?.providerEmail}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngân hàng" span={2}>
                                <span>{provider?.bankName}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Số tài khoản" span={4}>
                                <span>{provider?.bankAccountNumber}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ" span={6}>
                                <span>{provider?.providerAddress}</span>
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
                <Divider />
                <Col xs={24} sm={16} className="container">
                    <Row justify="space-between" className='mb-3'>
                        <Col>
                            <Title level={5}>Danh sách đơn vị</Title>
                        </Col>
                        <Col>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
                                Thêm phương tiện
                            </Button>
                        </Col>
                    </Row>
                    <VehicleTable data={vehicle} total={total} />
                </Col>
            </Card>

            <Modal
                title="Thông tin phương tiện"
                open={isModalVisible}
                onCancel={handleCancel}
                onOk={handleAddVehicle}
                okText="Lưu"
                cancelText="Hủy"
                width={1000}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="vehicleName"
                                label="Tên phương tiện"
                                rules={[{ required: true, message: 'Vui lòng nhập tên phương tiện' }]}
                            >
                                <Input placeholder="Tên phương tiện" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="manufacturer"
                                label="Hãng sản xuất"
                                rules={[{ required: true, message: 'Vui lòng nhập hãng sản xuất' }]}
                            >
                                <Input placeholder="Hãng sản xuất" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="numberOfSeats"
                                label="Số ghế"
                                rules={[{ required: true, message: 'Vui lòng nhập số ghế' }]}
                            >
                                <Input type="number" min={1} placeholder="Số ghế" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="color"
                                label="Màu sắc"
                                rules={[{ required: true, message: 'Vui lòng nhập màu sắc' }]}
                            >
                                <Input placeholder="Màu sắc" />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                name="licensePlate"
                                label="Biển số"
                                rules={[{ required: true, message: 'Vui lòng nhập biển số' }]}
                            >
                                <Input placeholder="Biển số" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="driverName"
                                label="Tên tài xế"
                                rules={[{ required: true, message: 'Vui lòng nhập tên tài xế' }]}
                            >
                                <Input placeholder="Tên tài xế" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="driverPhone"
                                label="Số điện thoại tài xế"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại tài xế' }]}
                            >
                                <Input placeholder="Số điện thoại tài xế" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="pickUpLocation"
                                label="Điểm đón"
                                rules={[{ required: true, message: 'Vui lòng nhập điểm đón' }]}
                            >
                                <Input placeholder="Điểm đón" />
                            </Form.Item>
                        </Col>

                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default TransportProviderInformation;