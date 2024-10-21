import React, { useState, useEffect, useContext } from 'react';
import { Card, Spin, message, Button, Input, Form, Typography, Space } from 'antd';
import { getSchoolInformationAPI, updateSchoolInformationAPI } from '../../services/service.school';
import { AuthContext } from '../../component/context/auth.context';

const { Title } = Typography;

export const SchoolInformation = () => {
    const [schoolInfo, setSchoolInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const { user } = useContext(AuthContext);
    const [form] = Form.useForm();

    // Fetch school info on component mount
    useEffect(() => {
        const fetchSchoolInfo = async () => {
            try {
                const response = await getSchoolInformationAPI(user.id);
                setSchoolInfo(response.data);
                form.setFieldsValue(response.data); // Populate form with fetched data
            } catch (error) {
                console.error('Error fetching school information:', error);
                message.error('Không thể lấy thông tin trường học');
            } finally {
                setLoading(false);
            }
        };

        fetchSchoolInfo();
    }, [user.id, form]);

    // Enable edit mode
    const handleEditClick = () => {
        setIsEditing(true);
    };

    // Save updated information
    const handleSaveClick = async () => {
        try {
            const values = await form.validateFields();
            await updateSchoolInformationAPI(user.id, values); // Call API to update
            setSchoolInfo(values); // Update local state with new data
            setIsEditing(false); // Exit edit mode
            message.success('Thông tin trường học đã được cập nhật');
        } catch (error) {
            console.error('Error updating school information:', error);
            message.error('Cập nhật thông tin thất bại');
        }
    };

    // Cancel editing
    const handleCancelClick = () => {
        setIsEditing(false); // Exit edit mode
        form.setFieldsValue(schoolInfo); // Reset form values to original data
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
                title={<Title level={3}>Thông tin trường học</Title>}
                style={{ marginTop: 20 }}
                extra={
                    isEditing ? (
                        <Space>
                            <Button type="primary" onClick={handleSaveClick}>
                                Lưu
                            </Button>
                            <Button onClick={handleCancelClick}>Hủy</Button>
                        </Space>
                    ) : (
                        <Button type="primary" onClick={handleEditClick}>
                            Chỉnh sửa
                        </Button>
                    )
                }
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Tên trường" name="schoolName">
                        <Input disabled={!isEditing} />
                    </Form.Item>

                    <Form.Item label="Địa chỉ" name="address">
                        <Input disabled={!isEditing} />
                    </Form.Item>

                    <Form.Item label="Số điện thoại" name="phoneContact">
                        <Input disabled={!isEditing} />
                    </Form.Item>

                    <Form.Item label="Email" name="emailContact">
                        <Input disabled={!isEditing} />
                    </Form.Item>

                    <Form.Item label="Hiệu trưởng">
                        <Input value={schoolInfo?.principal?.fullName} disabled />
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};
