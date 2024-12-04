import { Modal, Pagination, Table, Tag, message, Button } from 'antd';
import moment from 'moment';
import { EyeOutlined } from '@ant-design/icons';
import { useState, useEffect, useContext } from "react";
import { getFoodRequestItems, getFoodRequestsAPI, updateAcceptFoodRequestAPI } from '../../services/service.foodprovider';
import { AuthContext } from '../context/auth.context';

export const FoodRequestTable = ({ dataDefault, currentPage, total, setCurrentPage, providerId, isActive, role }) => {
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [items, setItems] = useState([]);
    const [loadingItems, setLoadingItems] = useState(false);
    const [pdfPreviewVisible, setPdfPreviewVisible] = useState(false);
    const [pdfBase64, setPdfBase64] = useState(null);
    const { user } = useContext(AuthContext);

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
    }, [currentPage, dataDefault]);

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

    // Show request details in a modal
    const showRequestDetails = async (request) => {
        setSelectedRequest(request);
        setIsModalVisible(true);
        setLoadingItems(true);
        try {
            const response = await getFoodRequestItems(request.id);
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching food request items:', error);
        } finally {
            setLoadingItems(false);
        }
    };

    // Close modal and reset state
    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedRequest(null);
        setItems([]);
    };

    // Handle approval action and preview PDF
    const handleOK = async () => {
        try {
            const requestData = {
                schoolId: user.schoolId,
                providerId: providerId
            };

            const response = await updateAcceptFoodRequestAPI(selectedRequest.id, "APPROVED", requestData);
            if (response.data.pdfBase64) {
                setPdfBase64(response.data.pdfBase64);
                setPdfPreviewVisible(true);

                // Tạo và kích hoạt liên kết tải xuống
                const link = document.createElement('a');
                link.href = `data:application/pdf;base64,${response.data.pdfBase64}`;
                link.download = 'yeu-cau-cung-cap-thuc-pham.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            message.success("Yêu cầu đã được xác nhận và gửi đến đối tác");
            fetchFoodRequests(currentPage);
            handleModalClose();
        } catch (error) {
            message.error("Có lỗi xảy ra khi xác nhận yêu cầu");
        }
    };


    const handleReject = async () => {
        try {
            await updateAcceptFoodRequestAPI(selectedRequest.id, "CANCEL");
            message.success("Yêu cầu đã bị từ chối");
            fetchFoodRequests(currentPage);
            handleModalClose();
        } catch (error) {
            message.error("Có lỗi xảy ra khi từ chối yêu cầu");
        }
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePdfPreviewClose = () => {
        setPdfPreviewVisible(false);
        setPdfBase64(null);
    };

    const itemColumns = [
        {
            title: 'STT',
            key: 'index',
            align: 'center',
            render: (record, text, index) => index + 1,
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
                bordered={true}
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
                    role === "ADMIN" && selectedRequest?.status === 'PENDING' && isActive ? (
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
                    bordered={true}
                />
            </Modal>

            <Modal
                title="Hợp đồng"
                open={pdfPreviewVisible}
                onCancel={handlePdfPreviewClose}
                footer={<Button onClick={handlePdfPreviewClose}>Đóng</Button>}
                width={1000}
            >
                <object
                    data={`data:application/pdf;base64,${pdfBase64}`}
                    type="application/pdf"
                    width="100%"
                    height="500px"
                >
                    <p>Hợp đồng đã sẵn sàng. Hãy tải về <a href={`data:application/pdf;base64,${pdfBase64}`} download="document.pdf">tại đây</a>.</p>
                </object>
            </Modal>

        </div>
    );
};
