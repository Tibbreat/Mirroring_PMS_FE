import React from 'react';
import { Form, Input, Button, Card } from 'antd';


const ForgotPassword = () => {
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        // Handle form submission logic here
    };

    return (
        <div className="login-page d-flex justify-content-center align-items-center vh-100">
            <Card className="forgot-password-card" style={{ width: 400 }}>
                <div className="forgot-password-title text-center mb-4">
                    <div className="forgot-password-title-first display-6 fw-bold">Quên mật khẩu</div>
                </div>
                <Form
                    name="forgot_password"
                    className="forgot-password-form-body"
                    onFinish={onFinish}
                >
                    <div className="forgot-password-sub-title text-center mt-3">
                        <p>Vui lòng nhập account hoặc số điện thoại để nhận mã OTP</p>
                    </div>
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Vui lòng nhập account hoặc số điện thoại!' }]}
                    >
                        <Input
                            className="form-control mt-3"
                            type="text"
                            placeholder="Account"
                        />
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