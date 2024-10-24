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
            if (response?.status === 200 && response.data.token) {
                localStorage.setItem("access_token", response.data.token);
                setUser({
                    id: response.data.id,
                    role: response.data.role,
                });
                navigate("/pms/manage/dashboard");
            }
        } catch (error) {
            console.log("Login error:", error);
            message.error(error?.data?.message || "Có lỗi xảy ra trong quá trình đăng nhập.");
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
                        rules={[
                            { required: true, message: 'Vui lòng nhập tài khoản được cấp bởi quản trị viên!' },
                            { pattern: /^[a-zA-Z0-9._]{3,20}$/, message: 'Tên tài khoản phải từ 3 đến 20 ký tự và chỉ bao gồm chữ cái, số, dấu chấm hoặc gạch dưới.' }
                        ]}
                    >
                        <Input placeholder="Username" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu!' },
                            { pattern: /^\S{5,}$/, message: 'Mật khẩu phải có ít nhất 5 ký tự và không chứa khoảng trắng.' }
                        ]}
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