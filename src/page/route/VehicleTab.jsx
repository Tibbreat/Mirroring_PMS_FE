import { DeleteOutlined, DownloadOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Descriptions, Image, message, Modal, Popover, Row, Select, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { exportChildrenToExcelByVehicle } from "../../services/service.children";
import { getAvailableVehicles, getVehicleOfRoute, updateRouteForVehicle, unsubscribeRoute } from "../../services/service.vehicle";
import { getTransportManagerAPI } from "../../services/services.user";

const { Option } = Select;

export const VehicleTab = ({ id, routeActive }) => {
    const [vehicleData, setVehicleData] = useState([]);
    const [availableVehicleData, setAvailableVehicleData] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [selectedVehicles, setSelectedVehicles] = useState([]);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [isVehicleModalVisible, setIsVehicleModalVisible] = useState(false);
    const [selectedSupervisors, setSelectedSupervisors] = useState({});
    const [isConfirmDeleteModalVisible, setIsConfirmDeleteModalVisible] = useState(false);
    const [transportManager, setTransportManager] = useState([]);
    const [vehicleToDelete, setVehicleToDelete] = useState(null);

    const fetchVehicleOfRoute = async () => {
        try {
            const response = await getVehicleOfRoute(id);
            setVehicleData(response.data);
        } catch (error) {
            console.error("Error getting vehicles:", error);
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

    const fetchTransportManager = async () => {
        try {
            const response = await getTransportManagerAPI();
            setTransportManager(response.data);
        } catch (error) {
            console.error('Error fetching transport manager:', error);
        }
    };

    const handleDownload = async (vehicleId) => {
        try {
            const response = await exportChildrenToExcelByVehicle(vehicleId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `danh_sach_tre_dang_ky_xe.xls`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("Error downloading file:", error);
            message.error("Lỗi khi tải xuống danh sách trẻ");
        }
    };

    const handleVehicleSelect = (vehicleId, supervisorId) => {
        setSelectedVehicles((prevSelected) => {
            const existingVehicle = prevSelected.find((v) => v.vehicleId === vehicleId);
            if (existingVehicle) {
                return prevSelected.map((v) =>
                    v.vehicleId === vehicleId ? { ...v, supervisorId } : v
                );
            } else {
                return [...prevSelected, { vehicleId, supervisorId }];
            }
        });
    };

    const handleSupervisorChange = (vehicleId, supervisorId) => {
        setSelectedSupervisors((prevSelected) => ({
            ...prevSelected,
            [vehicleId]: supervisorId,
        }));
        handleVehicleSelect(vehicleId, supervisorId);
    };

    const handleConfirmVehicle = async () => {
        try {
            const requestData = selectedVehicles.map((v) => ({
                vehicleId: v.vehicleId,
                managerId: v.supervisorId,
            }));
            await updateRouteForVehicle(id, requestData);
            message.success("Thêm xe vào tuyến thành công.");
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

    const availableVehicleColumns = [
        { title: 'Phương tiện', dataIndex: 'vehicleName', key: 'vehicleName' },
        { title: 'Biển số xe', dataIndex: 'licensePlate', key: 'licensePlate' },
        { title: 'Màu sắc', dataIndex: 'color', key: 'color' },
        { title: 'Số chỗ ngồi', dataIndex: 'numberOfSeats', key: 'numberOfSeats' },
        { title: 'Nhãn hiệu', dataIndex: 'manufacturer', key: 'manufacturer' },
        { title: 'Đơn vị cung cấp', dataIndex: 'providerName', key: 'providerName' },
        {
            title: 'Phụ trách',
            dataIndex: 'supervisorId',
            key: 'supervisorId',
            render: (supervisorId, record) => (
                <Select
                    placeholder="Phụ trách"
                    value={supervisorId}
                    onChange={(value) => handleSupervisorChange(record.vehicleId, value)}
                    style={{ width: '100%' }}
                >
                    {transportManager
                        .filter(manager => !Object.values(selectedSupervisors).includes(manager.id) || manager.id === supervisorId)
                        .map(manager => (
                            <Option key={manager.id} value={manager.id}>
                                {manager.username}
                            </Option>
                        ))}
                </Select>
            ),
        },
        {
            key: 'select',
            render: (text, record) => (
                <Checkbox
                    onChange={() => handleVehicleSelect(record.vehicleId, selectedSupervisors[record.vehicleId])}
                    checked={selectedVehicles.some((v) => v.vehicleId === record.vehicleId)}
                >
                    Chọn
                </Checkbox>
            ),
        },
    ];

    const vehicleColumns = [
        { title: 'Phương tiện', dataIndex: 'vehicleName', key: 'vehicleName' },
        { title: 'Biển số xe', dataIndex: 'licensePlate', key: 'licensePlate' },
        { title: 'Màu sắc', dataIndex: 'color', key: 'color' },
        { title: 'Số chỗ ngồi', dataIndex: 'numberOfSeats', key: 'numberOfSeats', align: 'center' },
        { title: 'Số trẻ đã đăng ký', dataIndex: 'numberChildrenRegistered', key: 'numberChildrenRegistered', align: 'center' },
        { title: 'Nhãn hiệu', dataIndex: 'manufacturer', key: 'manufacturer' },
        {
            align: 'center',
            render: (record) => (
                <>
                    <EyeOutlined onClick={() => openDetailModal(record)} style={{ cursor: 'pointer' }} />
                </>
            ),
        },
        {
            align: 'center',
            render: (record) => (
                <Col>
                    <DeleteOutlined onClick={() => openConfirmDeleteModal(record.id)} style={{ cursor: 'pointer', color: 'red' }} />
                    <Popover title="Tải danh sách trẻ đăng ký xe này">
                        <DownloadOutlined onClick={() => handleDownload(record.id)} style={{ cursor: 'pointer', marginLeft: 10 }} />
                    </Popover>
                </Col>
            ),
        },
    ];

    useEffect(() => {
        fetchVehicleOfRoute();
    }, [routeActive]);

    const openVehicleModal = () => {
        setIsVehicleModalVisible(true);
        fetchAvailableVehicles();
        fetchTransportManager();
    };
    return (
        <>
            <Row justify="end" className="mb-3">
                {routeActive && (
                    <Button type="primary" onClick={() => openVehicleModal(true)}>
                        Thêm xe vào chặng
                    </Button>
                )}
            </Row>

            <Table
                columns={vehicleColumns}
                dataSource={vehicleData}
                rowKey="vehicleId"
                bordered
            />

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

            <Modal
                title="Chọn phương tiện"
                open={isVehicleModalVisible}
                onOk={handleConfirmVehicle}
                onCancel={handleCancelVehicle}
                okText="Xác nhận"
                cancelText="Đóng"
                width={1000}
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
        </>
    );
};