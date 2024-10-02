import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginAPI } from '../../services/service.auth';
import { AuthContext } from '../../component/context/auth.context';
import { message } from 'antd';


const Login = () => {
    const navigate = useNavigate();

    const [disable, setDisable] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { user, setUser } = useContext(AuthContext);

    const onSubmitLogin = async (e) => {
        e.preventDefault();
        setDisable(true);
        try {
            const response = await loginAPI(username, password);
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
        <div className="login-page d-flex justify-content-center align-items-center vh-100" >
            <div className='login'>
                <div className="login-title text-center mb-4">
                    <div className="login-title-first display-6 fw-bold">Đăng nhập vào hệ thống</div>
                </div>
                <form className='login-form-body' onSubmit={onSubmitLogin}>

                    <div className="login-form-input d-flex flex-column justify-content-center align-items-center">
                        <div className='login-sub-title mt-5'>
                            <p>Sử dụng tài khoản được cấp để đăng nhập vào hệ thống</p>
                        </div>

                        <div className='form-input mt-3'>
                            <input
                                className='form-control input-1 mt-3'
                                type="text"
                                id="username"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Tài khoản"
                                required
                            />
                        </div>
                        <div className='form-input'>
                            <input
                                className='form-control input-1 mt-3'
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mật khẩu"
                                required
                            />
                        </div>

                    </div>
                    <div className='login-form-btn d-flex justify-content-center mt-3' >
                        <button className='btn btn-blue-1 ' type='submit'>Đăng nhập</button>
                    </div>
                    <div className='login-form-btn d-flex justify-content-center mt-3'>
                        <Link to={"/pms/auth/forgot-password"} className='forgot-password '>
                            Quên mật khẩu
                        </Link>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default Login;
