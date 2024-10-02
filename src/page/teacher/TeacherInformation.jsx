import React, { useState, useEffect } from 'react';
import { getUserAPI } from '../../services/services.user';
import { Spin, Tag } from 'antd';
import { useParams } from 'react-router-dom';

const TeacherInformation = () => {
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    const fetchTeacher = async (id) => {
        setLoading(true);
        try {
            const response = await getUserAPI(id);
            setTeacher(response.data);
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching teacher:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeacher(id);
    }, [id]);

    if (loading) {
        return (
            <div className='d-flex justify-content-center align-items-center'>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className='col-11 p-2'>
            <div className='d-flex'>
                <div className='col-4 d-flex flex-column align-items-center'>

                    <div className='avatar'>
                        <img className='teacher-avatar' src={teacher?.avatarUrl || "/image/5856.jpg"} alt="" />
                    </div>
                </div>
                <div className='col-8'>

                    <div className='d-flex justify-content-between mt-5'>
                        <div className='col-5 '>
                            <h4 style={{ color: "#509CDB" }}>{teacher?.fullName} </h4>
                            <p className='fw-bold' style={{ color: "#509CDB" }} >{teacher?.role}</p>
                        </div>
                        <div className='col-5'>

                            <Tag className='ms-3' color={teacher.isActive ? 'green' : 'red'}>
                                {teacher.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                            </Tag>
                        </div>
                    </div>
                    <div className='d-flex justify-content-between mt-5'>
                        <div className='col-5 row'>
                            <div className='col-5 fw-bold'>Mã nhân viên</div>
                            <div className='col-7'>{teacher?.id}</div>
                        </div>
                        <div className='col-5 row'>
                            <div className='col-5 fw-bold'>Số điện thoại</div>
                            <div className='col-7'>{teacher?.phone}</div>
                        </div>
                    </div>
                    <div className='d-flex justify-content-between mt-5'>
                        <div className='col-5 row'>
                            <div className='col-5 fw-bold'>Account</div>
                            <div className='col-7'>{teacher?.username}</div>
                        </div>
                        <div className='col-5 row'>
                            <div className='col-5 fw-bold'>E-mail</div>
                            <div className='col-7'>{teacher?.email}</div>
                        </div>

                    </div>
                    <div className='d-flex justify-content-between mt-5'>
                        <div className='col-10 d-flex'>
                            <span className='col-2 fw-bold'>Địa chỉ</span>
                            <input className='form-control col-10' type="text" value={teacher?.address} />
                        </div>
                    </div>
                    <div className='d-flex justify-content-between mt-5'>

                    </div>
                    <div className='d-flex justify-content-between mt-5'>
                        <div className='col-12 d-flex justify-content-center'>
                            <button className="logout-btn btn" type="submit">
                                Lưu thông tin
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherInformation;
