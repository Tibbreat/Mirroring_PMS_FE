import React, { useState, useEffect } from 'react';
import { getUserAPI, changeUserStatusAPI } from '../../services/services.user';
import { Spin, Tag, Row, Col, Avatar, Button, Input, Modal, message, Card, Descriptions, Divider, Switch, Pagination, Table } from 'antd';
import { Link, useParams } from 'react-router-dom';
import { ClassTable } from '../../component/table/ClassTable';
import { getClassBaseOnTeacher } from '../../services/services.class';
import { EditOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import moment from 'moment';

const TeacherInformation = () => {
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [fieldValues, setFieldValues] = useState({});
    const { id } = useParams();

    const [classes, setClasses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
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
            setFieldValues(response.data);
        } catch (error) {
            console.error('Error fetching teacher:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeacher(id);
    }, [id]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            await changeUserStatusAPI(teacher.id);
            message.success('Cập nhật trạng thái thành công');
            await fetchTeacher(id);
        } catch (error) {
            console.error('Error changing user status:', error);
        } finally {
            setIsModalVisible(false);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };


    const handleInputChange = (field, value) => {
        setFieldValues({ ...fieldValues, [field]: value });
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
                                <Button type="link" icon={<EditOutlined />} >
                                    Chỉnh sửa thông tin
                                </Button>
                            </Col>
                        </Row>
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="Họ và tên">{teacher?.fullName}</Descriptions.Item>
                            <Descriptions.Item label="Vai trò">Giáo viên</Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Switch checked={teacher.isActive} onClick={showModal} />
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
            <Modal title="Thay đổi trạng thái" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <p>
                    {teacher?.isActive
                        ? 'Bạn có muốn hạn chế tài khoản này?'
                        : 'Bạn có muốn kích hoạt tài khoản này?'}
                </p>
            </Modal>
        </div>
    );
};

export default TeacherInformation;