import { useCallback, useContext, useEffect, useState } from "react";
import { getUsersAPI, addUserAPI } from "../../services/services.user"; // Make sure addUserAPI is implemented
import { Button, Card, Col, Input, Modal, Row, Select, Spin, Form, message, DatePicker } from "antd";
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
    const [isSubmitting, setIsSubmitting] = useState(false);  // Add new state for submission loading
    const [pageSize] = useState(10);  // Number of staff per page
    const [form] = Form.useForm(); // Initialize the form instance

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
    }, [user.schoolId]);

    useEffect(() => {
        fetchStaff(currentPage);
    }, [currentPage, fetchStaff]);

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();  // Reset form fields when modal is closed
        setImageFile(null);  // Reset image file when modal is closed
        setIsSubmitting(false); // Reset submitting state when modal is closed
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
            dob: dob ? moment(dob).format("YYYY-MM-DD") : null,
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
        <Card style={{ margin: 20 }}>
            {/* ...existing components... */}
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
                            <UploadImage onImageChange={handleImageChange} disabled={isSubmitting} />
                        </Col>
                        <Col span={16}>
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleOk}
                                initialValues={{
                                    dob: moment(),
                                }}
                                disabled={isSubmitting} // Disable the form when loading
                            >
                                <Card title="Thông tin cá nhân" bordered={false}>
                                    <Row gutter={[16, 16]}>
                                        <Col span={8}>
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
                                        <Col span={8}>
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
                                        <Col span={8}>
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
                                        <Col span={12}>
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
                                        <Col span={12}>
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
                                        <Col span={24}>
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
