import React, { useEffect, useState } from 'react';
import { Row, Col, message, Layout, Card, Divider } from 'antd';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import { getAcademicYearInformationAPI } from '../../services/service.school';
import { AdmissionForm } from './AdmissionForm';
import Loading from '../common/Loading';

export const Landing = () => {

    const { academicYear } = useParams();
    const [data, setData] = useState(null);

    const fetchAcademicYearInformation = async () => {
        try {
            const response = await getAcademicYearInformationAPI(academicYear);
            setData(response.data);
        } catch (error) {
            message.error('Lỗi khi lấy thông tin năm học');
        }
    };

    useEffect(() => {
        fetchAcademicYearInformation();
    }, [academicYear]);

    if (!data) {
        return <Loading />;
    }

    const { school, openingDay, totalClassLevel1, totalStudentLevel1, totalClassLevel2, totalStudentLevel2, totalClassLevel3, totalStudentLevel3, totalEnrolledStudents, enrollmentStartDate, enrollmentEndDate, admissionFiles, note } = data;

    return (
        <Layout>
            <Header style={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div>
                    <img src="/icon/logo.svg" alt="logo" style={{ maxWidth: '80%' }} />
                </div>
            </Header>
            <Content>
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Card className='m-3'>
                            <Row justify={'center'}>
                                <Title level={3}>{school.schoolName}</Title>
                            </Row>
                            <Row justify={'center'}>
                                <Title level={4}>Thông báo tuyển sinh năm học {academicYear}</Title>
                            </Row>
                            <Divider />
                            <Row>
                                <Title level={5}>Hội đồng tuyển sinh {school.schoolName} thông báo kế hoạch tuyển sinh năm học {academicYear} của nhà trường như sau</Title>
                            </Row>
                            <Row>
                                <Paragraph>Hội đồng tuyển sinh {school.schoolName} thông báo kế hoạch tuyển sinh năm học {academicYear} của nhà trường như sau</Paragraph>
                            </Row>
                            <Divider />
                            <Row>
                                <Title level={5}>1. Chỉ tiêu tuyển sinh</Title>
                            </Row>
                            <Row>
                                <Paragraph>{totalEnrolledStudents} trẻ</Paragraph>
                            </Row>
                            <Divider />
                            <ul>
                                <li>
                                    <Row>
                                        <Col span={8}>
                                            <Paragraph className='fw-bold'>Lớp 3-4 tuổi</Paragraph>
                                        </Col>
                                        <Col span={16}>
                                            <Paragraph>{totalClassLevel1} lớp, {totalStudentLevel1} trẻ/lớp</Paragraph>
                                        </Col>
                                    </Row>
                                </li>
                                <li>
                                    <Row>
                                        <Col span={8}>
                                            <Paragraph className='fw-bold'>Lớp 4-5 tuổi</Paragraph>
                                        </Col>
                                        <Col span={16}>
                                            <Paragraph>{totalClassLevel2} lớp, {totalStudentLevel2} trẻ/lớp</Paragraph>
                                        </Col>
                                    </Row>
                                </li>
                                <li>
                                    <Row>
                                        <Col span={8}>
                                            <Paragraph className='fw-bold'>Lớp 5-6 tuổi</Paragraph>
                                        </Col>
                                        <Col span={16}>
                                            <Paragraph>{totalClassLevel3} lớp, {totalStudentLevel3} trẻ/lớp</Paragraph>
                                        </Col>
                                    </Row>
                                </li>
                            </ul>
                            <Divider />
                            <Row>
                                <Title level={5}>2. Thời gian tuyển sinh</Title>
                            </Row>
                            <Row>
                                <Paragraph>Từ ngày {dayjs(enrollmentStartDate).format('DD/MM/YYYY')} đến ngày {dayjs(enrollmentEndDate).format('DD/MM/YYYY')}</Paragraph>
                            </Row>
                            <Divider />
                            <Row>
                                <Title level={5}>3. Ngày khai giảng dự kiến</Title>
                            </Row>
                            <Row>
                                <Paragraph>Ngày {dayjs(openingDay).format('DD/MM/YYYY')}</Paragraph>
                            </Row>
                            <Divider />
                            <Row>
                                <Title level={5}>4. Hồ sơ nhập học</Title>
                            </Row>
                            <ul>
                                {admissionFiles.map((file, index) => (
                                    <li key={index}>
                                        <Paragraph>
                                            {file.fileName}
                                            {file.note && ` (${file.note})`}
                                        </Paragraph>
                                    </li>
                                ))}
                            </ul>
                            <Divider />
                            <Row>
                                <Title level={5}>5. Lưu ý</Title>
                            </Row>
                            <Row className='mt-3'>
                                <div dangerouslySetInnerHTML={{ __html: note }} />
                            </Row>
                        </Card>
                    </Col>
                    <Col xs={24} md={12} >
                        <AdmissionForm academicYear={academicYear} />
                    </Col>
                </Row>
            </Content>
            <Footer>
            </Footer>
        </Layout>
    );
};