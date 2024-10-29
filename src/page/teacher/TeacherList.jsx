import { useCallback, useContext, useEffect, useState } from "react";
import { getUsersAPI, addUserAPI } from "../../services/services.user"; // Ensure addUserAPI is implemented
import { Button, Card, Col, Input, Modal, Pagination, Row, Select, Spin, DatePicker, Form, message } from "antd";
import TeacherTable from "../../component/table/TeacherTable";
import NoData from "../../component/no-data-page/NoData";
import UploadImage from "../../component/input/UploadImage";
import moment from "moment";
import { AuthContext } from "../../component/context/auth.context";

const { Option } = Select;

const TeacherList = () => {
    const [teachers, setTeachers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [form] = Form.useForm(); // Initialize the form instance

    const { user } = useContext(AuthContext);

    const fetchTeachers = useCallback(async (page) => {
        setLoading(true);
        try {
            const response = await getUsersAPI(user.schoolId, page, ["TEACHER"], null);
            setTeachers(response.data.listData);
            setTotal(response.data.total);
        } catch (error) {
            console.error("Error fetching teachers:", error);
        } finally {
            setLoading(false);
        }
    }, [user.schoolId]);

    useEffect(() => {
        fetchTeachers(currentPage);
    }, [currentPage, fetchTeachers]);

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();  // Reset form fields when modal is closed
        setImageFile(null);  // Reset image file when modal is closed
    };

    const handleImageChange = (file) => {
        setImageFile(file);
    };

    const handleOk = async (values) => {
        const { fullName, idCardNumber, address, phone, dob , contractType} = values;

        // Create a FormData object to handle multipart form data
        const formData = new FormData();
        const teacherData = {
            fullName,
            idCardNumber,
            address,
            phone,
            dob: dob ? moment(dob).format("YYYY-MM-DD") : null,
            role: "TEACHER",
            schoolId: user?.schoolId,
            contractType: values.contractType
        };

        formData.append('user', new Blob([JSON.stringify(teacherData)], { type: 'application/json' }));
        if (!imageFile) {
            message.error("Vui lòng cung cấp ảnh thẻ");
        } else {
            formData.append('image', imageFile);
            try {
                await addUserAPI(formData);
                message.success('Giáo viên đã được thêm thành công.');

                // Reset the form fields
                form.resetFields();
                setImageFile(null);  // Reset the image file

                setIsModalOpen(false);
                fetchTeachers(currentPage); // Refresh the teacher list
            } catch (error) {
                message.error('Có lỗi xảy ra khi thêm giáo viên.');
                console.error('Error adding teacher:', error);
            }
        }
    };

    return (
        <Card style={{ margin: 20 }}>
            <Row gutter={[16, 16]} justify="center" style={{ marginBottom: 20 }}>
                <Col xs={24} sm={8}>
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
                                form={form}  // Bind form instance to the form
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

                                    </Row>
                                </Card>


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
                                        <Col span={24}>
                                            <Form.Item
                                                label="Loại hợp đồng"
                                                name="contractType"
                                                rules={[{ required: true, message: 'Vui chọn loại hợp đồng' }]}
                                            >
                                                <Select placeholder="Loại hợp đồng">
                                                    <Option value="Hợp đồng lao động có thời hạn 6 tháng">Hợp đồng lao động có thời hạn 6 tháng</Option>
                                                    <Option value="Hợp đồng lao động có thời hạn 1 năm">Hợp đồng lao động có thời hạn 1 năm</Option>
                                                    <Option value="Hợp đồng lao động không xác định thời hạn">Hợp đồng lao động không xác định thời hạn</Option>
                                                    <Option value="Hợp đồng thời vụ">Hợp đồng thời vụ</Option>
                                                </Select>
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

export default TeacherList;
