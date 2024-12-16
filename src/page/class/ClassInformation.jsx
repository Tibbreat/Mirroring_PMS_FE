import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Button, Card, Col, Descriptions, Divider, Form, Input, message, Row, Select } from 'antd';
import { useParams } from 'react-router-dom';
import { changeClassStatusAPI, getClassBaseOnClassId, getTeacherOfClass } from '../../services/services.class';
import moment from 'moment';
import Title from 'antd/es/typography/Title';
import Modal from 'antd/es/modal/Modal';
import { getTeacherAvailableInYear, getUserOpnionAPI } from '../../services/services.user';
import { EditOutlined } from '@ant-design/icons';
import { ChildrenOfClassTable } from '../../component/table/ChildrenOfClassTable';
import StatusDescription from '../../component/utils/StatusDescription';
import Loading from '../common/Loading';
import dayjs from 'dayjs';
import { AuthContext } from '../../component/context/auth.context';

const ClassInformation = () => {
    const [classInfo, setClassInfo] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [allTeachers, setAllTeachers] = useState([]);
    const [managers, setManagers] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [form] = Form.useForm();
    const { user } = useContext(AuthContext);

    const fetchClassInfo = useCallback(async () => {
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
    }, [id]);

    const fetchTeachersAndManagers = useCallback(async () => {
        try {
            const currentYear = dayjs().year();
            const nextYear = currentYear + 1;
            const academicYear = `${currentYear}-${nextYear}`;
            const teacherResponse = await getTeacherAvailableInYear(academicYear);;
            const managerResponse = await getUserOpnionAPI('CLASS_MANAGER');
            setAllTeachers(teacherResponse.data);
            setManagers(managerResponse.data);
        } catch (error) {
            message.error('Lỗi khi tải danh sách giáo viên và quản lý');
        }
    }, []);

    useEffect(() => {
        fetchClassInfo();
    }, []);

    if (loading) {
        return (
            <Loading />
        );
    }

    const openModal = () => {
        setModalVisible(true);
        fetchTeachersAndManagers();
    };
    const changeClassStatus = () => {
        Modal.confirm({
            title: 'Xác nhận kết thúc lớp',
            content: (
                <>
                    Bạn có chắc chắn muốn kết thúc quá trình học của lớp này? <br />
                    Không thể mở lại lớp này sau khi kết thúc. <br />
                    Mọi thông tin liên quan đến lớp sẽ không thể chỉnh sửa sau khi kết thúc.
                </>
            ),
            onOk: async () => {
                try {
                    await changeClassStatusAPI(id);
                    message.success('Kết thúc lớp thành công');
                    fetchClassInfo();
                } catch (error) {
                    console.error('Error changing class status:', error);
                    message.error('Lỗi khi kết thúc lớp');
                }
            },
        });
    };
    return (
        <div className="container">
            <Card style={{ marginTop: 20 }}>
                <Col xs={24}>
                    <Row justify="space-between" className='mb-3'>
                        <Col>
                            <Title level={5}>Thông tin lớp</Title>
                        </Col>
                        <Col>
                            {classInfo?.status === 'NOT_STARTED' && (
                                <Button type="link" icon={<EditOutlined />} onClick={() => { openModal() }}>
                                    Chỉnh sửa thông tin
                                </Button>
                            )}
                            {/* {classInfo?.status === 'IN_PROGRESS' && (user?.role === 'ADMIN' || user?.role === 'CLASS_MANAGER') && (
                                <Button type="default"
                                    style={{
                                        backgroundColor: '#f5222d',
                                        color: 'white',
                                    }}
                                    onClick={() => { changeClassStatus() }}>
                                    Kết thúc lớp
                                </Button>
                            )} */}
                        </Col>
                    </Row>
                    <Descriptions bordered column={2}>
                        <Descriptions.Item label="Lớp">{classInfo?.className}</Descriptions.Item>
                        <Descriptions.Item label="Độ tuổi">{classInfo?.ageRange}</Descriptions.Item>
                        <Descriptions.Item label="Năm học">{classInfo?.academicYear}</Descriptions.Item>
                        <Descriptions.Item label="Ngày khai giảng">
                            {classInfo?.openingDay ? moment(classInfo.openingDay).format('DD-MM-YYYY') : ''}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số trẻ đăng ký bán trú">{classInfo?.countChildrenRegisteredOnBoarding}</Descriptions.Item>
                        <Descriptions.Item label="Số trẻ đăng ký đưa đón">{classInfo?.countChildrenRegisteredTransport}</Descriptions.Item>
                        <Descriptions.Item label="Giáo viên phụ trách">
                            {teachers.map((t) => t.username).join(', ')}
                        </Descriptions.Item>
                        <Descriptions.Item label="Quản lý lớp">{classInfo?.manager.username}</Descriptions.Item>
                        <Descriptions.Item label="Trạng thái" span={3}>
                            <StatusDescription status={classInfo?.status} />
                        </Descriptions.Item>
                    </Descriptions>
                </Col>
                <Divider />

                <ChildrenOfClassTable
                    id={id}
                    managerId={classInfo.manager.id} />
            </Card >
            <Modal
                title="Chỉnh sửa thông tin lớp"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                width={800}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="className"
                                label="Tên lớp"
                                initialValue={classInfo.className}
                                rules={[{ required: true, message: 'Vui lòng nhập tên lớp' }]}
                            >
                                <Input placeholder="Nhập tên lớp" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="ageRange"
                                label="Tuổi"
                                rules={[{ required: true, message: 'Vui lòng nhập tuổi' }]}
                                initialValue={classInfo.ageRange}
                            >
                                <Select placeholder="Chọn tuổi" style={{ width: '100%' }}>
                                    <Option value="3-4">3-4 tuổi</Option>
                                    <Option value="4-5">4-5 tuổi</Option>
                                    <Option value="5-6">5-6 tuổi</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="teacherId"
                                label="Chọn giáo viên"
                                rules={[{ required: true, message: 'Vui lòng chọn giáo viên' }]}
                                initialValue={teachers.map((t) => t.username)}
                            >
                                <Select placeholder="Chọn giáo viên" style={{ width: '100%' }}>
                                    {allTeachers.map((teacher) => (
                                        <Option key={teacher.id} value={teacher.id}>
                                            {teacher.username}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="managerId"
                                label="Quản lý lớp"
                                initialValue={classInfo.manager.id}
                                rules={[{ required: true, message: 'Vui lòng chọn quản lý lớp' }]}
                            >
                                <Select placeholder="Chọn quản lý lớp" style={{ width: '100%' }}>
                                    {managers.map((manager) => (
                                        <Option key={manager.id} value={manager.id}>
                                            {manager.username}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div >
    );
}

export default ClassInformation;
