import React, { useState, useEffect } from 'react';
import { getUserAPI, changeUserStatusAPI } from '../../services/services.user';
import { Spin, Tag, Row, Col, Avatar, Button, Input, Modal, message, Card, Descriptions, Divider } from 'antd';
import { useParams } from 'react-router-dom';

const TeacherInformation = () => {
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { id } = useParams();

    const fetchTeacher = async (id) => {
        setLoading(true);
        try {
            const response = await getUserAPI(id);
            setTeacher(response.data);
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching teacher:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeacher(id);
    }, [id]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            await changeUserStatusAPI(teacher.id);
            message.success('Cập nhật trạng thái thành công');
            await fetchTeacher(id);
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
                        <Avatar size={256} src={teacher?.imageLink || "/image/5856.jpg"} />
                    </Col>
                    <Col xs={24} sm={16}>
                        <Descriptions title="Thông tin giáo viên" bordered>
                            <Descriptions.Item label="Họ và tên" span={3}>{teacher?.fullName}</Descriptions.Item>
                            <Descriptions.Item label="Vai trò" span={3}>{teacher?.role}</Descriptions.Item>
                            <Descriptions.Item label="Trạng thái" span={3}>
                                <Tag color={teacher.isActive ? 'green' : 'red'} onClick={showModal}>
                                    {teacher.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Mã nhân viên" span={3}>{teacher?.id}</Descriptions.Item>
                            <Descriptions.Item label="Account" span={3}>{teacher?.username}</Descriptions.Item>
                            <Descriptions.Item label="E-mail" span={3}>{teacher?.email}</Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại" span={3}>{teacher?.phone}</Descriptions.Item>
                            <Descriptions.Item label="CCCD/CMT" span={3}>{teacher?.idCardNumber}</Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ" span={3}>
                                <Input value={teacher?.address} readOnly />
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
                    {teacher?.isActive 
                        ? 'Bạn có muốn hạn chế tài khoản này?' 
                        : 'Bạn có muốn kích hoạt tài khoản này?'}
                </p>
            </Modal>
        </div>
    );
};

export default TeacherInformation;