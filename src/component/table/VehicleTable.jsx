import { Pagination, Tag, Table, Switch, Modal, Descriptions } from "antd";
import { useState } from "react";
import { EyeOutlined } from '@ant-design/icons';

export const VehicleTable = ({ data, currentPage, total, setCurrentPage }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const columns = [
        {
            title: 'Phương tiện',
            dataIndex: 'vehicleName',
            key: 'vehicleName',
        },
        {
            title: 'Biển số xe',
            dataIndex: 'licensePlate',
            key: 'licensePlate',
        },
        {
            title: 'Màu sắc',
            dataIndex: 'color',
            key: 'color',
            render: (text) => `${text}`,
        },
        {
            title: 'Số chỗ ngồi',
            dataIndex: 'numberOfSeats',
            key: 'numberOfSeats',
        },
        {
            title: 'Nhãn hiệu',
            dataIndex: 'manufacturer',
            key: 'manufacturer',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive) => (
                <Switch checked={isActive} />
            ),
        },
        {
            render: (record) => (
                <EyeOutlined onClick={() => showVehicleDetails(record)} style={{ cursor: 'pointer' }} />
            ),
        },
    ];

    const showVehicleDetails = (vehicle) => {
        setSelectedVehicle(vehicle);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);     
        setSelectedVehicle(null);     
    };

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
                        <Descriptions.Item span={6} label="Địa điểm đón/trả trẻ">{selectedVehicle.pickUpLocation}</Descriptions.Item>
                        <Descriptions.Item span={6} label="Thời gian đón trẻ">{selectedVehicle.timeStart}</Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </div>
    );
};
