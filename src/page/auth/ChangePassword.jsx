import React from 'react';
import { Form, Input, Button, Card } from 'antd';

const ChangePassword = () => {
    const onFinish = (values) => {
        console.log('Received values:', values);
        // Handle form submission logic here
    };

    return (
        <div className="login-page d-flex justify-content-center align-items-center vh-100">
            <Card className='login' style={{ width: 400 }}>
                <div className="login-title text-center mb-4">
                    <div className="login-title-first display-6 fw-bold">Đổi mật khẩu</div>
                </div>
                <Form
                    name="change_password"
                    className='login-form-body'
                    onFinish={onFinish}
                >
                    <div className="login-form-input d-flex flex-column justify-content-center align-items-center">
                        <div className='login-sub-title mt-5'>
                            <p>Vui lòng nhập mã xác minh đã được gửi về e-mail</p>
                        </div>
                        <Form.Item
                            name="code"
                            rules={[{ required: true, message: 'Vui lòng nhập mã xác minh!' }]}
                        >
                            <Input
                                className='form-control input-1 mt-3'
                                placeholder="Mã xác minh"
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
                        >
                            <Input.Password
                                className='form-control input-1 mt-3'
                                placeholder="Mật khẩu mới"
                            />
                        </Form.Item>
                        <Form.Item
                            name="re-password"
                            rules={[{ required: true, message: 'Vui lòng xác nhận lại mật khẩu mới!' }]}
                        >
                            <Input.Password
                                className='form-control input-1 mt-3'
                                placeholder="Xác nhận lại mật khẩu mới"
                            />
                        </Form.Item>
                    </div>
                    <div className='login-form-btn d-flex justify-content-center mt-3'>
                        <Button type='primary' htmlType='submit' className='btn btn-blue-1'>
                            Đổi mật khẩu
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default ChangePassword;