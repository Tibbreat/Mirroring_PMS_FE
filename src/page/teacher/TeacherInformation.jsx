import React, { useState, useEffect } from 'react';
import { getUserAPI, changeUserStatusAPI, changeUserDescription } from '../../services/services.user';
import { Spin, Tag, Row, Col, Avatar, Button, Input, Modal, message, Card, Descriptions, Divider, Switch, Pagination, Table, Form, Select } from 'antd';
import { Link, useParams } from 'react-router-dom';
import { getClassBaseOnTeacher } from '../../services/services.class';
import { EditOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import moment from 'moment';
import UploadImage from '../../component/input/UploadImage';

const { Option } = Select;

const TeacherInformation = () => {
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const { id } = useParams();
    const [imageFile, setImageFile] = useState(null);
    const [classes, setClasses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [form] = Form.useForm();

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
            title: 'Quản lý',
            dataIndex: 'managerName',
            key: 'managerName',
            render: (text, record) => (
                record.manager && record.manager.username ? record.manager.username : 'Chưa có quản lý'
            )
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

    const fetchTeacher = async (id) => {
        setLoading(true);
        try {
            const response = await getUserAPI(id);
            const response_2 = await getClassBaseOnTeacher(id, currentPage);
            setClasses(response_2.data.listData);
            setTotal(response_2.data.total);
            setTeacher(response.data);
            form.setFieldsValue(response.data); // Set giá trị mặc định trong form từ dữ liệu giáo viên
        } catch (error) {
            console.error('Error fetching teacher:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeacher(id);
    }, [id]);

    const showModalChangeStatus = () => {
        const contentMessage = teacher?.isActive
            ? "Bạn có chắc chắn muốn ngừng hoạt động của nhân viên này? Nếu đồng ý, nhân viên sẽ bị hạn chế truy cập vào hệ thống."
            : "Bạn có chắc chắn muốn kích hoạt tài khoản của nhân viên này?";
    
        Modal.confirm({
            title: 'Xác nhận thay đổi trạng thái',
            content: contentMessage,
            onOk: async () => {
                try {
                    await changeUserStatusAPI(teacher.id);
                    message.success('Cập nhật trạng thái thành công');
    
                    // Cập nhật lại thông tin nhân viên
                    await fetchTeacher(id);
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

    const showEditModal = () => {
        setIsEditModalVisible(true);
    };

    const handleImageChange = (file) => {
        setImageFile(file);
    };
    const handleEditOk = async () => {
        try {
            const values = await form.validateFields();
            const teacherData = {
                ...values,
                role: "TEACHER",
                dob: values.dob ? moment(values.dob).format("YYYY-MM-DD") : null,
            };

            const formData = new FormData();
            formData.append('user', new Blob([JSON.stringify(teacherData)], { type: 'application/json' }));


            formData.append('image', imageFile);

            await changeUserDescription(id, formData);
            message.success('Cập nhật thông tin giáo viên thành công');
            await fetchTeacher(id);
        } catch (error) {
            console.error('Error updating teacher information:', error);
            message.error('Có lỗi xảy ra khi cập nhật giáo viên');
        } finally {
            setIsEditModalVisible(false);
            setImageFile(null); // Xóa ảnh sau khi cập nhật
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
    };

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
                        <Avatar size={128} src={teacher?.imageLink || "/image/5856.jpg"} />
                        <Tag className='mt-2' color={teacher.isActive ? 'green' : 'red'}>
                            {teacher.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                        </Tag>
                    </Col>

                    <Col xs={24} sm={16}>
                        <Row justify="space-between" className='mb-3'>
                            <Col>
                                <Title level={5}>Thông tin giáo viên</Title>
                            </Col>
                            <Col>
                                <Button type="link" icon={<EditOutlined />} onClick={showEditModal}>
                                    Chỉnh sửa thông tin
                                </Button>
                            </Col>
                        </Row>
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="Họ và tên">{teacher?.fullName}</Descriptions.Item>
                            <Descriptions.Item label="Vai trò">Giáo viên</Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Switch checked={teacher.isActive} onClick={showModalChangeStatus} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Mã nhân viên">{teacher?.id}</Descriptions.Item>
                            <Descriptions.Item label="Account">{teacher?.username}</Descriptions.Item>
                            <Descriptions.Item label="E-mail">{teacher?.email}</Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại">{teacher?.phone}</Descriptions.Item>
                            <Descriptions.Item label="CCCD/CMT">{teacher?.idCardNumber}</Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ" span={2}>{teacher?.address}</Descriptions.Item>
                            <Descriptions.Item label="Hợp đồng" span={2}>{teacher?.contractType}</Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
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
            </Card>


            <Modal
                title="Chỉnh sửa thông tin giáo viên"
                open={isEditModalVisible}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
                okText="Lưu"
                cancelText="Hủy"
                width={1000}  // Đặt chiều rộng rộng hơn để có không gian cho layout
            >
                <div className="container">
                    <Row gutter={[16, 16]} align="middle">
                        {/* Phần UploadImage ở bên trái */}
                        <Col span={8} className="d-flex flex-column align-items-center justify-content-center">
                            {/* Hiển thị ảnh đại diện */}
                            <Avatar size={128} src={teacher?.imageLink || "/image/5856.jpg"} style={{ marginBottom: '16px' }} />
                            {/* Component UploadImage để tải lên ảnh mới */}
                            <UploadImage onImageChange={handleImageChange} />
                        </Col>

                        {/* Phần Form ở bên phải */}
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
                            </Form>
                        </Col>
                    </Row>
                </div>
            </Modal>
        </div>
    );
};

export default TeacherInformation;
