import { Modal, Pagination, Table, Tag, Spin, message, Button } from 'antd';
import moment from 'moment';
import { EyeOutlined } from '@ant-design/icons';
import { useState, useEffect } from "react";
import { getFoodRequestItems, getFoodRequestsAPI, updateAcceptFoodRequestAPI } from '../../services/service.foodprovider';

export const FoodRequestTable = ({ currentPage, total, setCurrentPage, providerId }) => {
    const [data, setData] = useState([]); // Thêm state để lưu trữ dữ liệu bảng
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [items, setItems] = useState([]);
    const [loadingItems, setLoadingItems] = useState(false);


    const fetchFoodRequests = async (page) => {
        try {
            const response = await getFoodRequestsAPI(providerId, page);
            setData(response.data.listData);
        } catch (error) {
            console.error('Error fetching food requests:', error);
        }
    }

    useEffect(() => {
        fetchFoodRequests(currentPage);
    }, [currentPage]);

    const columns = [
        {
            title: "Ngày tạo yêu cầu",
            dataIndex: "requestDate",
            key: "requestDate",
            render: (text) => moment(text).format('DD-MM-YYYY'),
        },
        {
            title: "Thời gian tạo yêu cầu",
            dataIndex: "requestDate",
            key: "requestDate",
            render: (text) => moment(text).format('HH:mm'),
        },
        {
            title: "Người tạo yêu cầu",
            dataIndex: "requestOwner",
            key: "requestOwner",
        },
        {
            title: "Ngày nhận dự tính",
            dataIndex: "dayNeeded",
            key: "dayNeeded",
            render: (text) => moment(text).format('DD-MM-YYYY'),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                let color = '';
                let text = '';
                switch (status) {
                    case 'PENDING':
                        color = 'orange';
                        text = 'Đang chờ xác nhận';
                        break;
                    case 'APPROVED':
                        color = 'green';
                        text = 'Yêu cầu đã được gửi đi';
                        break;
                    case 'CANCEL':
                        color = 'red';
                        text = 'Yêu cầu bị hủy';
                        break;
                    default:
                        color = 'gray';
                        text = 'Trạng thái không xác định';
                        break;
                }
                return <Tag color={color}>{text}</Tag>;
            }
        },
        {
            render: (text, record) => (
                <EyeOutlined onClick={() => showRequestDetails(record)} style={{ cursor: 'pointer' }} />
            ),
        },
    ];

    const showRequestDetails = async (request) => {
        setSelectedRequest(request);
        setIsModalVisible(true);
        setLoadingItems(true);
        try {
            const response = await getFoodRequestItems(request.id);
            setItems(response.data);  // Giả sử response.data là danh sách items
        } catch (error) {
            console.error('Error fetching food request items:', error);
        } finally {
            setLoadingItems(false);
        }
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedRequest(null);
        setItems([]); // Clear items khi đóng modal
    };

    const handleOK = async () => {
        try {
            const response = await updateAcceptFoodRequestAPI(selectedRequest.id, "APPROVED");
            message.success("Yêu cầu đã được xác nhận và gửi đến đối tác");
            fetchFoodRequests(currentPage);  // Fetch lại dữ liệu sau khi cập nhật thành công
            handleModalClose();
        } catch (error) {
            message.error("Có lỗi xảy ra khi xác nhận yêu cầu");
        }
    }

    const handleReject = async () => {
        try {
            const response = await updateAcceptFoodRequestAPI(selectedRequest.id, "CANCEL");
            message.success("Yêu cầu đã bị từ chối");
            fetchFoodRequests(currentPage);  // Fetch lại dữ liệu sau khi từ chối
            handleModalClose();
        } catch (error) {
            message.error("Có lỗi xảy ra khi từ chối yêu cầu");
        }
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const itemColumns = [
        {
            title: 'STT',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên thực phẩm',
            dataIndex: 'itemName',
            key: 'itemName',
        },
        {
            title: 'Số lượng',
            dataIndex: 'itemQuantity',
            key: 'itemQuantity',
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            key: 'note',
        },
    ];

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
                title="Thông tin yêu cầu"
                open={isModalVisible}
                onCancel={handleModalClose}
                footer={
                    selectedRequest?.status === 'PENDING' ? (
                        [
                            <Button key="reject" danger onClick={handleReject}>
                                Từ chối
                            </Button>,
                            <Button key="cancel" onClick={handleModalClose}>
                                Đóng
                            </Button>,
                            <Button key="confirm" type="primary" onClick={handleOK}>
                                Xác nhận
                            </Button>,
                        ]
                    ) : (
                        [
                            <Button key="close" onClick={handleModalClose}>
                                Đóng
                            </Button>
                        ]
                    )
                }
                width={800}
            >
                <Table
                    columns={itemColumns}
                    dataSource={items}
                    pagination={false}
                    rowKey="itemId"
                />
            </Modal>

        </div>
    );
};
