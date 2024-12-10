import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Col, Dropdown, Menu } from 'antd';
import { logoutAPI } from '../services/service.auth';
import { AuthContext } from '../component/context/auth.context';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';

const Navbar = () => {
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

    const getRoleLabel = (role) => {
        switch (role) {
            case 'TEACHER':
                return 'Giáo viên';
            case 'ADMIN':
                return 'Hiệu trưởng';
            case 'CLASS_MANAGER':
                return 'Quản lý lớp';
            case 'TRANSPORT_MANAGER':
                return 'Quản lý xe';
            case 'KITCHEN_MANAGER':
                return 'Quản lý bếp';
            default:
                return 'Người dùng';
        }
    };

    const menu = (
        <Menu>
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={onLogout}>
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    return (
        <nav className="navbar-custom d-flex">
            <div className='navbar-content-1 col-10 mt-3'>
            </div>
            <div className='navbar-content-2 col-2 d-flex justify-content-center align-items-center'>
                <div className='d-flex flex-column me-3'>
                    <p className='mb-0'>{user.username}</p>
                    <p className='mb-0 text-blue'>{getRoleLabel(user.role)}</p>
                </div>
                <Col>
                    <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                        <div className="avatar-container">
                            {user && user.avatar ? (
                                <Avatar width={54} src={user.avatar} />
                            ) : (
                                <Avatar size="large" icon={<UserOutlined />} />
                            )}
                        </div>
                    </Dropdown>
                </Col>
            </div>
        </nav>
    );
};

export default Navbar;
