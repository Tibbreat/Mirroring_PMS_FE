import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { logoutAPI } from '../services/service.auth';
import { AuthContext } from '../component/context/auth.context';
import AddTeacherModal from '../component/modal/AddTeacherModal';
import AddStaffModal from '../component/modal/AddStaffModal';

const Navbar = ({ onTeacherAdded }) => {
    const location = useLocation();
    const [isModalTeacherOpen, setIsModalTeacherOpen] = useState(false);
    const [isModalStaffOpen, setIsModalStaffOpen] = useState(false);
    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext);

    const showModalTeacher = () => {
        setIsModalTeacherOpen(true);
    };

    const handleOkTeacher = () => {
        setIsModalTeacherOpen(false);
        onTeacherAdded(); 
    };

    const handleCancelTeacher = () => {
        setIsModalTeacherOpen(false);
    };

    const showModalStaff = () => {
        setIsModalStaffOpen(true);
    };

    const handleOkStaff = () => {
        setIsModalStaffOpen(false);
    };

    const handleCancelStaff = () => {
        setIsModalStaffOpen(false);
    };

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
        <>
            <nav className="navbar-custom d-flex">
                <div className='navbar-content-1 col-10 d-flex justify-content-center mt-3'>
                    <div className='col-8 d-flex align-items-center'>
                        {location.pathname.includes('/teacher') && (
                            <div className='d-flex'>
                                <div className='d-flex justify-content-center align-items-center me-4 text-blue fw-bold'>Xuất CSV</div>
                                <button className="logout-btn btn" type="button" onClick={showModalTeacher}>
                                    Thêm giáo viên
                                </button>
                            </div>
                        )}
                        {location.pathname.includes('/staff') && (
                            <div className='d-flex'>
                                <div className='d-flex justify-content-center align-items-center me-4 text-blue fw-bold'>Xuất CSV</div>
                                <button className="logout-btn btn" type="button" onClick={showModalStaff}>
                                    Thêm nhân viên
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className='navbar-content-2 col-2 d-flex justify-content-center align-items-center'>
                    {user && (
                        <button className="logout-btn btn" type="button" onClick={onLogout}>
                            Đăng xuất
                        </button>
                    )}
                </div>
            </nav>

            <AddTeacherModal
                isModalOpen={isModalTeacherOpen}
                handleOk={handleOkTeacher}
                handleCancel={handleCancelTeacher}
            />

            <AddStaffModal
                isModalOpen={isModalStaffOpen}
                handleOk={handleOkStaff}
                handleCancel={handleCancelStaff}
            />
        </>
    );
};

export default Navbar;