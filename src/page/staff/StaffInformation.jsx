import React, { useState, useEffect } from 'react';
import { getUserAPI, changeUserStatusAPI } from '../../services/services.user';
import { Spin, Tag, Row, Col, Avatar, Button, Input, Modal, message, Card, Descriptions, Divider } from 'antd';
import { useParams } from 'react-router-dom';

const StaffInformation = () => {
    const [staff, setStaff] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { id } = useParams();

    const fetchStaff = async (id) => {
        setLoading(true);
        try {
            const response = await getUserAPI(id);
            setStaff(response.data);
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching staff:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff(id);
    }, [id]);

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
                    <Col xs={24} sm={8} className='d-flex justify-content-center'>
                        <Avatar size={256} src={staff?.imageLink || "/image/5856.jpg"} />
                    </Col>
                    <Col xs={24} sm={16}>
                        <Descriptions title="Thông tin giáo viên" bordered>
                            <Descriptions.Item label="Mã nhân viên" span={3}>{staff?.id}</Descriptions.Item>
                            <Descriptions.Item label="Họ và tên" span={3}>{staff?.fullName}</Descriptions.Item>
                            <Descriptions.Item label="Vai trò" span={3}>
                                {staff?.role === 'CLASS_MANAGER' && 'Quản lý lớp'}
                                {staff?.role === 'KITCHEN_MANAGER' && 'Quản lý bếp'}
                                {staff?.role === 'TRANSPORT_MANAGER' && 'Quản lý dịch vụ vận chuyển'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái" span={3}>
                                <Tag color={staff.isActive ? 'green' : 'red'} onClick={showModal}>
                                    {staff.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Account" span={3}>{staff?.username}</Descriptions.Item>
                            <Descriptions.Item label="E-mail" span={3}>{staff?.email}</Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại" span={3}>{staff?.phone}</Descriptions.Item>
                            <Descriptions.Item label="CCCD/CMT" span={3}>{staff?.idCardNumber}</Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ" span={3}>
                                <Input value={staff?.address} readOnly />
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
                <Divider />
                <Row justify="center">
                    <Button type="primary" className="logout-btn">
                        Lưu thông tin
                    </Button>
                </Row>
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