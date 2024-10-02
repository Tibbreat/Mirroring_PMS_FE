import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AddTeacherModal from '../page/teacher/modal/AddTeacherModal';
import { logoutAPI } from '../services/service.auth';
import { AuthContext } from '../component/context/auth.context';


const Navbar = () => {
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái modal
    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext);

    // Hàm để mở modal
    const showModal = () => {
        setIsModalOpen(true);
    };

    // Hàm để đóng modal
    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
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
                            <div className='d-flex '>
                                <div className='d-flex justify-content-center align-items-center me-4 text-blue fw-bold'>Xuất CSV</div>
                                <button className="logout-btn btn" type="button" onClick={showModal}>
                                    Thêm giáo viên
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className='navbar-content-2 col-2 d-flex justify-content-center align-items-center'>
                    {location.pathname.includes('/dashboard') ? (
                        <button className="logout-btn btn" type="button" onClick={onLogout} >
                            Đăng xuất
                        </button>
                    ) : (
                        <div className='text-blue fw-bold' onClick={onLogout}>Đăng xuất</div>
                    )}
                </div>
            </nav>
            <AddTeacherModal
                isModalOpen={isModalOpen}
                handleOk={handleOk}
                handleCancel={handleCancel}
            />
        </>
    );
};

export default Navbar;
