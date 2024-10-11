import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Descriptions, Divider, Pagination, Row, Spin, Switch, Tag } from 'antd';
import { useParams } from 'react-router-dom';
import { getClassBaseOnClassId, getTeacherOfClass } from '../../services/services.class';
import moment from 'moment';
import Title from 'antd/es/typography/Title';
import { getChildrenByClassAPI } from '../../services/service.children';
import { ChildrenTable } from '../../component/table/ChildrenTable';

const ClassInformation = () => {
    const [classInfo, setClassInfo] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [fieldValues, setFieldValues] = useState({});
    const [children, setChildren] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (field, value) => {
        setFieldValues({ ...fieldValues, [field]: value });
    };

    const handleSave = () => {
        setIsEditing(false);
        // Here you can add logic to save the updated field values to the backend if needed
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
    useEffect(() => {
        fetchChildrenList(id);
    }, [id]);
    useEffect(() => {
        fetchClassInfo(id);
    }, [id]);
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
                            {classInfo?.openingDay ? moment(classInfo.openingDay).format('DD-MM-YYYY') : ''}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày bế giảng">
                            {classInfo?.closingDay ? moment(classInfo.closingDay).format('DD-MM-YYYY') : ''}
                        </Descriptions.Item>
                        <Descriptions.Item label="Giáo viên phụ trách">
                            {teachers.map((teachers) => teachers.username).join(', ')}
                        </Descriptions.Item>
                        <Descriptions.Item label="Quản lý lớp">{classInfo?.manager.username}</Descriptions.Item>
                        <Descriptions.Item label="Trạng thái" span={3}>
                            <Tag color={classInfo?.status ? 'green' : 'red'}>
                                {classInfo?.status ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                            </Tag>
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
        </div>
    );
}

export default ClassInformation;