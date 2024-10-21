import React, { useState, useEffect, useContext } from 'react';
import { Spin, Row, Col, Button, Input, Modal, message, Card, Descriptions, Divider, Switch, List, Collapse, Avatar, DatePicker } from 'antd';
import { useParams } from 'react-router-dom';
import { getChildDetailAPI, updateServiceStatus } from '../../services/service.children';
import moment from 'moment/moment';
import Title from 'antd/es/typography/Title';
import { EditOutlined } from '@ant-design/icons';

const ChildrenInformation = () => {
    const [childrenData, setChildrenData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

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
    useEffect(() => {
        fetchChildrenData(id);
    }, [id]);

    if (loading) {
        return (
            <div className='d-flex justify-content-center align-items-center' style={{ height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    //handle change children service status
    const handleChangeServiceStatus = async (serviceName) => {
        setUpdating(true);
        try {
            await updateServiceStatus(id, serviceName);
            message.success("Cập nhật thành công");
            fetchChildrenData(id);
        } catch (error) {
            console.error('Error changing service status:', error);
            message.error("Cập nhật thất bại");
        } finally {
            setUpdating(false);
        }
    };
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
                                <span>{childrenData?.childBirthDate}</span>
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
                                    onChange={() => handleChangeServiceStatus('boarding')}
                                />
                            </Descriptions.Item>
                            <Descriptions.Item label="Đăng ký xe" span={3}>
                                <Switch
                                    checked={childrenData?.isRegisteredForTransport}
                                    loading={updating}
                                    onChange={() => handleChangeServiceStatus('transport')}
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

        </div>
    );
};

export default ChildrenInformation;
