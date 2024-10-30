import React, { useState, useEffect, useContext } from 'react';
import { Spin, Row, Col, Button, Modal, message, Card, Descriptions, Divider, Switch, Avatar, Table, Radio } from 'antd';
import { useParams } from 'react-router-dom';
import { getChildDetailAPI, updateServiceStatus } from '../../services/service.children';
import moment from 'moment/moment';
import { EditOutlined } from '@ant-design/icons';
import { getAvailableVehicles } from '../../services/service.vehicle';
import { fetchAvailableRoutesAPI } from '../../services/services.route';
import Title from 'antd/es/typography/Title';

const ChildrenInformation = () => {
    const [childrenData, setChildrenData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [isBoardingModalVisible, setIsBoardingModalVisible] = useState(false);
    const [isTransportModalVisible, setIsTransportModalVisible] = useState(false);
    const [isVehicleModalVisible, setIsVehicleModalVisible] = useState(false);
    const [availableRoutes, setAvailableRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(null);

    const { id } = useParams();

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
                <Radio.Group
                    onChange={handleVehicleSelect}
                    value={selectedRoute}
                >
                    <Radio value={record.id}>Chọn</Radio>
                </Radio.Group>
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
            await updateServiceStatus(id, serviceName, selectedRoute);
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
        handleChangeServiceStatus('transport');
    };

    const handleCancelBoarding = () => {
        setIsBoardingModalVisible(false);
    };

    const handleCancelTransport = () => {
        setIsTransportModalVisible(false);
    };

    const handleCancelVehicle = () => {
        setIsVehicleModalVisible(false);
    };

    const handleVehicleSelect = (e) => {
        setSelectedRoute(e.target.value);
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
                    <Col xs={24} sm={8} className='d-flex flex-column align-items-center justify-content-center'>
                        <Avatar size={256} src={childrenData?.imageUrl || "/image/5856.jpg"} />
                    </Col>
                    <Col xs={24} sm={16}>
                        <Row justify="space-between" className='mb-3'>
                            <Col>
                                <Title level={5}>Thông tin cá nhân</Title>
                            </Col>
                            <Col>
                                <Button type="link" icon={<EditOutlined />} >
                                    Chỉnh sửa thông tin
                                </Button>
                            </Col>
                        </Row>
                        <Descriptions bordered column={6}>
                            <Descriptions.Item label="Họ và tên" span={6}>
                                <span>{childrenData?.childName}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày sinh" span={3}>
                                <span>{moment(childrenData?.childBirthDate).format('DD/MM/YYYY')}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Giới tính" span={3}>
                                <span>{childrenData?.gender === 'female' ? "Nữ" : "Nam"}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Nơi khai sinh" span={6} >
                                <span>{childrenData?.birthAddress}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Nơi ở hiện tại" span={6} >
                                <span>{childrenData?.childAddress}</span>
                            </Descriptions.Item>
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
                    <Col>
                        <Title level={5}>Thông tin phụ huynh</Title>
                    </Col>
                    <Col>
                        <Button type="link" icon={<EditOutlined />} >
                            Chỉnh sửa thông tin
                        </Button>
                    </Col>
                </Row>
                <Descriptions bordered column={6}>
                    <Descriptions.Item label="Họ và tên cha" span={3}>
                        <span>{childrenData?.fatherName}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại " span={3}>
                        <span>{childrenData?.fatherPhone}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Họ và tên mẹ" span={3}>
                        <span>{childrenData?.motherName}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại " span={3}>
                        <span>{childrenData?.motherPhone}</span>
                    </Descriptions.Item>
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
                onOk={handleConfirmVehicle}
                onCancel={handleCancelVehicle}
                okText="Xác nhận"
                cancelText="Đóng"
                width={`${window.innerWidth * 0.8}px`}
            >
                <Table
                    dataSource={availableRoutes}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                />
            </Modal>

        </div>
    );
};

export default ChildrenInformation;