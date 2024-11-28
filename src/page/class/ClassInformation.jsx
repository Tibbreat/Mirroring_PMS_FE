import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, Col, Descriptions, Divider, message, Row, Spin, Switch } from 'antd';
import { useParams } from 'react-router-dom';
import { changeClassStatusAPI, getClassBaseOnClassId, getTeacherOfClass } from '../../services/services.class';
import moment from 'moment';
import Title from 'antd/es/typography/Title';
import Modal from 'antd/es/modal/Modal';
import { getUserOpnionAPI } from '../../services/services.user';
import { exportChildrenToExcelByClassId } from '../../services/service.children';
import { EditOutlined, DownloadOutlined } from '@ant-design/icons';
import { ChildrenOfClassTable } from '../../component/table/ChildrenOfClassTable';

const ClassInformation = () => {
    const [classInfo, setClassInfo] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [allTeachers, setAllTeachers] = useState([]);
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

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


    const handleDownloadByClassId = async (classId) => {
        try {
            const response = await exportChildrenToExcelByClassId(classId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ChildrenData_Class_${classId}.xls`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("Error downloading file:", error);
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

    const showModalChangeStatus = () => {
        const contentMessage = classInfo?.isActive
            ? "Bạn có chắc chắn muốn ngừng hoạt động của lớp này?."
            : "Bạn có chắc chắn muốn cấp phép lớp này được phép hoạt động?";

        Modal.confirm({
            title: 'Xác nhận thay đổi trạng thái',
            content: contentMessage,
            onOk: async () => {
                try {
                    await changeClassStatusAPI(classInfo.id);
                    message.success('Cập nhật trạng thái thành công');
                    fetchClassInfo();
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

    useEffect(() => {
        fetchClassInfo();
        fetchTeachersAndManagers();
    }, [fetchClassInfo, fetchTeachersAndManagers]);

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
                    <Row justify="space-between" className='mb-3'>
                        <Col>
                            <Title level={5}>Thông tin lớp</Title>
                        </Col>
                        <Col>
                            <Button type="link" icon={<EditOutlined />}>
                                Chỉnh sửa thông tin
                            </Button>
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
                            <Switch checked={classInfo?.status} onClick={showModalChangeStatus} />
                        </Descriptions.Item>
                    </Descriptions>
                </Col>
                <Divider />
                <Col xs={24} sm={16} className='container'>
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Title level={4}>Danh sách trẻ</Title>
                        </Col>
                        <Col>
                            <Button type="primary" icon={<DownloadOutlined />} onClick={() => handleDownloadByClassId(id)}>
                                Download
                            </Button>
                        </Col>
                    </Row>
                </Col>
                <ChildrenOfClassTable id={id} />

            </Card>
        </div>
    );
}

export default ClassInformation;
