import React, { useState } from 'react';
import { addUserAPI } from '../../../services/services.user';
import { Modal, notification } from 'antd';


const AddTeacherModal = ({ isModalOpen, handleCancel }) => {
    const [teacherName, setTeacherName] = useState('');
    const [teacherPhone, setTeacherPhone] = useState('');
    const [teacherDob, setTeacherDob] = useState('');
    const [idCardNumber, setIdCardNumber] = useState('');
    const [teacherAddress, setTeacherAddress] = useState('');

    const handleOk = async () => {
        if (!teacherName || !teacherPhone || !teacherDob || !idCardNumber || !teacherAddress) {
            notification.error({
                message: 'Lỗi',
                description: 'Vui lòng điền đầy đủ thông tin',
            });
            return;
        }

        const userData = {
            fullName: teacherName,
            phone: teacherPhone,
            birthday: teacherDob,
            idCardNumber: idCardNumber,
            address: teacherAddress,
            role: 'TEACHER'
        };

        try {
            // Call the API to add the teacher
            const response = await addUserAPI(userData);
            notification.success({
                message: 'Thành',
                description: 'Thêm giáo viên mới thành công',
            });
            handleCancel(); 
        } catch (error) {
            console.error('Error adding teacher:', error);
        }
    };

    return (
        <Modal
            title="Thêm giáo viên"
            visible={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            width={1000}
            footer={null}
        >
            <div className="container">
                <div className="d-flex">
                    <div className="col-6">
                        <label htmlFor="teacherName" className="col-sm-3 col-form-label">Tên giáo viên</label>
                        <div className="col-10">
                            <input
                                type="text"
                                className="form-control"
                                id="teacherName"
                                placeholder="Nhập tên giáo viên"
                                value={teacherName}
                                onChange={(e) => setTeacherName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="col-6">
                        <label htmlFor="teacherPhone" className="col-sm-3 col-form-label">Số điện thoại</label>
                        <div className="col-10">
                            <input
                                type="text"
                                className="form-control"
                                id="teacherPhone"
                                placeholder="Nhập số điện thoại"
                                value={teacherPhone}
                                onChange={(e) => setTeacherPhone(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="d-flex">
                    <div className="col-6">
                        <label htmlFor="teacherDob" className="col-sm-3 col-form-label">Ngày sinh</label>
                        <div className="col-10">
                            <input
                                type="date"
                                className="form-control"
                                id="teacherDob"
                                value={teacherDob}
                                onChange={(e) => setTeacherDob(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="col-6">
                        <label htmlFor="idCardNumber" className="col-sm-3 col-form-label">CMT/CCCD</label>
                        <div className="col-10">
                            <input
                                type="text"
                                className="form-control"
                                id="idCardNumber"
                                value={idCardNumber}
                                onChange={(e) => setIdCardNumber(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <label htmlFor="teacherAddress" className="col-sm-3 col-form-label">Địa chỉ</label>
                    <div className="col-11">
                        <input
                            type="text"
                            className="form-control"
                            id="teacherAddress"
                            placeholder="Nhập địa chỉ"
                            value={teacherAddress}
                            onChange={(e) => setTeacherAddress(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="d-flex justify-content-center mt-5 ">
                    <div className="col-6 d-flex justify-content-between">
                        <button className="btn btn-primary me-2" onClick={handleOk} style={{ width: "100px" }}>
                            Thêm
                        </button>
                        <button className="btn btn-secondary" onClick={handleCancel} style={{ width: "100px" }}>
                            Hủy
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AddTeacherModal;
