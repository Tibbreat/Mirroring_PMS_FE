import { useCallback, useState, useEffect } from "react";
import NoData from "../../component/no-data-page/NoData";
import TeacherTable from "../../component/table/TeacherTable";
import { getUsersAPI, addUserAPI } from "../../services/services.user";
import { Pagination, Spin, Card, Row, Col, Input, Select, Button, Modal, DatePicker, notification } from "antd";
import UploadImage from "../../component/input/UploadImage";

const { Option } = Select;

const TeacherList = () => {
    const [teachers, setTeachers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const handleCancel = () => {
        setIsModalOpen(false);
        setTeacherName('');
        setTeacherPhone('');
        setTeacherDob(null);
        setIdCardNumber('');
        setTeacherAddress('');
        setImageFile(null);
    };

    const handleImageChange = (file) => {
        setImageFile(file);
    };

    const fetchTeachers = useCallback(async (page) => {
        setLoading(true);
        try {
            const response = await getUsersAPI(page, ["TEACHER"], null);
            setTeachers(response.data.listData)
            setTotal(response.data.total);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTeachers(currentPage);
    }, [currentPage, fetchTeachers]);

    return (
        <Card style={{ margin: 20 }}>
            <Row gutter={[16, 16]} justify="center" style={{ marginBottom: 20 }}>
                <Col xs={24} sm={16}>
                    <Input.Search
                        placeholder="Nhập tên giáo viên cần tìm"
                        enterButton
                        onSearch={(value) => console.log(value)}
                    />
                </Col>
            </Row>
            <Col span={24} style={{ marginBottom: 20, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" onClick={() => setIsModalOpen(true)}>Thêm giáo viên</Button>
            </Col>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <Spin size="large" />
                </div>
            ) : teachers.length > 0 ? (
                <>

                    <TeacherTable data={teachers} />
                    <Pagination
                        current={currentPage}
                        total={total}
                        onChange={(page) => setCurrentPage(page)}
                        style={{ textAlign: 'center', marginTop: 20 }}
                    />
                </>
            ) : (
                <div className="d-flex justify-content-center align-items-center">
                    <NoData
                        title={"Không có giáo viên nào"}
                        subTitle={"Danh sách giáo viên sẽ xuất hiện khi bạn thêm dữ liệu vào hệ thống"}
                    />
                </div>
            )}
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
        </Card>
    );
};

export default TeacherList;