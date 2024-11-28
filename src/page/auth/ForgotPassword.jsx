import React from 'react';
import { Form, Input, Button, Card } from 'antd';
import Title from 'antd/es/typography/Title';


const ForgotPassword = () => {
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        // Handle form submission logic here
    };

    return (
        <div className="login-page d-flex justify-content-center align-items-center vh-100">
            <Card className="forgot-password-card" style={{ width: 400 }}>
                <Form
                    name="forgot_password"
                    onFinish={onFinish}
                >
                    <div className="forgot-password-sub-title text-center mt-3">
                        <Title level={5}>Vui lòng nhập account hoặc số điện thoại để nhận mã OTP</Title>
                    </div>
                    <Form.Item
                        name="username"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tài khoản được cấp để lấy lại mật khẩu!' },
                            { pattern: /^[a-zA-Z0-9._]{3,20}$/, message: 'Tên tài khoản phải từ 3 đến 20 ký tự và chỉ bao gồm chữ cái, số, dấu chấm hoặc gạch dưới.' }
                        ]}
                    >
                        <Input type="text" placeholder="Account" />
                    </Form.Item>
                    <Form.Item className="text-center">
                        <Button type="primary" htmlType="submit" className="btn btn-blue-1 mt-3">
                            Gửi mã
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default ForgotPassword;