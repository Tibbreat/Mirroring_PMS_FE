import { useCallback, useContext, useEffect, useState } from "react";
import { getUsersAPI, addUserAPI } from "../../services/services.user"; // Make sure addUserAPI is implemented
import { Button, Card, Col, Input, Modal, Row, Select, Spin, Form, message, DatePicker } from "antd";
import StaffTable from "../../component/table/StaffTable";
import NoData from "../../component/no-data-page/NoData";
import UploadImage from "../../component/input/UploadImage";
import dayjs from "dayjs"; // Import for handling date formatting
import { AuthContext } from "../../component/context/auth.context";

const { Option } = Select;

export const StaffList = () => {
    const [staff, setStaff] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);  // New state for submission loading
    const [pageSize] = useState(10);  // Number of staff per page
    const [form] = Form.useForm(); // Initialize the form instance
    const [fullName, setFullName] = useState("");
    const { user } = useContext(AuthContext);
    const [selectedRole, setSelectedRole] = useState([]);
    const fetchStaff = useCallback(
        async (page, fullName, selectedRole = []) => {  // Set default value to empty array
            setLoading(true);
            try {
                const roles = selectedRole.length > 0 ? selectedRole : ["KITCHEN_MANAGER", "CLASS_MANAGER", "TRANSPORT_MANAGER"];
                const response = await getUsersAPI(page, roles, true, fullName);
                setStaff(response.data.listData);
                setTotal(response.data.total);
            } catch (error) {
                console.error('Error fetching staff:', error);
            } finally {
                setLoading(false);
            }
        },
        [user.schoolId]
    );

    // Handle role change and fetch data
    const handleRoleChange = (value) => {
        setSelectedRole([value]); // Update selected role
        fetchStaff(currentPage, fullName, [value]); // Pass selected role to fetchStaff
    };
    useEffect(() => {
        fetchStaff(currentPage);
    }, [currentPage, fetchStaff]);

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();  // Reset form fields when modal is closed
        setImageFile(null);  // Reset image file when modal is closed
        setIsSubmitting(false); // Reset submitting state when modal is closed
    };
    const handleChangeName = (event) => {
        const value = event.target.value;
        setFullName(value);
        fetchStaff(currentPage, value, selectedRole || []); // Default to empty array if selectedRole is undefined
    };
    const handleImageChange = (file) => {
        setImageFile(file);
    };

    const handleOk = async (values) => {
        setIsSubmitting(true);  // Set loading state to true on submit
        const { fullName, idCardNumber, address, phone, dob, role } = values;

        const formData = new FormData();

        const userData = {
            fullName,
            idCardNumber,
            address,
            phone,
            role,
            dob: dob ? dayjs(dob).format("YYYY-MM-DD") : null,
            schoolId: user?.schoolId
        };

        formData.append('user', new Blob([JSON.stringify(userData)], { type: 'application/json' }));

        if (!imageFile) {
            message.error("Vui lòng cung cấp ảnh thẻ");
            setIsSubmitting(false);  // Stop loading if there's an error
        } else {
            formData.append('image', imageFile);
            try {
                await addUserAPI(formData);
                message.success('Nhân viên đã được thêm thành công.');
                form.resetFields();
                setImageFile(null);
                setIsModalOpen(false);
                fetchStaff(currentPage);
            } catch (error) {
                message.error('Có lỗi xảy ra khi thêm nhân viên.');
                console.error('Error adding user:', error);
            } finally {
                setIsSubmitting(false);  // Stop loading once done
            }
        }
    };

    return (
        <Card className="m-2">
            <Row gutter={[16, 16]} justify="center" style={{ marginBottom: 20 }}>
                <Col xs={24} sm={8}>
                    <Select
                        placeholder="Chọn vai trò"
                        style={{ width: '100%' }}
                        onChange={handleRoleChange}
                        allowClear
                        value={selectedRole[0] || null}
                    >
                        <Option value="CLASS_MANAGER">Quản lý lớp</Option>
                        <Option value="KITCHEN_MANAGER">Quản lý bếp</Option>
                        <Option value="TRANSPORT_MANAGER">Quản lý dịch vụ đưa đón</Option>
                    </Select>
                </Col>
                <Col xs={24} sm={16}>
                    <Input
                        placeholder="Nhập tên nhân viên cần tìm"
                        onChange={handleChangeName}
                        value={fullName}
                    />
                </Col>
            </Row>
            {(user.role === "ADMIN") && (
                <Col span={24} style={{ marginBottom: 20, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="primary" onClick={() => setIsModalOpen(true)}>Thêm quản lý</Button>
                </Col>
            )}
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <Spin size="large" />
                </div>
            ) : staff.length > 0 ? (
                <>
                    <StaffTable
                        data={staff}
                        currentPage={currentPage}
                        pageSize={pageSize}
                        total={total}
                        onPageChange={(page) => setCurrentPage(page)}
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
                        <Col xs={24} md={8} className="d-flex justify-content-center">
                            <UploadImage onImageChange={handleImageChange} disabled={isSubmitting} />
                        </Col>
                        <Col xs={24} md={16}>
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleOk}
                                initialValues={{
                                    dob: dayjs(),
                                }}
                                disabled={isSubmitting}
                            >
                                <Card title="Thông tin cá nhân" bordered={false}>
                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} md={12} lg={8}>
                                            <Form.Item
                                                label="Họ và tên"
                                                name="fullName"
                                                rules={[
                                                    { required: true, message: 'Vui lòng nhập họ và tên' },
                                                    { pattern: /^[a-zA-ZÀ-ỹ\s]{2,50}$/, message: 'Họ và tên chỉ được chứa chữ cái và khoảng trắng, từ 2 đến 50 ký tự.' }
                                                ]}
                                            >
                                                <Input placeholder="Nhập họ và tên" disabled={isSubmitting} />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12} lg={8}>
                                            <Form.Item
                                                label="Số điện thoại"
                                                name="phone"
                                                rules={[
                                                    { required: true, message: 'Vui lòng nhập số điện thoại' },
                                                    { pattern: /^(\+84|0)?[3|5|7|8|9]\d{8}$/, message: 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng +84, 03, 05, 07, 08, 09.' }
                                                ]}
                                            >
                                                <Input placeholder="Nhập số điện thoại" disabled={isSubmitting} />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12} lg={8}>
                                            <Form.Item
                                                label="Chức vụ"
                                                name="role"
                                                rules={[{ required: true, message: 'Vui lòng chọn chức vụ' }]}
                                            >
                                                <Select placeholder="Chọn vai trò" style={{ width: '100%' }} disabled={isSubmitting}>
                                                    <Option value="CLASS_MANAGER">Quản lý lớp</Option>
                                                    <Option value="KITCHEN_MANAGER">Quản lý bếp</Option>
                                                    <Option value="TRANSPORT_MANAGER">Quản lý dịch vụ đưa đón</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Card>
                                {/* Additional Information */}
                                <Card title="Thông tin bổ sung" bordered={false} style={{ marginTop: 20 }}>
                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Ngày sinh"
                                                name="dob"
                                                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
                                            >
                                                <DatePicker
                                                    style={{ width: '100%' }}
                                                    format="DD-MM-YYYY"
                                                    disabled={isSubmitting}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="CMT/CCCD"
                                                name="idCardNumber"
                                                rules={[
                                                    { required: true, message: 'Vui lòng nhập CMT/CCCD' },
                                                    { pattern: /^\d{12}$/, message: 'CMT/CCCD phải gồm 12 chữ số.' }
                                                ]}
                                            >
                                                <Input placeholder="Nhập CMT/CCCD" disabled={isSubmitting} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                                        <Col xs={24}>
                                            <Form.Item
                                                label="Địa chỉ"
                                                name="address"
                                                rules={[
                                                    { required: true, message: 'Vui lòng nhập địa chỉ' },
                                                    { pattern: /^[a-zA-Z0-9À-ỹ\s,.-]{5,100}$/, message: 'Địa chỉ phải có từ 5 đến 100 ký tự và chỉ bao gồm chữ cái, số, và các dấu phẩy, dấu chấm, gạch ngang.' }
                                                ]}
                                            >
                                                <Input placeholder="Nhập địa chỉ" disabled={isSubmitting} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Card>
                                <Row justify="center" style={{ marginTop: 30 }}>
                                    <Button type="primary" htmlType="submit" style={{ width: '120px' }} loading={isSubmitting}>
                                        Thêm
                                    </Button>
                                    <Button onClick={handleCancel} style={{ width: '120px', marginLeft: '10px' }} disabled={isSubmitting}>
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