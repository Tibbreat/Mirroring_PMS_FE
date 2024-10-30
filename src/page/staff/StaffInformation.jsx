import React, { useState, useEffect } from 'react';
import { getUserAPI, changeUserStatusAPI } from '../../services/services.user';
import { Spin, Tag, Row, Col, Avatar, Button, Input, Modal, message, Card, Descriptions, Divider, Switch, Pagination, Table } from 'antd';
import { Link, useParams } from 'react-router-dom';
import Title from 'antd/es/typography/Title';
import moment from 'moment';
import { EditOutlined } from '@ant-design/icons';
import { getClassListBaseOnManagerId } from '../../services/services.class';

const StaffInformation = () => {
    const [staff, setStaff] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [classes, setClasses] = useState([]);
    const [total, setTotal] = useState(0);
    const { id } = useParams();

    const fetchStaff = async (id) => {
        setLoading(true);
        try {
            const response = await getUserAPI(id);
            setStaff(response.data);
            console.log(response.data);
            // Placeholder for fetching classes based on staff (replace with actual API call)
            const response_2 = await getClassListBaseOnManagerId(id, currentPage);
            setClasses(response_2.data);
            setTotal(response_2.data.total);
        } catch (error) {
            console.error('Error fetching staff:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff(id);
    }, [id, currentPage]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            await changeUserStatusAPI(staff.id);
            message.success('Cập nhật trạng thái thành công');
            await fetchStaff(id);
        } catch (error) {
            console.error('Error changing user status:', error);
        } finally {
            setIsModalVisible(false);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const columns = [
        {
            title: 'Tên lớp',
            dataIndex: 'className',
            key: 'className',
            render: (text, record) => (
                <Link to={`/pms/manage/class/${record.id}`} style={{ textDecoration: "none" }}>
                    {text}
                </Link>
            ),
        },
        {
            title: 'Độ tuổi',
            dataIndex: 'ageRange',
            key: 'ageRange',
            render: (text) => `${text} tuổi`,
        },
        {
            title: 'Sí số lớp',
            dataIndex: 'totalStudent',
            key: 'totalStudent',

        },
        {
            title: 'Năm học',
            dataIndex: 'academicYear',
            key: 'academicYear',
        },
        {
            title: 'Ngày khai giảng',
            dataIndex: 'openingDay',
            key: 'openingDay',
            render: (text) => {
                return text ? moment(text).format('DD-MM-YYYY') : '';
            },
        }
    ];

    if (loading) {
        return (
            <div className='d-flex justify-content-center align-items-center' style={{ height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className='container'>
            <Card style={{ marginTop: 20 }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={8} className='d-flex flex-column align-items-center justify-content-center'>
                        <Avatar size={128} src={staff?.imageLink || "/image/5856.jpg"} />
                        <Tag className='mt-2' color={staff.isActive ? 'green' : 'red'}>
                            {staff.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                        </Tag>
                    </Col>
                    <Col xs={24} sm={16}>
                        <Row justify="space-between" className='mb-3'>
                            <Col>
                                <Title level={5}>Thông tin giáo viên</Title>
                            </Col>
                            <Col>
                                <Button type="link" icon={<EditOutlined />} >
                                    Chỉnh sửa thông tin
                                </Button>
                            </Col>
                        </Row>
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="Họ và tên">{staff?.fullName}</Descriptions.Item>
                            <Descriptions.Item label="Vai trò">
                                {staff?.role === 'CLASS_MANAGER' && 'Quản lý lớp'}
                                {staff?.role === 'KITCHEN_MANAGER' && 'Quản lý bếp'}
                                {staff?.role === 'TRANSPORT_MANAGER' && 'Quản lý dịch vụ vận chuyển'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Switch checked={staff.isActive} onClick={showModal} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Mã nhân viên">{staff?.id}</Descriptions.Item>
                            <Descriptions.Item label="Account">{staff?.username}</Descriptions.Item>
                            <Descriptions.Item label="E-mail">{staff?.email}</Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại">{staff?.phone}</Descriptions.Item>
                            <Descriptions.Item label="CCCD/CMT">{staff?.idCardNumber}</Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ" span={2}>{staff?.address}</Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>

                {staff.role === "CLASS_MANAGER" && (
                    <>
                        <Divider />
                        <Col xs={24} sm={16} className='container'>
                            <Title level={4}>Danh sách lớp phụ trách</Title>
                        </Col>
                        <Table
                            dataSource={classes}
                            columns={columns}
                            pagination={false}
                            rowKey={(record) => record.id}
                        />
                        <Pagination
                            current={currentPage}
                            total={total}
                            onChange={(page) => setCurrentPage(page)}
                            style={{ textAlign: 'center', marginTop: 20 }}
                        />
                    </>
                )}
            </Card>
            <Modal title="Thay đổi trạng thái" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <p>
                    {staff?.isActive
                        ? 'Bạn có muốn hạn chế tài khoản này?'
                        : 'Bạn có muốn kích hoạt tài khoản này?'}
                </p>
            </Modal>
        </div>
    );
};

export default StaffInformation;
