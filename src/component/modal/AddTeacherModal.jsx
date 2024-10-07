import React, { useState } from 'react';
import { Modal, Input, DatePicker, notification, Button } from 'antd';
import UploadImage from '../input/UploadImage';
import moment from 'moment';
import { addUserAPI } from '../../services/services.user';

const AddTeacherModal = ({ isModalOpen, handleCancel }) => {
    const [teacherName, setTeacherName] = useState('');
    const [teacherPhone, setTeacherPhone] = useState('');
    const [teacherDob, setTeacherDob] = useState(null);
    const [idCardNumber, setIdCardNumber] = useState('');
    const [teacherAddress, setTeacherAddress] = useState('');
    const [imageFile, setImageFile] = useState(null);

    const handleOk = async () => {
        if (!teacherName || !teacherPhone || !teacherDob || !idCardNumber || !teacherAddress || !imageFile) {
            notification.error({
                message: 'Lỗi',
                description: 'Vui lòng điền đầy đủ thông tin',
            });
            return;
        }

        const userData = new FormData();
        userData.append('user', new Blob([JSON.stringify({
            fullName: teacherName,
            phone: teacherPhone,
            birthday: teacherDob.format('YYYY-MM-DD'),
            idCardNumber: idCardNumber,
            address: teacherAddress,
            role: 'TEACHER'
        })], { type: 'application/json' }));
        userData.append('image', imageFile);

        try {
            const response = await addUserAPI(userData);
            notification.success({
                message: 'Thành công',
                description: 'Thêm giáo viên mới thành công',
            });
            handleCancel();
        } catch (error) {
            console.error('Error adding teacher:', error);
            notification.error({
                message: 'Lỗi',
                description: 'Đã xảy ra lỗi khi thêm giáo viên.',
            });
        }
    };

    const handleImageChange = (file) => {
        setImageFile(file);
    };

    return (
        <Modal
            title="Thêm giáo viên"
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
            width={800}
        >
            <div className="container row">
                <div className="col-4 d-flex justify-content-center align-items-center">
                    <UploadImage onImageChange={handleImageChange} />
                </div>
                <div className="col-8">
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="teacherName" className="form-label">Tên giáo viên</label>
                            <Input
                                placeholder="Nhập tên giáo viên"
                                value={teacherName}
                                onChange={(e) => setTeacherName(e.target.value)}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="teacherPhone" className="form-label">Số điện thoại</label>
                            <Input
                                placeholder="Nhập số điện thoại"
                                value={teacherPhone}
                                onChange={(e) => setTeacherPhone(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="teacherDob" className="form-label">Ngày sinh</label>
                            <DatePicker
                                style={{ width: '100%' }}
                                value={teacherDob}
                                onChange={(date) => setTeacherDob(date)}
                                format="DD-MM-YYYY"
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="idCardNumber" className="form-label">CMT/CCCD</label>
                            <Input
                                placeholder="Nhập CMT/CCCD"
                                value={idCardNumber}
                                onChange={(e) => setIdCardNumber(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <label htmlFor="teacherAddress" className="form-label">Địa chỉ</label>
                            <Input
                                placeholder="Nhập địa chỉ"
                                value={teacherAddress}
                                onChange={(e) => setTeacherAddress(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col-md-12 d-flex justify-content-center">
                            <Button type="primary" onClick={handleOk} style={{ width: '120px' }}>
                                Thêm
                            </Button>
                            <Button onClick={handleCancel} style={{ width: '120px', marginLeft: '10px' }}>
                                Hủy
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AddTeacherModal;