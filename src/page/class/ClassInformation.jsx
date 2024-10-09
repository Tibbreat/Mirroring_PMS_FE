import React, { useState, useEffect } from 'react';
import { Card, Col, Descriptions, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { getClassBaseOnClassId, getTeacherOfClass } from '../../services/services.class';
import moment from 'moment';

const ClassInformation = () => {
    const [classInfo, setClassInfo] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

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

    useEffect(() => {
        fetchClassInfo(id);
    }, [id]);

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
                    </Descriptions>
                </Col>
            </Card>
        </div>
    );
}

export default ClassInformation;