import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Button, Descriptions, Divider, Card, Modal, Form, Input, notification, Upload, Switch, message } from 'antd';
import { useParams } from 'react-router-dom';
import { gettransportProviderDetailAPI, updateStatusTransportProviderAPI } from '../../../services/service.transportprovider';
import Title from 'antd/es/typography/Title';
import { VehicleTable } from '../../../component/table/VehicleTable';
import { EditOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { AuthContext } from '../../../component/context/auth.context';
import { addVehicle, getVehicles } from '../../../services/service.vehicle';
import Loading from '../../common/Loading';

const TransportProviderInformation = () => {
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { id } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [vehicle, setVehicle] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [form] = Form.useForm();
    const { user } = useContext(AuthContext);

    // Fetch transport provider details
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
            setTotal(response.data.total); // Tổng số lượng phương tiện
        } catch (error) {
            console.error("Failed to fetch vehicles:", error);
        }
    };

    useEffect(() => {
        fetchTransportProvider(id);
        fetchVehicle(id, currentPage);
    }, [id, currentPage]);

    // Handle vehicle addition
    const handleAddVehicle = async () => {
        try {
            const values = await form.validateFields();
            setSaving(true);

            const formData = new FormData();
            formData.append("request", new Blob([JSON.stringify({
                ...values,
                createdBy: user?.id,
                providerId: id
            })], { type: "application/json" }));
            fileList.forEach(file => {
                formData.append("images", file.originFileObj);
            });

            await addVehicle(formData);

            setIsModalVisible(false);
            form.resetFields();
            setFileList([]); // Reset file list after submission
            notification.success({
                message: 'Thêm phương tiện thành công',
                placement: 'bottomRight',
            });
            fetchVehicle(id, 1);
            setCurrentPage(1);
        } catch (error) {
            console.error('Lỗi khi thêm phương tiện:', error);
        } finally {
            setSaving(false);
        }
    };

    // Handle modal close
    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setFileList([]);
    };

    const normFile = (e) => Array.isArray(e) ? e : e?.fileList;

    const onUploadChange = ({ fileList }) => {
        setFileList(fileList.slice(-5));
    };
    const showModalChangeStatus = () => {
        const contentMessage = provider?.isActive
            ? "Bạn có chắc chắn muốn dừng hợp tác với đơn vị này? Nếu đồng ý thì mọi phương tiện đang hoạt động cũng bị dừng hoạt động và xóa khỏi tuyến xe nếu đang hoạt động"
            : "Bạn có chắc chắn muốn hợp tác với đơn vị này?";

        Modal.confirm({
            title: 'Xác nhận thay đổi trạng thái',
            content: contentMessage,
            onOk: async () => {
                try {
                    await updateStatusTransportProviderAPI(id);
                    message.success('Cập nhật trạng thái thành công');

                    // Cập nhật lại trạng thái của nhà cung cấp
                    await fetchTransportProvider(id);
                    await fetchVehicle(id, currentPage);
                } catch (error) {
                    console.error('Error changing provider status:', error);
                    message.error('Có lỗi xảy ra khi cập nhật trạng thái.');
                }
            },
            onCancel() {
                console.log('Hủy thay đổi trạng thái');
            },
        });
    };


    if (loading) {
        return <Loading />;
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
                                {user?.role === "ADMIN" && (
                                    <Button type="link" icon={<EditOutlined />}>Chỉnh sửa thông tin</Button>
                                )}
                            </Col>
                        </Row>
                        <Descriptions bordered column={6}>
                            <Descriptions.Item label="Tên đơn vị" span={4}>{provider?.providerName}</Descriptions.Item>
                            <Descriptions.Item label="Trạng thái" span={2}>
                                <Switch checked={provider?.isActive} onClick={showModalChangeStatus} disabled={user.role !== 'ADMIN'} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Người đại diện" span={2}>{provider?.representativeName}</Descriptions.Item>
                            <Descriptions.Item label="Chức vụ" span={2}>{provider?.representativePosition}</Descriptions.Item>
                            <Descriptions.Item label="Mã số thuế" span={2}>{provider?.providerTaxCode}</Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại" span={2}>{provider?.providerPhone}</Descriptions.Item>
                            <Descriptions.Item label="Email" span={4}>{provider?.providerEmail}</Descriptions.Item>
                            <Descriptions.Item label="Ngân hàng" span={2}>{provider?.bankName}</Descriptions.Item>
                            <Descriptions.Item label="Số tài khoản" span={4}>{provider?.bankAccountNumber}</Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ" span={6}>{provider?.providerAddress}</Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
                <Divider />
                <Col xs={24} sm={16} className="container">
                    <Row justify="space-between" className='mb-3'>
                        <Col>
                            <Title level={5}>Danh sách phương tiện</Title>
                        </Col>
                        <Col>
                            {provider?.isActive && user.role === 'ADMIN' && (
                                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
                                    Thêm phương tiện
                                </Button>
                            )}
                        </Col>
                    </Row>
                    <VehicleTable dataDefault={vehicle} providerId={id} providerStatus={provider?.isActive} role={user.role} />
                </Col>
            </Card>

            <Modal
                title="Thông tin phương tiện"
                open={isModalVisible}
                onCancel={handleCancel}
                onOk={handleAddVehicle}
                okButtonProps={{ loading: saving }}
                okText="Lưu"
                cancelText="Hủy"
                width={1000}
            >
                <Form form={form} layout="vertical" disabled={saving}>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item name="vehicleName" label="Tên phương tiện"
                                rules={[{ required: true, message: 'Vui lòng nhập tên phương tiện' }]}
                            >
                                <Input placeholder="Tên phương tiện" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="manufacturer" label="Hãng sản xuất"
                                rules={[{ required: true, message: 'Vui lòng nhập hãng sản xuất' }]}
                            >
                                <Input placeholder="Hãng sản xuất" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="numberOfSeats" label="Số ghế"
                                rules={[{ required: true, message: 'Vui lòng nhập số ghế' }]}
                            >
                                <Input type="number" min={1} placeholder="Số ghế" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="color" label="Màu sắc"
                                rules={[{ required: true, message: 'Vui lòng nhập màu sắc' }]}
                            >
                                <Input placeholder="Màu sắc" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="licensePlate" label="Biển số"
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
                                name="images"
                                label="Tải lên hình ảnh"
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                                rules={[{ required: true, message: 'Vui lòng tải lên ít nhất 1 hình ảnh' }]}
                            >
                                <Upload
                                    name="images"
                                    listType="picture-card"
                                    fileList={fileList}
                                    onChange={onUploadChange}
                                    beforeUpload={() => false}
                                    multiple
                                    maxCount={5}
                                >
                                    {fileList.length < 5 && (
                                        <div>
                                            <UploadOutlined /> Tải lên
                                        </div>
                                    )}
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default TransportProviderInformation;
