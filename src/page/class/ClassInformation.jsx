import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Button, Card, Col, DatePicker, Descriptions, Divider, message, Pagination, Row, Select, Spin, Switch, Tag } from 'antd';
import { useParams } from 'react-router-dom';
import { changeClassStatusAPI, getClassBaseOnClassId, getTeacherOfClass } from '../../services/services.class';
import moment from 'moment';
import Title from 'antd/es/typography/Title';
import { ChildrenTable } from '../../component/table/ChildrenTable';
import Modal from 'antd/es/modal/Modal';
import { getUserOpnionAPI } from '../../services/services.user';
import { AuthContext } from '../../component/context/auth.context';

const ClassInformation = () => {
    const [classInfo, setClassInfo] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [allTeachers, setAllTeachers] = useState([]);
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [children, setChildren] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [total, setTotal] = useState(0);

    const { user } = useContext(AuthContext);

    const handleCancel = () => {
        setIsModalVisible(false);
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
                        <Descriptions.Item label="Độ tuổi">{classInfo?.ageRange}</Descriptions.Item>
                        <Descriptions.Item label="Năm học">
                            {classInfo?.academicYear}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày khai giảng">
                            {classInfo?.openingDay ? moment(classInfo.openingDay).format('DD-MM-YYYY') : ''}
                        </Descriptions.Item>

                        <Descriptions.Item label="Giáo viên phụ trách">
                            {teachers.map((t) => t.username).join(', ')}
                        </Descriptions.Item>
                        <Descriptions.Item label="Quản lý lớp">
                            {classInfo?.manager.username}
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái" span={3}>
                            <Switch checked={classInfo?.status} onClick={showModal} />
                        </Descriptions.Item>
                    </Descriptions>
                </Col>
                <Divider />
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
