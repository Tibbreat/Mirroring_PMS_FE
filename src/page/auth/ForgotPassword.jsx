import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import Title from 'antd/es/typography/Title';
import { generateCodeAPI } from '../../services/service.auth';
import { useNavigate } from 'react-router-dom';


const ForgotPassword = () => {

    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const response =  await generateCodeAPI(values.email);
            message.success('Mã OTP đã được gửi đến email của bạn!');
            localStorage.setItem('email', values.email);
            localStorage.setItem('otp', response.data);
            navigate('/pms/auth/change-password');
        } catch (error) {
            message.error("Email không tồn tại trong hệ thống!");
        }
    };

    return (
        <div className="login-page d-flex justify-content-center align-items-center vh-100">
            <Card className="forgot-password-card" style={{ width: 400 }}>
                <Form
                    name="forgot_password"
                    onFinish={onFinish}
                >
                    <div className="forgot-password-sub-title text-center mt-3">
                        <Title level={5}>Vui lòng nhập email sử dụng để đăng nhập để nhận mã OTP</Title>
                    </div>
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tài khoản được cấp để lấy lại mật khẩu!'
                            },
                            {
                                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: 'Vui lòng nhập địa chỉ email hợp lệ!'
                            }
                        ]}
                    >
                        <Input placeholder="Nhập email" />
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