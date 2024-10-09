import { useCallback, useEffect, useState } from "react";
import { getUsersAPI } from "../../services/services.user";
import { Button, Card, Col, Input, Modal, Pagination, Row, Select, Spin, DatePicker } from "antd";
import StaffTable from "../../component/table/StaffTable";
import NoData from "../../component/no-data-page/NoData";
import UploadImage from "../../component/input/UploadImage";

const { Option } = Select;

export const StaffList = () => {
    const [staff, setStaff] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [staffName, setStaffName] = useState('');
    const [staffPhone, setStaffPhone] = useState('');
    const [staffDob, setStaffDob] = useState(null);
    const [idCardNumber, setIdCardNumber] = useState('');
    const [staffAddress, setStaffAddress] = useState('');

    const fetchStaff = useCallback(async (page) => {
        setLoading(true);
        try {
            const response = await getUsersAPI(page, ["KITCHEN_MANAGER", "CLASS_MANAGER", "TRANSPORT_MANAGER"], null);
            setStaff(response.data.listData);
            setTotal(response.data.total);
        } catch (error) {
            console.error('Error fetching staffs:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStaff(currentPage);
    }, [currentPage, fetchStaff]);

    const handleCancel = () => {
        setIsModalOpen(false);
        setStaffName('');
        setStaffPhone('');
        setStaffDob(null);
        setIdCardNumber('');
        setStaffAddress('');
        setImageFile(null);
    };

    const handleImageChange = (file) => {
        setImageFile(file);
    };

    const handleOk = () => {
        // Add your logic to handle form submission here
        console.log({
            staffName,
            staffPhone,
            staffDob,
            idCardNumber,
            staffAddress,
            imageFile
        });
        handleCancel();
    };

    return (
        <Card style={{ margin: 20 }}>
            <Row gutter={[16, 16]} justify="center" style={{ marginBottom: 20 }}>
                <Col xs={24} sm={8}>
                    <Select defaultValue="option 1" style={{ width: '100%' }}>
                        <Option value="option 1">Option 1</Option>
                        <Option value="option 2">Option 2</Option>
                    </Select>
                </Col>
                <Col xs={24} sm={16}>
                    <Input.Search
                        placeholder="Nhập tên nhân viên cần tìm"
                        enterButton
                        onSearch={(value) => console.log(value)}
                    />
                </Col>
            </Row>
            <Col span={24} style={{ marginBottom: 20, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" onClick={() => setIsModalOpen(true)}>Thêm quản lý</Button>
            </Col>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <Spin size="large" />
                </div>
            ) : staff.length > 0 ? (
                <>
                    <StaffTable data={staff} />
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
                        title={"Không có nhân viên nào"}
                        subTitle={"Danh sách nhân viên sẽ xuất hiện khi bạn thêm dữ liệu vào hệ thống"}
                    />
                </div>
            )}
            <Modal
                title="Thêm nhân viên"
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
                                <label htmlFor="staffName" className="form-label">Tên nhân viên</label>
                                <Input
                                    placeholder="Nhập tên nhân viên"
                                    value={staffName}
                                    onChange={(e) => setStaffName(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="staffPhone" className="form-label">Số điện thoại</label>
                                <Input
                                    placeholder="Nhập số điện thoại"
                                    value={staffPhone}
                                    onChange={(e) => setStaffPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="staffDob" className="form-label">Ngày sinh</label>
                                <DatePicker
                                    style={{ width: '100%' }}
                                    value={staffDob}
                                    onChange={(date) => setStaffDob(date)}
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
                                <label htmlFor="staffAddress" className="form-label">Địa chỉ</label>
                                <Input
                                    placeholder="Nhập địa chỉ"
                                    value={staffAddress}
                                    onChange={(e) => setStaffAddress(e.target.value)}
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

export default StaffList;