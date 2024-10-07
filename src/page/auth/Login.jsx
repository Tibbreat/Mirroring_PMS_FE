import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginAPI } from '../../services/service.auth';
import { AuthContext } from '../../component/context/auth.context';
import { message, Form, Input, Button, Card } from 'antd';


const Login = () => {
    const navigate = useNavigate();
    const [disable, setDisable] = useState(false);
    const { setUser } = useContext(AuthContext);
    const [form] = Form.useForm();

    const onSubmitLogin = async (values) => {
        setDisable(true);
        try {
            const response = await loginAPI(values.username, values.password);
            if (response?.status === 200) {
                localStorage.setItem("access_token", response.data.token);
                setUser({
                    id: response.data.id,
                    role: response.data.role
                });
                navigate("/pms/manage/dashboard");
            } else {
                message.error(response?.data?.message || "Login failed.");
            }
        } catch (error) {
            message.error(error?.response?.data?.message || "An error occurred.");
        } finally {
            setDisable(false);
        }
    };

    useEffect(() => {
        localStorage.removeItem("access_token");
    }, []);

    return (
        <div className="login-page d-flex justify-content-center align-items-center vh-100">
            <Card className="login-card" style={{ width: 400 }}>
                <div className="d-flex justify-content-center align-items-center mb-4">
                    <img className='logo' src="/icon/logo.svg" alt="Logo" />
                </div>
                <div className="login-title text-center mb-4">
                    <h4 className="login-title-first fw-bold">Đăng nhập vào hệ thống</h4>
                </div>
                <Form
                    form={form}
                    name="login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onSubmitLogin}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Vui lòng nhập tài khoản được cấp bởi quản trị viên!' }]}
                    >
                        <Input placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>
                    <Form.Item className="text-center">
                        <Button type="primary" htmlType="submit" className="login-form-button" disabled={disable}>
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
                <div className="text-center">
                    <Link to="/pms/auth/forgot-password">Quên mật khẩu?</Link>
                </div>
            </Card>
        </div>
    );
};

export default Login;