import { useParams } from "react-router-dom";
import { changeStatusRouteAPI, fetchRouteAPI, fetchStopLocationAPI } from "../../services/services.route";
import { useEffect, useState } from "react";
import Loading from "../common/Loading";
import { Button, Card, Col, Descriptions, Divider, Row, Switch, Tabs, Table, Steps, Checkbox, Modal, Avatar, Tag, message, Image, Popconfirm } from "antd";
import Title from "antd/es/typography/Title";
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { getAvailableVehicles, getVehicleOfRoute, unsubscribeRoute, updateRouteForVehicle } from "../../services/service.vehicle";
import { getChildrenByRoute } from "../../services/service.children";
const { TabPane } = Tabs;
const { Step } = Steps;

const RouteInformation = () => {
    const { id } = useParams();
    const [route, setRoute] = useState();
    const [stopLocations, setStopLocations] = useState([]);
    const [vehicleData, setVehicleData] = useState([]);
    const [availableVehicleData, setAvailableVehicleData] = useState([]);
    const [childrenData, setChildrenData] = useState([]);
    const [selectedVehicles, setSelectedVehicles] = useState([]);
    const [isVehicleModalVisible, setIsVehicleModalVisible] = useState(false);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [isConfirmDeleteModalVisible, setIsConfirmDeleteModalVisible] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [vehicleToDelete, setVehicleToDelete] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    // Fetch data
    const fetchRoute = async () => {
        try {
            const response = await fetchRouteAPI(id);
            setRoute(response.data);
        } catch (error) {
            console.error('Error fetching route:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const fetchStopLocation = async () => {
        try {
            const response = await fetchStopLocationAPI(id);
            setStopLocations(response.data);
        } catch (error) {
            console.error('Error fetching stop location:', error);
        }
    };

    const fetchAvailableVehicles = async () => {
        try {
            const response = await getAvailableVehicles();
            setAvailableVehicleData(response.data);
        } catch (error) {
            console.error('Error fetching available vehicles:', error);
        }
    };

    const fetchVehicleOfRoute = async () => {
        try {
            const response = await getVehicleOfRoute(id);
            setVehicleData(response.data);
        } catch (error) {
            console.error("Error getting vehicles:", error);
        }
    };

    const fetchChildrenData = async () => {
        try{
            const response = await getChildrenByRoute(id, currentPage);
            setChildrenData(response.data.listData);
        }catch (error) {
            console.error('Error fetching route:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoute();
        fetchStopLocation();
        fetchAvailableVehicles();
        fetchVehicleOfRoute();
        fetchChildrenData();
    }, [id]);

    const handleVehicleSelect = (vehicleId) => {
        setSelectedVehicles((prevSelected) =>
            prevSelected.includes(vehicleId)
                ? prevSelected.filter((id) => id !== vehicleId)
                : [...prevSelected, vehicleId]
        );
    };

    const handleConfirmVehicle = async () => {
        try {
            await updateRouteForVehicle(id, selectedVehicles);
            message.success("Thêm xe vào tuyến thành công.");
            fetchAvailableVehicles();
            fetchVehicleOfRoute();
            setIsVehicleModalVisible(false);
        } catch (error) {
            console.error("Error updating vehicles:", error);
            message.error("Có lỗi xảy ra. Vui lòng thử lại sau");
        }
    };

    const handleCancelVehicle = () => {
        setIsVehicleModalVisible(false);
    };

    const handleDeleteVehicle = async () => {
        try {
            await unsubscribeRoute(vehicleToDelete);
            message.success("Xóa xe khỏi tuyến thành công.");
            fetchVehicleOfRoute();
            fetchAvailableVehicles();
            setIsConfirmDeleteModalVisible(false);
        } catch (error) {
            console.error("Error deleting vehicle:", error);
            message.error("Có lỗi xảy ra. Vui lòng thử lại sau");
        }
    };

    const openDetailModal = (vehicle) => {
        setSelectedVehicle(vehicle);
        setIsDetailModalVisible(true);
    };

    const closeDetailModal = () => {
        setIsDetailModalVisible(false);
        setSelectedVehicle(null);
    };

    const openConfirmDeleteModal = (vehicleId) => {
        setVehicleToDelete(vehicleId);
        setIsConfirmDeleteModalVisible(true);
    };

    const closeConfirmDeleteModal = () => {
        setIsConfirmDeleteModalVisible(false);
        setVehicleToDelete(null);
    };

    const handleSwitchChange = async () => {
        try {
            await changeStatusRouteAPI(id);
            fetchRoute();
            message.success("Cập nhật trạng thái tuyến thành công.");
        } catch (error) {
            console.error("Error updating route status:", error);
            message.error("Có lỗi xảy ra. Vui lòng thử lại sau");
        }
    };

    if (loading) {
        return <Loading />;
    }

    const vehicleColumns = [
        { title: 'Phương tiện', dataIndex: 'vehicleName', key: 'vehicleName' },
        { title: 'Biển số xe', dataIndex: 'licensePlate', key: 'licensePlate' },
        { title: 'Màu sắc', dataIndex: 'color', key: 'color' },
        { title: 'Số chỗ ngồi', dataIndex: 'numberOfSeats', key: 'numberOfSeats' },
        { title: 'Nhãn hiệu', dataIndex: 'manufacturer', key: 'manufacturer' },
        {
            render: (record) => (
                <>
                    <EyeOutlined onClick={() => openDetailModal(record)} style={{ cursor: 'pointer' }} />
                    <DeleteOutlined onClick={() => openConfirmDeleteModal(record.id)} style={{ cursor: 'pointer', color: 'red', marginLeft: 16 }} />
                </>
            ),
        },
    ];

    const availableVehicleColumns = [
        { title: 'Phương tiện', dataIndex: 'vehicleName', key: 'vehicleName' },
        { title: 'Biển số xe', dataIndex: 'licensePlate', key: 'licensePlate' },
        { title: 'Màu sắc', dataIndex: 'color', key: 'color' },
        { title: 'Số chỗ ngồi', dataIndex: 'numberOfSeats', key: 'numberOfSeats' },
        { title: 'Nhãn hiệu', dataIndex: 'manufacturer', key: 'manufacturer' },
        { title: 'Đơn vị cung cấp', dataIndex: 'providerName', key: 'providerName' },
        {
            title: 'Chọn',
            key: 'select',
            render: (text, record) => (
                <Checkbox
                    onChange={() => handleVehicleSelect(record.vehicleId)}
                    checked={selectedVehicles.includes(record.vehicleId)}
                >
                    Chọn
                </Checkbox>
            ),
        },
    ];

    const childrenColumns = [
        {
            title: 'Ảnh', dataIndex: 'imageUrl', key: 'imageUrl',
            render: (url) => url ? <Avatar width={50} src={url} /> : 'Không có ảnh',
        },
        { title: 'Họ và tên', dataIndex: 'childName', key: 'childName' },
        {
            title: 'Giới tính', dataIndex: 'gender', key: 'gender',
            render: (text) => text === 'male' ? 'Nam' : text === 'female' ? 'Nữ' : text,
        },
        {
            title: 'Ngày sinh', dataIndex: 'childBirthDate', key: 'childBirthDate',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Lớp',
            dataIndex: 'className',
            key: 'className',
            render: (text) => text === null
                ? <Tag color="red">Chưa được thêm vào lớp</Tag>
                : <Tag color="lime">{text}</Tag>,
        },
    ];

    return (
        <div className='container'>
            <Card style={{ marginTop: 20 }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24}>
                        <Row justify="space-between" className='mb-3'>
                            <Col><Title level={5}>Thông tin tuyến</Title></Col>
                            <Col><Button type="link" icon={<EditOutlined />}>Chỉnh sửa thông tin</Button></Col>
                        </Row>
                        <Descriptions bordered column={6}>
                            <Descriptions.Item label="Tên tuyến" span={4}>{route?.routeName}</Descriptions.Item>
                            <Descriptions.Item label="Trạng thái" span={2}>
                                <Popconfirm
                                    title="Bạn có chắc chắn muốn thay đổi trạng thái của tuyến này?"
                                    onConfirm={handleSwitchChange}
                                    okText="Đồng ý"
                                    cancelText="Đóng"
                                >
                                    <Switch checked={route?.isActive} />
                                </Popconfirm>
                            </Descriptions.Item>
                            <Descriptions.Item label="Điểm bắt đầu" span={4}>{route?.startLocation}</Descriptions.Item>
                            <Descriptions.Item label="Thời gian đón" span={2}>{route?.pickupTime}</Descriptions.Item>
                            <Descriptions.Item label="Điểm kết thúc" span={4}>{route?.endLocation}</Descriptions.Item>
                            <Descriptions.Item label="Thời gian trả" span={2}>{route?.dropOffTime}</Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
                <Divider />
                <Col xs={24} sm={16} className="container">
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Danh sách phương tiện" key="1">
                            <Col span={24} style={{ marginBottom: 20, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button type="primary" onClick={() => setIsVehicleModalVisible(true)}>Thêm xe vào chặng</Button>
                            </Col>
                            <Table
                                columns={vehicleColumns}
                                dataSource={vehicleData}
                                rowKey="vehicleId"
                            />
                        </TabPane>
                        <TabPane tab="Danh sách các chặng" key="2">
                            <Row justify="end" className='mb-3'>
                                <Col><Button type="link" icon={<EditOutlined />}>Chỉnh sửa các điểm dừng</Button></Col>
                            </Row>
                            <Steps
                                direction="horizontal"
                                current={stopLocations.length - 1}
                                progressDot
                            >
                                {stopLocations
                                    .sort((a, b) => a.stopOrder - b.stopOrder)
                                    .map((stop) => (
                                        <Step key={stop.id} title={<span style={{ fontSize: '12px' }}>{stop.locationName}</span>} />
                                    ))}
                            </Steps>
                        </TabPane>
                        <TabPane tab="Danh sách trẻ đăng ký" key="3">
                            <Table
                                columns={childrenColumns}
                                dataSource={childrenData}
                                rowKey="id"
                            />
                        </TabPane>
                    </Tabs>
                </Col>
            </Card>
            <Modal
                title="Chọn phương tiện"
                open={isVehicleModalVisible}
                onOk={handleConfirmVehicle}
                onCancel={handleCancelVehicle}
                okText="Xác nhận"
                cancelText="Đóng"
                width={800}
            >
                <Table
                    dataSource={availableVehicleData}
                    columns={availableVehicleColumns}
                    rowKey="vehicleId"
                    pagination={false}
                />
            </Modal>
            <Modal
                title="Xác nhận xóa"
                open={isConfirmDeleteModalVisible}
                onOk={handleDeleteVehicle}
                onCancel={closeConfirmDeleteModal}
                okText="Xóa"
                cancelText="Hủy"
                width={400}
            >
                <p>Bạn có chắc chắn muốn xóa phương tiện này khỏi tuyến?</p>
            </Modal>
            <Modal
                title="Thông tin phương tiện"
                open={isDetailModalVisible}
                onCancel={closeDetailModal}
                footer={null}
                width={800}
            >
                {selectedVehicle && (
                    <Descriptions bordered column={6}>
                        <Descriptions.Item span={4} label="Tên phương tiện">{selectedVehicle.vehicleName}</Descriptions.Item>
                        <Descriptions.Item span={2} label="Trạng thái">
                            <Tag color={selectedVehicle.isActive ? 'green' : 'red'}>
                                {selectedVehicle.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item span={4} label="Biển số xe">{selectedVehicle.licensePlate}</Descriptions.Item>
                        <Descriptions.Item span={2} label="Màu sắc">{selectedVehicle.color}</Descriptions.Item>
                        <Descriptions.Item span={4} label="Nhãn hiệu">{selectedVehicle.manufacturer}</Descriptions.Item>
                        <Descriptions.Item span={2} label="Số chỗ ngồi">{selectedVehicle.numberOfSeats}</Descriptions.Item>
                        <Descriptions.Item span={6} label="Tài xế phụ trách">{selectedVehicle.driverName}</Descriptions.Item>
                        <Descriptions.Item span={6} label="Số điện thoại tài xế">{selectedVehicle.driverPhone}</Descriptions.Item>
                        <Descriptions.Item span={6} label="Hình ảnh phương tiện">
                            {selectedVehicle.images && selectedVehicle.images.length > 0 ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {selectedVehicle.images.map(image => (
                                        <Image key={image.id} width={128} height={128} src={image.imageUrl} alt={image.imageType} />
                                    ))}
                                </div>
                            ) : (
                                <span>Không có hình ảnh</span>
                            )}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </div>
    );
};

export default RouteInformation;