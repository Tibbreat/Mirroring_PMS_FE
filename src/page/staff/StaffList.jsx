import { useCallback, useContext, useEffect, useState } from "react";
import { getUsersAPI, addUserAPI } from "../../services/services.user"; // Make sure addUserAPI is implemented
import { Button, Card, Col, Input, Modal, Pagination, Row, Select, Spin, DatePicker, Form, message } from "antd";
import StaffTable from "../../component/table/StaffTable";
import NoData from "../../component/no-data-page/NoData";
import UploadImage from "../../component/input/UploadImage";
import moment from "moment"; // Import for handling date formatting
import { AuthContext } from "../../component/context/auth.context";

const { Option } = Select;

export const StaffList = () => {
    const [staff, setStaff] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    const { user } = useContext(AuthContext);
    const fetchStaff = useCallback(async (page) => {
        setLoading(true);
        try {
            const response = await getUsersAPI(user.schoolId, page, ["KITCHEN_MANAGER", "CLASS_MANAGER", "TRANSPORT_MANAGER"], null);
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
    };

    const handleImageChange = (file) => {
        setImageFile(file);
    };

    const handleOk = async (values) => {
        const { fullName, idCardNumber, address, phone, dob, role, schoolId } = values;

        // Create a FormData object to handle multipart form data
        const formData = new FormData();

        // Append user data as JSON
        const userData = {
            fullName,
            idCardNumber,
            address,
            phone,
            role,
            dob: dob ? moment(dob).format("YYYY-MM-DD") : null,
            schoolId: user?.schoolId
        };

        formData.append('user', new Blob([JSON.stringify(userData)], { type: 'application/json' }));

        // Append the image file if it exists
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            // Send the FormData to the API
            await addUserAPI(formData);
            message.success('Nhân viên đã được thêm thành công.');
            setIsModalOpen(false);
            fetchStaff(currentPage); // Refresh the staff list
        } catch (error) {
            message.error('Có lỗi xảy ra khi thêm nhân viên.');
            console.error('Error adding user:', error);
        }
    };


    return (
        <Card style={{ margin: 20 }}>
            <Row gutter={[16, 16]} justify="center" style={{ marginBottom: 20 }}>
                <Col xs={24} sm={8}>
                    <Select placeholder="Chọn vai trò" style={{ width: '100%' }}>
                        <Option value="CLASS_MANAGER">Quản lý lớp</Option>
                        <Option value="KITCHEN_MANAGER">Quản lý bếp</Option>
                        <Option value="TRANSPORT_MANAGER">Quản lý dịch vụ đưa đón</Option>
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
                width={1000}
            >
                <div className="container">
                    <Row gutter={[16, 16]} align="middle">
                        <Col span={8} className="d-flex justify-content-center">
                            <UploadImage onImageChange={handleImageChange} />
                        </Col>
                        <Col span={16}>
                            <Form
                                layout="vertical"
                                onFinish={handleOk}
                            >
                                <Card title="Thông tin cá nhân" bordered={false}>
                                    <Row gutter={[16, 16]}>
                                        <Col span={8}>
                                            <Form.Item
                                                label="Họ và tên"
                                                name="fullName"
                                                rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                                            >
                                                <Input placeholder="Nhập họ và tên" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                label="Số điện thoại"
                                                name="phone"
                                                rules={[{ required: true, pattern: /^\d{10}$/, message: 'Số điện thoại phải gồm 10 chữ số' }]}
                                            >
                                                <Input placeholder="Nhập số điện thoại" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                label="Chức vụ"
                                                name="role"
                                                rules={[{ required: true, message: 'Vui lòng chọn chức vụ' }]}
                                            >
                                                <Select placeholder="Chọn vai trò" style={{ width: '100%' }}>
                                                    <Option value="CLASS_MANAGER">Quản lý lớp</Option>
                                                    <Option value="KITCHEN_MANAGER">Quản lý bếp</Option>
                                                    <Option value="TRANSPORT_MANAGER">Quản lý dịch vụ đưa đón</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Card>

                                {/* Additional Information Section */}
                                <Card title="Thông tin bổ sung" bordered={false} style={{ marginTop: 20 }}>
                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Ngày sinh"
                                                name="dob"
                                                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
                                            >
                                                <DatePicker
                                                    style={{ width: '100%' }}
                                                    format="DD-MM-YYYY"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="CMT/CCCD"
                                                name="idCardNumber"
                                                rules={[{ required: true, pattern: /^\d{12}$/, message: 'CMT/CCCD phải gồm 12 chữ số' }]}
                                            >
                                                <Input placeholder="Nhập CMT/CCCD" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                                        <Col span={24}>
                                            <Form.Item
                                                label="Địa chỉ"
                                                name="address"
                                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                                            >
                                                <Input placeholder="Nhập địa chỉ" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Card>

                                {/* Action Buttons */}
                                <Row justify="center" style={{ marginTop: 30 }}>
                                    <Button type="primary" htmlType="submit" style={{ width: '120px' }}>
                                        Thêm
                                    </Button>
                                    <Button onClick={handleCancel} style={{ width: '120px', marginLeft: '10px' }}>
                                        Hủy
                                    </Button>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </div>
            </Modal>

        </Card>
    );
};

export default StaffList;
