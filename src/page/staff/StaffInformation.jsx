import React, { useState, useEffect } from 'react';
import { getUserAPI, changeUserStatusAPI, changeUserDescription } from '../../services/services.user';
import { Spin, Tag, Row, Col, Avatar, Button, Input, Modal, message, Card, Descriptions, Divider, Switch, Pagination, Table, Form, Select } from 'antd';
import { Link, useParams } from 'react-router-dom';
import Title from 'antd/es/typography/Title';
import moment from 'moment';
import UploadImage from '../../component/input/UploadImage';
import { EditOutlined } from '@ant-design/icons';

const { Option } = Select;

const StaffInformation = () => {
    const [staff, setStaff] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [classes, setClasses] = useState([]);
    const [total, setTotal] = useState(0);
    const [form] = Form.useForm();
    const { id } = useParams();

    const fetchStaff = async (id) => {
        setLoading(true);
        try {
            const response = await getUserAPI(id);
            setStaff(response.data);
            form.setFieldsValue(response.data);  // Set giá trị mặc định từ dữ liệu staff
            // Giả sử hàm API này lấy danh sách lớp của nhân viên
            const response_2 = await getClassListBaseOnManagerId(id, currentPage);
            setClasses(response_2.data.listData);
            setTotal(response_2.data.total);
        } catch (error) {
            console.error('Error fetching staff:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff(id);
    }, [id, currentPage]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const showEditModal = () => {
        setIsEditModalVisible(true);
    };

    const handleImageChange = (file) => {
        setImageFile(file);
    };

    const handleEditOk = async () => {
        try {
            const values = await form.validateFields();
            const staffData = {
                ...values,
                dob: values.dob ? moment(values.dob).format("YYYY-MM-DD") : null,
            };

            const formData = new FormData();
            formData.append('user', new Blob([JSON.stringify(staffData)], { type: 'application/json' }));
            if (imageFile) {
                formData.append('image', imageFile);
            }

            await changeUserDescription(id, formData);
            message.success('Cập nhật thông tin nhân viên thành công');
            await fetchStaff(id);
        } catch (error) {
            console.error('Error updating staff information:', error);
            message.error('Có lỗi xảy ra khi cập nhật nhân viên');
        } finally {
            setIsEditModalVisible(false);
            setImageFile(null);
        }
    };

    const handleOk = async () => {
        try {
            await changeUserStatusAPI(staff.id);
            message.success('Cập nhật trạng thái thành công');
            await fetchStaff(id);
        } catch (error) {
            console.error('Error changing user status:', error);
        } finally {
            setIsModalVisible(false);
        }
    };
    
    const showModalChangeStatus = () => {
        const contentMessage = staff?.isActive
            ? "Bạn có chắc chắn muốn ngừng hoạt động của nhân viên này? Nếu đồng ý, nhân viên sẽ bị hạn chế truy cập vào hệ thống."
            : "Bạn có chắc chắn muốn kích hoạt tài khoản của nhân viên này?";
    
        Modal.confirm({
            title: 'Xác nhận thay đổi trạng thái',
            content: contentMessage,
            onOk: async () => {
                try {
                    await changeUserStatusAPI(staff.id);
                    message.success('Cập nhật trạng thái thành công');
    
                    // Cập nhật lại thông tin nhân viên
                    await fetchStaff(id);
                } catch (error) {
                    console.error('Error changing user status:', error);
                    message.error('Có lỗi xảy ra khi cập nhật trạng thái.');
                }
            },
            onCancel() {
                console.log('Hủy thay đổi trạng thái');
            },
        });
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
    };

    const columns = [
        {
            title: 'Tên lớp',
            dataIndex: 'className',
            key: 'className',
            render: (text, record) => (
                <Link to={`/pms/manage/class/${record.id}`} style={{ textDecoration: "none" }}>
                    {text}
                </Link>
            ),
        },
        {
            title: 'Độ tuổi',
            dataIndex: 'ageRange',
            key: 'ageRange',
            render: (text) => `${text} tuổi`,
        },
        {
            title: 'Sĩ số lớp',
            dataIndex: 'totalStudent',
            key: 'totalStudent',
        },
        {
            title: 'Năm học',
            dataIndex: 'academicYear',
            key: 'academicYear',
        },
        {
            title: 'Ngày khai giảng',
            dataIndex: 'openingDay',
            key: 'openingDay',
            render: (text) => {
                return text ? moment(text).format('DD-MM-YYYY') : '';
            },
        }
    ];

    if (loading) {
        return (
            <div className='d-flex justify-content-center align-items-center' style={{ height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className='container'>
            <Card style={{ marginTop: 20 }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={8} className='d-flex flex-column align-items-center justify-content-center'>
                        <Avatar size={128} src={staff?.imageLink || "/image/5856.jpg"} />
                        <Tag className='mt-2' color={staff.isActive ? 'green' : 'red'}>
                            {staff.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                        </Tag>
                    </Col>
                    <Col xs={24} sm={16}>
                        <Row justify="space-between" className='mb-3'>
                            <Col>
                                <Title level={5}>Thông tin nhân viên</Title>
                            </Col>
                            <Col>
                                <Button type="link" icon={<EditOutlined />} onClick={showEditModal}>
                                    Chỉnh sửa thông tin
                                </Button>
                            </Col>
                        </Row>
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="Họ và tên">{staff?.fullName}</Descriptions.Item>
                            <Descriptions.Item label="Vai trò">
                                {staff?.role === 'CLASS_MANAGER' && 'Quản lý lớp'}
                                {staff?.role === 'KITCHEN_MANAGER' && 'Quản lý bếp'}
                                {staff?.role === 'TRANSPORT_MANAGER' && 'Quản lý dịch vụ vận chuyển'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Switch checked={staff.isActive} onClick={showModalChangeStatus} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Mã nhân viên">{staff?.id}</Descriptions.Item>
                            <Descriptions.Item label="Account">{staff?.username}</Descriptions.Item>
                            <Descriptions.Item label="E-mail">{staff?.email}</Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại">{staff?.phone}</Descriptions.Item>
                            <Descriptions.Item label="CCCD/CMT">{staff?.idCardNumber}</Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ" span={2}>{staff?.address}</Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>

                {staff.role === "CLASS_MANAGER" && (
                    <>
                        <Divider />
                        <Col xs={24} sm={16} className='container'>
                            <Title level={4}>Danh sách lớp phụ trách</Title>
                        </Col>
                        <Table
                            dataSource={classes}
                            columns={columns}
                            pagination={false}
                            rowKey={(record) => record.id}
                        />
                        <Pagination
                            current={currentPage}
                            total={total}
                            onChange={(page) => setCurrentPage(page)}
                            style={{ textAlign: 'center', marginTop: 20 }}
                        />
                    </>
                )}
            </Card>

            <Modal
                title="Chỉnh sửa thông tin nhân viên"
                open={isEditModalVisible}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
                okText="Lưu"
                cancelText="Hủy"
                width={1000}  // Chiều rộng cho modal lớn hơn để có không gian
            >
                <div className="container">
                    <Row gutter={[16, 16]} align="middle">
                        {/* Phần UploadImage bên trái */}
                        <Col span={8} className="d-flex flex-column align-items-center justify-content-center">
                            <Avatar size={128} src={staff?.imageLink || "/image/5856.jpg"} style={{ marginBottom: '16px' }} />
                            <UploadImage onImageChange={handleImageChange} />
                        </Col>

                        {/* Form chỉnh sửa bên phải */}
                        <Col span={16}>
                            <Form form={form} layout="vertical">
                                <Card title="Thông tin cá nhân" bordered={false}>
                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Họ và tên"
                                                name="fullName"
                                                rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                                            >
                                                <Input placeholder="Nhập họ và tên" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Số điện thoại"
                                                name="phone"
                                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                                            >
                                                <Input placeholder="Nhập số điện thoại" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="CMT/CCCD"
                                                name="idCardNumber"
                                                rules={[{ required: true, message: 'Vui lòng nhập số CCCD' }]}
                                            >
                                                <Input placeholder="Nhập số CCCD" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Card>

                                <Card title="Thông tin bổ sung" bordered={false} style={{ marginTop: 20 }}>
                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Địa chỉ"
                                                name="address"
                                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                                            >
                                                <Input placeholder="Nhập địa chỉ" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Chức vụ"
                                                name="role"
                                                rules={[{ required: true, message: 'Vui lòng chọn chức vụ' }]}
                                            >
                                                <Select placeholder="Chọn vai trò">
                                                    <Option value="CLASS_MANAGER">Quản lý lớp</Option>
                                                    <Option value="KITCHEN_MANAGER">Quản lý bếp</Option>
                                                    <Option value="TRANSPORT_MANAGER">Quản lý dịch vụ đưa đón</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Card>
                            </Form>
                        </Col>
                    </Row>
                </div>
            </Modal>
        </div>
    );
};

export default StaffInformation;

