import { Pagination, Tag, Table, Switch, Modal, Descriptions, Image, notification } from "antd";
import { useEffect, useState } from "react";
import { EyeOutlined } from '@ant-design/icons';
import { changeStatusAPI, getVehicles } from "../../services/service.vehicle";

export const VehicleTable = ({ dataDefault, providerId }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [data, setVehicle] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [pageSize] = useState(10);

    const fetchVehicle = async (providerId, page) => {
        try {
            const response = await getVehicles(providerId, page);
            setVehicle(response.data.listData);
            setTotal(response.data.total);
        } catch (error) {
            console.error("Failed to fetch vehicles:", error);
        }
    };


    useEffect(() => {
        fetchVehicle(providerId, currentPage);
    }, [currentPage, providerId, dataDefault]);

    const columns = [
        { title: 'Phương tiện', dataIndex: 'vehicleName', key: 'vehicleName' },
        { title: 'Biển số xe', dataIndex: 'licensePlate', key: 'licensePlate' },
        { title: 'Màu sắc', dataIndex: 'color', key: 'color', render: (text) => `${text}` },
        { title: 'Số chỗ ngồi', dataIndex: 'numberOfSeats', key: 'numberOfSeats' },
        { title: 'Nhãn hiệu', dataIndex: 'manufacturer', key: 'manufacturer' },
        {
            title: 'Trạng thái', dataIndex: 'isActive', key: 'isActive', render: (isActive, record) => (
                <Switch checked={isActive} onChange={() => confirmStatusChange(record)} />
            )
        },
        {
            render: (record) => (
                <EyeOutlined onClick={() => showVehicleDetails(record)} style={{ cursor: 'pointer' }} />
            )
        }
    ];

    const confirmStatusChange = (vehicle) => {
        Modal.confirm({
            title: 'Xác nhận thay đổi trạng thái',
            content: `Bạn có chắc chắn muốn ${vehicle.isActive ? 'ngưng hoạt động' : 'kích hoạt'} phương tiện này không?`,
            okText: 'Đồng ý',
            cancelText: 'Đóng',
            onOk: () => handleStatusChange(vehicle),
        });
    };

    const handleStatusChange = async (vehicle) => {
        try {
            await changeStatusAPI(vehicle.id);
            notification.success({
                message: 'Cập nhật trạng thái thành công!',
                description: vehicle.isActive ? 'Phương tiện hiện tại đã bị ngưng hoạt động.' : 'Phương tiện hiện tại được phép hoạt động.',
            });
            fetchVehicle(providerId, currentPage); // Refresh data after status change
        } catch (error) {
            notification.error({
                message: 'Cập nhật trạng thái không thành công!',
                description: 'Có lỗi xảy ra khi cập nhật trạng thái phương tiện.',
                placement: 'bottomRight',
            });
        }
    };

    const showVehicleDetails = (vehicle) => {
        setSelectedVehicle(vehicle);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedVehicle(null);
    };

    // Xử lý thay đổi trang
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="p-2">
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                rowKey="id"
            />
            <Pagination
                current={currentPage}
                total={total}
                pageSize={pageSize} // Số lượng mục mỗi trang
                onChange={handlePageChange}
                style={{ textAlign: 'center', marginTop: 20 }}
            />
            <Modal
                title="Thông tin phương tiện"
                open={isModalVisible}
                onCancel={handleModalClose}
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
