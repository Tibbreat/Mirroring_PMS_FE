import React, { useState, useEffect, useContext } from 'react';
import { Card, Spin, message, Button, Input, Form, Typography, Space, Row, Col, Divider } from 'antd';
import { getSchoolInformationAPI, updateSchoolInformationAPI } from '../../services/service.school';
import { AuthContext } from '../../component/context/auth.context';
import { EditOutlined } from '@ant-design/icons';
const { Title } = Typography;

export const SchoolInformation = () => {
    const [schoolInfo, setSchoolInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const { user } = useContext(AuthContext);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchSchoolInfo = async () => {
            try {
                const response = await getSchoolInformationAPI(user.id);
                setSchoolInfo(response.data);
                form.setFieldsValue(response.data);
            } catch (error) {
                console.error('Error fetching school information:', error);
                message.error('Không thể lấy thông tin trường học');
            } finally {
                setLoading(false);
            }
        };

        fetchSchoolInfo();
    }, [user.id, form]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            const values = await form.validateFields();
            await updateSchoolInformationAPI(user.id, values);
            setSchoolInfo(values);
            setIsEditing(false);
            message.success('Thông tin trường học đã được cập nhật');
        } catch (error) {
            console.error('Error updating school information:', error);
            message.error('Cập nhật thông tin thất bại');
        }
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        form.setFieldsValue(schoolInfo);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="container">
            <Card

                style={{ marginTop: 20 }}
                extra={
                    !isEditing && (
                        <>
                            <Button type="link" icon={<EditOutlined />} onClick={handleEditClick} >
                                Chỉnh sửa thông tin
                            </Button>
                        </>
                    )

                }
            >
                <Form form={form} layout="vertical">
                    <Title level={5}>Thông tin chung</Title>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item label="Tên trường" name="schoolName">
                                <Input disabled={!isEditing} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="Số điện thoại" name="phoneContact">
                                <Input disabled={!isEditing} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Email" name="emailContact">
                                <Input disabled={!isEditing} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Địa chỉ" name="address">
                                <Input disabled={!isEditing} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider />
                    <Title level={5}>Hiệu trưởng</Title>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Họ và tên">
                                <Input value={schoolInfo?.principal?.fullName} disabled={!isEditing} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Số điện thoại liên hệ">
                                <Input value={schoolInfo?.principal?.phone} disabled={!isEditing} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item>
                        {isEditing && (
                            <div className="d-flex justify-content-center gap-2">
                                <Button type="primary" className='btn-success' onClick={handleSaveClick}>
                                    Lưu
                                </Button>
                                <Button onClick={handleCancelClick}>Hủy</Button>
                            </div>
                        )}
                    </Form.Item>

                </Form>
            </Card>
        </div >
    );
};
