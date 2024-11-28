import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { logoutAPI } from '../services/service.auth';
import { AuthContext } from '../component/context/auth.context';
import { LogoutOutlined } from '@ant-design/icons';

const Navbar = ( ) => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext);

    const onLogout = async () => {
        try {
            await logoutAPI();
            setUser(null);
            localStorage.removeItem("access_token");
            navigate('/pms/auth/login');
        } catch (error) {

            console.error('Logout failed', error);
        }
    }

    return (
        <nav className="navbar-custom d-flex">
            <div className='navbar-content-1 col-10 d-flex justify-content-center mt-3'>
                <div className='col-8 d-flex align-items-center'>
                </div>
            </div>
            <div className='navbar-content-2 col-2 d-flex justify-content-center align-items-center'>
                {user && (
                    <Button type="primary" onClick={onLogout} icon={<LogoutOutlined />}>
                        Đăng xuất
                    </Button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
