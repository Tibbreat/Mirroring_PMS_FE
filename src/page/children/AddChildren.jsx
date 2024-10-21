import React, { useContext, useState } from 'react';
import { Form, Input, Button, DatePicker, Select, Card, Row, Col, message, Spin } from 'antd';
import { addChildren } from '../../services/service.children';
import UploadImage from '../../component/input/UploadImage';
import { AuthContext } from '../../component/context/auth.context';

const { Option } = Select;

const AddChildren = () => {
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState(null);
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false); // Add loading state

    const handleImageChange = (file) => {
        setImageFile(file);
    };

    const onFinish = async (values) => {
        const formattedValues = {
            ...values,
            childBirthDate: values.childBirthDate ? values.childBirthDate.format('YYYY-MM-DD') : null,
            createdBy: user.id,
        };

        const formData = new FormData();
        formData.append('children', new Blob([JSON.stringify(formattedValues)], { type: 'application/json' }));

        if (!imageFile) {
            message.error('Vui lòng chọn ảnh');
        } else {
            formData.append('image', imageFile);
            setLoading(true); // Set loading to true when starting to process the form
            try {
                const response = await addChildren(formData);
                console.log(response);
                message.success('Thêm trẻ thành công!');
                form.resetFields();
                setImageFile(null);
            } catch (error) {
                console.error('Error:', error);
                message.error('Có lỗi xảy ra!');
            } finally {
                setLoading(false); // Set loading to false after processing completes
            }
        }
    };

    return (
        <div className="container" style={{ padding: '24px' }}>
            <Card title="Thêm trẻ mới" bordered={false}>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row gutter={16}>
                        <Col xs={24} md={8}>
                            <Form.Item name="image">
                                <UploadImage onImageChange={handleImageChange} disabled={loading} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={16}>
                            {/* Form content for child information */}
                            <Row gutter={16}>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="childName"
                                        label="Tên trẻ em"
                                        rules={[{ required: true, message: 'Vui lòng nhập tên trẻ em' }]}
                                    >
                                        <Input placeholder="Nhập tên trẻ em" disabled={loading} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="childBirthDate"
                                        label="Ngày sinh"
                                        rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
                                    >
                                        <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày sinh" disabled={loading} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="gender"
                                        label="Giới tính"
                                        rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                                    >
                                        <Select placeholder="Chọn giới tính" disabled={loading}>
                                            <Option value="male">Nam</Option>
                                            <Option value="female">Nữ</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="nationality"
                                        label="Quốc tịch"
                                        rules={[{ required: true, message: 'Không được để trống' }]}
                                    >
                                        <Input placeholder="Quốc tịch" disabled={loading} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="religion"
                                        label="Tôn giáo"
                                        rules={[{ required: true, message: 'Không được để trống' }]}
                                    >
                                        <Input placeholder="Tôn giáo" disabled={loading} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col xs={24} md={24}>
                                    <Form.Item
                                        name="birthAddress"
                                        label="Địa chỉ khai sinh"
                                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ khai sinh' }]}
                                    >
                                        <Input placeholder="Nhập địa chỉ khai sinh" disabled={loading} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col xs={24} md={24}>
                                    <Form.Item
                                        name="childAddress"
                                        label="Địa chỉ hiện tại"
                                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ hiện tại' }]}
                                    >
                                        <Input placeholder="Nhập địa chỉ hiện tại" disabled={loading} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    {/* Thông tin bố mẹ */}
                    <Card title="Thông tin bố" bordered={false} style={{ marginTop: 20 }}>
                        <Row gutter={16}>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    name={['father', 'fullName']}
                                    label="Họ và tên"
                                    rules={[{ required: true, message: 'Vui lòng nhập tên bố' }]}
                                >
                                    <Input placeholder="Nhập tên bố" disabled={loading} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    name={['father', 'phone']}
                                    label="Số điện thoại"
                                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại bố' }]}
                                >
                                    <Input placeholder="Nhập số điện thoại bố" disabled={loading} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    name={['father', 'idCardNumber']}
                                    label="Số CMND/CCCD"
                                    rules={[{ required: true, message: 'Vui lòng nhập số CMND/CCCD bố' }]}
                                >
                                    <Input placeholder="Nhập số CMND/CCCD bố" disabled={loading} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <Card title="Thông tin mẹ" bordered={false} style={{ marginTop: 20 }}>
                        <Row gutter={16}>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    name={['mother', 'fullName']}
                                    label="Họ và tên"
                                    rules={[{ required: true, message: 'Vui lòng nhập tên mẹ' }]}
                                >
                                    <Input placeholder="Nhập tên mẹ" disabled={loading} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    name={['mother', 'phone']}
                                    label="Số điện thoại"
                                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại mẹ' }]}
                                >
                                    <Input placeholder="Nhập số điện thoại mẹ" disabled={loading} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    name={['mother', 'idCardNumber']}
                                    label="Số CMND/CCCD"
                                    rules={[{ required: true, message: 'Vui lòng nhập số CMND/CCCD mẹ' }]}
                                >
                                    <Input placeholder="Nhập số CMND/CCCD mẹ" disabled={loading} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <Form.Item>
                        <Spin spinning={loading}>
                            <Button type="primary" htmlType="submit" style={{ width: '100%' }} disabled={loading}>
                                Thêm trẻ em
                            </Button>
                        </Spin>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default AddChildren;
