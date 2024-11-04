import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Button, Modal, message, Card, Descriptions, Divider, Switch, Avatar, Table, Radio, Steps, Upload, Form, Input, DatePicker, Select } from 'antd';
import { useParams } from 'react-router-dom';
import { getChildDetailAPI, updateServiceStatus, uploadImageAPI } from '../../services/service.children';
import moment from 'moment/moment';
import { EditOutlined, UploadOutlined } from '@ant-design/icons';
import { fetchAvailableRoutesAPI } from '../../services/services.route';
import Title from 'antd/es/typography/Title';
import Loading from '../common/Loading';
import { getVehicleOfRoute } from '../../services/service.vehicle';
import UploadImage from '../../component/input/UploadImage';

const { Step } = Steps;

const ChildrenInformation = () => {
    const [childrenData, setChildrenData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [isBoardingModalVisible, setIsBoardingModalVisible] = useState(false);
    const [isTransportModalVisible, setIsTransportModalVisible] = useState(false);
    const [isVehicleModalVisible, setIsVehicleModalVisible] = useState(false);
    const [isUploadImageModalVisible, setIsUploadImageModalVisible] = useState(false);
    const [availableRoutes, setAvailableRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [selectedvehicle, setSelectedvehicle] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [hasUploadedImage, setHasUploadedImage] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    const [isModalUpdateChildren, setIsModalUpdateChildren] = useState(false);


    const { id } = useParams();
    const [form] = Form.useForm();

    const fetchChildrenData = async (id) => {
        setLoading(true);
        try {
            const response = await getChildDetailAPI(id);
            setChildrenData(response.data);
        } catch (error) {
            console.error('Error fetching children data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableRoutes = async () => {
        try {
            const response = await fetchAvailableRoutesAPI();
            setAvailableRoutes(response.data);
        } catch (error) {
            console.error('Error fetching available routes:', error);
        }
    };

    const fetchVehiclesByRoute = async (routeId) => {
        try {
            const response = await getVehicleOfRoute(routeId);
            setVehicles(response.data);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    };

    const columns = [
        { title: 'Tên tuyến', dataIndex: 'routeName', key: 'routeName' },
        { title: 'Điểm đón', dataIndex: 'startLocation', key: 'startLocation' },
        { title: 'Thời gian đón', dataIndex: 'pickupTime', key: 'pickupTime' },
        { title: 'Thời gian trả', dataIndex: 'dropOffTime', key: 'dropOffTime' },
        {
            title: 'Chặng',
            dataIndex: 'stopLocations',
            key: 'stopLocations',
            render: (stopLocations) => {
                if (stopLocations && stopLocations.length > 0) {
                    return stopLocations.map((location) => (
                        <div key={location.id} style={{ fontSize: '12px' }}>
                            {location.locationName || location.id}
                        </div>
                    ));
                }
                return 'No stops available';
            },
        },
        {
            title: 'Chọn',
            key: 'select',
            render: (text, record) => (
                <Radio.Group onChange={() => handleRouteSelect(record.id)} value={selectedRoute}>
                    <Radio value={record.id}>Chọn</Radio>
                </Radio.Group>
            ),
        },
    ];

    const vehicleColumns = [
        { title: 'Phương tiện', dataIndex: 'vehicleName', key: 'vehicleName' },
        { title: 'Biển số xe', dataIndex: 'licensePlate', key: 'licensePlate' },
        { title: 'Màu sắc', dataIndex: 'color', key: 'color' },
        { title: 'Số chỗ ngồi', dataIndex: 'numberOfSeats', key: 'numberOfSeats' },
        { title: 'Số trẻ đăng ký hiện tại', dataIndex: 'numberChildrenRegistered', key: 'numberChildrenRegistered' },
        { title: 'Nhãn hiệu', dataIndex: 'manufacturer', key: 'manufacturer' },
        {
            title: 'Chọn', key: 'select',
            render: (record) => (
                record.numberOfSeats > record.numberChildrenRegistered ? (
                    <Radio.Group onChange={() => handleVehicleSelect(record.id)} value={selectedvehicle}>
                        <Radio value={record.id}>Chọn</Radio>
                    </Radio.Group>
                ) : null
            ),
        },
    ];

    useEffect(() => {
        fetchChildrenData(id);
    }, [id]);

    const handleChangeServiceStatus = async (serviceName) => {
        setUpdating(true);
        try {
            if (!childrenData.isRegisteredForTransport) {
                if (selectedRoute === null) {
                    message.error("Vui lòng chọn tuyến");
                    return;
                }
            }
            await updateServiceStatus(id, serviceName, selectedRoute, selectedvehicle);
            setIsVehicleModalVisible(false);
            message.success("Đăng ký thành công");

            fetchChildrenData(id);
        } catch (error) {
            console.error('Error changing service status:', error);
            message.error("Đăng ký thất bại");
        } finally {
            setUpdating(false);
        }
    };

    const handleBoardingSwitchChange = () => {
        setIsBoardingModalVisible(true);
    };

    const handleTransportSwitchChange = () => {
        if (!childrenData?.isRegisteredForTransport) {
            fetchAvailableRoutes();
            setIsVehicleModalVisible(true);
        } else {
            setIsTransportModalVisible(true);
        }
    };

    const handleConfirmBoarding = () => {
        handleChangeServiceStatus('boarding');
        setIsBoardingModalVisible(false);
    };

    const handleConfirmTransport = () => {
        handleChangeServiceStatus('transport');
        setIsTransportModalVisible(false);
    };

    const handleConfirmVehicle = () => {
        if (selectedRoute === null) {
            message.error("Vui lòng chọn xe");
            return;
        }
        handleChangeServiceStatus('transport');
    };

    const handleCancelBoarding = () => {
        setIsBoardingModalVisible(false);
    };

    const handleCancelTransport = () => {
        setSelectedRoute(null);
        setSelectedvehicle(null);
        setIsTransportModalVisible(false);
    };

    const handleCancelVehicle = () => {
        setSelectedRoute(null);
        setSelectedvehicle(null);
        setIsVehicleModalVisible(false);
        setCurrentStep(0);
    };

    const handleRouteSelect = (routeId) => {
        setSelectedRoute(routeId);
        fetchVehiclesByRoute(routeId);
        setCurrentStep(1);
    };

    const handleVehicleSelect = (vehicleId) => {
        setSelectedvehicle(vehicleId);
    };

    const handleBack = () => {
        setSelectedvehicle(null);
        setSelectedRoute(null);
        setCurrentStep(currentStep - 1);
    };

    const handleImageChange = async () => {
        const file = imageFile;
        if (!file) {
            message.error("Vui lòng chọn ảnh");
            return;
        }

        try {
            await uploadImageAPI(id, file);
            message.success("Ảnh đã được cập nhật thành công");
            fetchChildrenData(id);
        } catch (error) {
            console.error("Error uploading image:", error);
            message.error("Có lỗi xảy ra khi cập nhật ảnh");
        } finally {
            setIsUploadImageModalVisible(false);
            setFileList([]);
        }
    };

    const handleUpdateChildren = () => {
        setIsModalUpdateChildren(false);
    };

    const handleUploadChange = (file) => {
        setImageFile(file);
    };

    const openUpdateChildrenModal = () => {
        setIsModalUpdateChildren(true);
    };

    if (loading) {
        return (
            <Loading />
        );
    }
    const renderFormItem = (name, label, placeholder, rules, component = <Input />, span) => (
        <Col xs={24} md={span}>
            <Form.Item name={name} label={label} rules={rules}>
                {React.cloneElement(component, { placeholder, disabled: loading })}
            </Form.Item>
        </Col>
    );
    return (
        <div className="container">
            <Card style={{ marginTop: 20 }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={8} className='d-flex flex-column align-items-center justify-content-center'>
                        <Avatar
                            size={156}
                            src={hasUploadedImage || childrenData?.imageUrl ? childrenData?.imageUrl : "/image/placeholder.jpg"}
                            style={{ display: hasUploadedImage || childrenData?.imageUrl ? "block" : "none" }}
                        />
                        <Button className='mt-3' type="link" onClick={() => setIsUploadImageModalVisible(true)}>Cập nhật ảnh</Button>
                    </Col>
                    <Col xs={24} sm={16}>
                        <Row justify="space-between" className='mb-3'>
                            <Col><Title level={5}>Thông tin cá nhân</Title></Col>
                            <Col><Button type="link" icon={<EditOutlined />} onClick={openUpdateChildrenModal} >Chỉnh sửa thông tin</Button></Col>
                        </Row>
                        <Descriptions bordered column={6}>
                            <Descriptions.Item label="Họ và tên" span={6}>{childrenData?.childName} </Descriptions.Item>
                            <Descriptions.Item label="Ngày sinh" span={3}>{moment(childrenData?.childBirthDate).format('DD/MM/YYYY')}</Descriptions.Item>
                            <Descriptions.Item label="Giới tính" span={3}>{childrenData?.gender === 'female' ? "Nữ" : "Nam"}</Descriptions.Item>
                            <Descriptions.Item label="Nơi khai sinh" span={6}>{childrenData?.birthAddress}</Descriptions.Item>
                            <Descriptions.Item label="Nơi ở hiện tại" span={6}>{childrenData?.childAddress}</Descriptions.Item>
                            <Descriptions.Item label="Đăng ký nội trú" span={3}>
                                <Switch
                                    checked={childrenData?.isRegisteredForBoarding}
                                    loading={updating}
                                    onChange={handleBoardingSwitchChange}
                                />
                            </Descriptions.Item>
                            <Descriptions.Item label="Đăng ký xe" span={3}>
                                <Switch
                                    checked={childrenData?.isRegisteredForTransport}
                                    loading={updating}
                                    onChange={handleTransportSwitchChange}
                                />
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
                <Divider />
                <Row justify="space-between" className='mb-3'>
                    <Col><Title level={5}>Thông tin phụ huynh</Title></Col>
                    <Col><Button type="link" icon={<EditOutlined />} > Chỉnh sửa thông tin </Button></Col>
                </Row>
                <Descriptions bordered column={6}>
                    <Descriptions.Item label="Họ và tên cha" span={3}>{childrenData?.fatherName}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại " span={3}>{childrenData?.fatherPhone}</Descriptions.Item>
                    <Descriptions.Item label="Họ và tên mẹ" span={3}>{childrenData?.motherName}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại " span={3}>{childrenData?.motherPhone} </Descriptions.Item>
                </Descriptions>
            </Card>

            <Modal
                title="Xác nhận thay đổi"
                open={isBoardingModalVisible}
                onOk={handleConfirmBoarding}
                onCancel={handleCancelBoarding}
                okText="Xác nhận"
                cancelText="Đóng"
            >
                <p>Bạn có chắc chắn muốn thay đổi trạng thái đăng ký nội trú?</p>
            </Modal>

            <Modal
                title="Xác nhận thay đổi"
                open={isTransportModalVisible}
                onOk={handleConfirmTransport}
                onCancel={handleCancelTransport}
                okText="Xác nhận"
                cancelText="Đóng"
            >
                <p>Bạn có chắc chắn muốn hủy đăng ký xe đưa đón?</p>
            </Modal>

            <Modal
                title="Chọn tuyến"
                open={isVehicleModalVisible}
                onCancel={handleCancelVehicle}
                footer={[
                    <Button key="back" danger onClick={handleCancelVehicle}>
                        Đóng
                    </Button>,
                    currentStep === 1 && (
                        <Button key="previous" onClick={handleBack}>
                            Quay lại
                        </Button>
                    ),
                    <Button
                        key="confirm"
                        type="primary"
                        onClick={handleConfirmVehicle}
                        disabled={selectedRoute === null || selectedvehicle === null}
                    >
                        Xác nhận
                    </Button>,
                ]}
                width={`${window.innerWidth * 0.8}px`}>
                <Steps current={currentStep}>
                    <Step title="Chọn tuyến" />
                    <Step title="Chọn xe" />
                </Steps>

                {currentStep === 0 && (
                    <Table
                        className="mt-4"
                        dataSource={availableRoutes}
                        columns={columns}
                        rowKey="id"
                        pagination={false}
                    />
                )}

                {currentStep === 1 && (
                    <Table
                        dataSource={vehicles}
                        columns={vehicleColumns}
                        rowKey="id"
                        pagination={false}
                    />
                )}
            </Modal>

            <Modal
                title="Cập nhật ảnh"
                open={isUploadImageModalVisible}
                onCancel={() => setIsUploadImageModalVisible(false)}
                onOk={handleImageChange}
                okText="Xác nhận"
                cancelText="Đóng"
            >
                <UploadImage onImageChange={handleUploadChange} />
            </Modal>

            <Modal
                title="Cập nhật thông tin trẻ"
                open={isModalUpdateChildren}
                onCancel={() => setIsModalUpdateChildren(false)}
                onOk={handleUpdateChildren}
                okText="Cập nhật"
                cancelText="Đóng"
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        {renderFormItem('childName', 'Họ và tên', 'Nhập họ và tên', [{ required: true, message: 'Vui lòng nhập họ và tên' }], <Input />, 24)}
                        {renderFormItem(
                            'gender',
                            'Giới tính',
                            'Chọn giới tính',
                            [{ required: true, message: 'Vui lòng chọn giới tính' }],
                            <Select>
                                <Option value="male">Nam</Option>
                                <Option value="female">Nữ</Option>
                            </Select>,
                            11
                        )},
                        {renderFormItem('childBirthDate', 'Ngày sinh', 'Chọn ngày sinh', [{ required: true, message: 'Vui lòng chọn ngày sinh' }], <DatePicker />, 12)}
                    </Row>
                </Form>
            </Modal>

        </div>

    );
};

export default ChildrenInformation;