import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Row } from 'antd';
import Title from 'antd/es/typography/Title';

const ChangePassword = () => {
    const [form] = Form.useForm();
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const handleFormChange = () => {
            const { otp, newPassword, confirmPassword } = form.getFieldsValue();
            const isValid = otp && newPassword && confirmPassword && newPassword === confirmPassword;
            setIsFormValid(isValid);
        };

        form.validateFields().then(handleFormChange).catch(() => handleFormChange());

        form.setFieldsValue({
            otp: '',
            newPassword: '',
            confirmPassword: ''
        });

        form.getFieldsValue();
        form.getFieldInstance('otp').input.onchange = handleFormChange;
        form.getFieldInstance('newPassword').input.onchange = handleFormChange;
        form.getFieldInstance('confirmPassword').input.onchange = handleFormChange;

    }, [form]);

    const onFinish = (values) => {
        console.log('Received values:', values);
    };

    return (
        <div className="login-page d-flex justify-content-center align-items-center vh-100">
            <Card className="forgot-password-card" style={{ width: 500 }}>
                <Row justify="center">
                    <Title level={1}>Đổi mật khẩu</Title>
                </Row>
                <Form
                    layout="vertical"
                    name="change_password"
                    form={form}
                    onFinish={onFinish}
                >
                    <Row justify="center">
                        <Title level={5}>
                            Vui lòng nhập mã xác minh đã được gửi về e-mail
                        </Title>
                    </Row>
                    <Row justify="center">
                        <Form.Item
                            label="Mã xác minh"
                            name="otp"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mã xác minh!' },
                                { pattern: /^[0-9]{6}$/, message: 'Mã xác minh phải là 6 chữ số.' },
                            ]}
                            style={{ width: '80%' }}
                        >
                            <Input placeholder="Mã xác minh" />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu mới"
                            name="newPassword"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự.' },
                            ]}
                            style={{ width: '80%' }}
                        >
                            <Input.Password placeholder="Mật khẩu mới" />
                        </Form.Item>

                        <Form.Item
                            label="Xác nhận mật khẩu"
                            name="confirmPassword"
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error('Mật khẩu xác nhận không khớp!')
                                        );
                                    },
                                }),
                            ]}
                            style={{ width: '80%' }}
                        >
                            <Input.Password placeholder="Xác nhận mật khẩu" />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={!isFormValid} 
                            >
                                Đổi mật khẩu
                            </Button>
                        </Form.Item>
                    </Row>
                </Form>
            </Card>
        </div>
    );
};

export default ChangePassword;