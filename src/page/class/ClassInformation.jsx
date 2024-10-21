import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Button, Card, Col, DatePicker, Descriptions, Divider, message, Pagination, Row, Select, Spin, Switch, Tag } from 'antd';
import { useParams } from 'react-router-dom';
import { changeClassInformationAPI, changeClassStatusAPI, getClassBaseOnClassId, getTeacherOfClass } from '../../services/services.class';
import moment from 'moment';
import Title from 'antd/es/typography/Title';
import { ChildrenTable } from '../../component/table/ChildrenTable';
import Modal from 'antd/es/modal/Modal';
import { getUserOpnionAPI } from '../../services/services.user';
import { AuthContext } from '../../component/context/auth.context';

const { Option } = Select;

const ClassInformation = () => {
    const [classInfo, setClassInfo] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [allTeachers, setAllTeachers] = useState([]);
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [fieldValues, setFieldValues] = useState({});
    const [children, setChildren] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [total, setTotal] = useState(0);

    const { user } = useContext(AuthContext);

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (field, value) => {
        // Kiểm tra nếu field là teachers, chỉ cho phép tối đa 2 giáo viên
        if (field === 'teachers' && value.length > 2) {
            message.error('Chỉ được chọn tối đa 2 giáo viên.');
            return;
        }
        setFieldValues((prevValues) => ({ ...prevValues, [field]: value }));
    };

    const handleSave = async () => {
        try {
            // Call API to update class info
            await changeClassInformationAPI(id, fieldValues);
            message.success('Cập nhật thông tin lớp thành công');
            setIsEditing(false);
            await fetchClassInfo(id); // Refresh class info
        } catch (error) {
            message.error('Lỗi khi cập nhật thông tin lớp');
        }
    };

    const handleOk = async () => {
        try {
            await changeClassStatusAPI(classInfo.id);
            message.success('Cập nhật trạng thái thành công');
            await fetchClassInfo(id);
        } catch (error) {
            console.error('Error changing user status:', error);
        } finally {
            setIsModalVisible(false);
        }
    };

    const fetchClassInfo = async (id) => {
        setLoading(true);
        try {
            const response = await getClassBaseOnClassId(id);
            const response_2 = await getTeacherOfClass(id);
            setTeachers(response_2.data);
            setClassInfo(response.data);
            setFieldValues({
                openingDay: response.data.openingDay ? moment(response.data.openingDay) : null,
                closingDay: response.data.closingDay ? moment(response.data.closingDay) : null,
                managerId: response.data.manager.id,
                teacherId: response_2.data.map((t) => t.id),
                lastModifyById: user.id,
            });
        } catch (error) {
            console.error('Error fetching class information:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchChildrenList = async (id) => {
        setLoading(true);
        try {
            const response = await getChildrenByClassAPI(id, currentPage);
            setChildren(response.data.listData);
            setTotal(response.data.total);
        } catch (error) {
            console.error('Error fetching children :', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTeachersAndManagers = useCallback(async () => {
        try {
            const teacherResponse = await getUserOpnionAPI('TEACHER');
            const managerResponse = await getUserOpnionAPI('CLASS_MANAGER');
            setAllTeachers(teacherResponse.data);
            setManagers(managerResponse.data);
        } catch (error) {
            message.error('Lỗi khi tải danh sách giáo viên và quản lý');
        }
    }, []);

    useEffect(() => {
        fetchClassInfo(id);
        fetchChildrenList(id);
        fetchTeachersAndManagers();
    }, [id, fetchTeachersAndManagers]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    if (loading) {
        return (
            <div className='d-flex justify-content-center align-items-center' style={{ height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="container">
            <Card style={{ marginTop: 20 }}>
                <Col xs={24}>
                    <Descriptions title="Thông tin lớp" bordered column={2}>
                        <Descriptions.Item label="Lớp">{classInfo?.className}</Descriptions.Item>
                        <Descriptions.Item label="Độ tuổi">{classInfo?.ageRange} tuổi</Descriptions.Item>
                        <Descriptions.Item label="Ngày khai giảng">
                            {isEditing ? (
                                <DatePicker
                                    value={fieldValues.openingDay}
                                    onChange={(date) => handleInputChange('openingDay', date)}
                                />
                            ) : (
                                classInfo?.openingDay ? moment(classInfo.openingDay).format('DD-MM-YYYY') : ''
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày bế giảng">
                            {isEditing ? (
                                <DatePicker
                                    value={fieldValues.closingDay}
                                    onChange={(date) => handleInputChange('closingDay', date)}
                                />
                            ) : (
                                classInfo?.closingDay ? moment(classInfo.closingDay).format('DD-MM-YYYY') : ''
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Giáo viên phụ trách">
                            {isEditing ? (
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    placeholder="Nhập danh sách giáo viên"
                                    maxTagCount={2}
                                    value={fieldValues.teacherId} // Cập nhật giá trị từ state
                                    onChange={(value) => {
                                        if (value.length > 2) {
                                            message.warning('Bạn chỉ có thể chọn tối đa 2 giáo viên'); // Thông báo cho người dùng
                                            value.pop(); // Xóa phần tử cuối nếu số lượng lớn hơn 2
                                        }
                                        handleInputChange('teacherId', value); // Cập nhật giá trị vào state
                                    }}
                                >
                                    {allTeachers.map((teacher) => (
                                        <Select.Option key={teacher.id} value={teacher.id}>
                                            {teacher.username}
                                        </Select.Option>
                                    ))}
                                </Select>

                            ) : (
                                teachers.map((t) => t.username).join(', ')
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Quản lý lớp">
                            {isEditing ? (
                                <Select
                                    value={fieldValues.managerId}
                                    onChange={(value) => handleInputChange('managerId', value)}
                                    style={{ width: '100%' }}
                                >
                                    {managers.map((manager) => (
                                        <Option key={manager.id} value={manager.id}>
                                            {manager.username}
                                        </Option>
                                    ))}
                                </Select>
                            ) : (
                                classInfo?.manager.username
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái" span={3}>
                            <Switch checked={classInfo?.status} onClick={showModal} />
                        </Descriptions.Item>
                    </Descriptions>
                </Col>
                <Divider />
                <Row justify="center">
                    <Button type="primary" onClick={isEditing ? handleSave : handleEditClick}>
                        {isEditing ? 'Lưu' : 'Sửa Thông Tin'}
                    </Button>
                </Row>
                <Col xs={24} sm={16} className='container'>
                    <Title level={4}>Danh sách trẻ</Title>
                </Col>
                <ChildrenTable data={children} />
                <Pagination
                    current={currentPage}
                    total={total}
                    onChange={(page) => setCurrentPage(page)}
                    style={{ textAlign: 'center', marginTop: 20 }}
                />
            </Card>
            <Modal title="Thay đổi trạng thái" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <p>
                    {classInfo?.status
                        ? 'Bạn có muốn hạn chế lớp này?'
                        : 'Bạn có muốn kích hoạt lớp này?'}
                </p>
            </Modal>
        </div>
    );
}

export default ClassInformation;
