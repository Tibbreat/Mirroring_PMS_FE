import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Button, Row, Col, message, Layout, Card, Divider, Radio, Spin, Select } from 'antd';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import { getAcademicYearInformationAPI } from '../../services/service.school';

export const Landing = () => {
    const [form] = Form.useForm();
    const { academicYear } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

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

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        // Handle form submission here
        message.success('Đăng ký thành công');
    };

    if (!data) {
        return <div>Loading...</div>;
    }

    const { school, openingDay, totalClassLevel1, totalStudentLevel1, totalClassLevel2, totalStudentLevel2, totalClassLevel3, totalStudentLevel3, totalEnrolledStudents, enrollmentStartDate, enrollmentEndDate, admissionFiles, note } = data;
    const renderFormItem = (name, label, placeholder, rules, component = <Input />, span = 8) => (
        <Col xs={24} md={span}>
            <Form.Item name={name} label={label} rules={rules}>
                {React.cloneElement(component, { placeholder, disabled: loading })}
            </Form.Item>
        </Col>
    );
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
                        <Paragraph>Hội đồng tuyển sinh {school.schoolName} thông báo kế hoạch tuyển sinh năm học {academicYear} của nhà trường như sau</Paragraph>                    </Row>
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
                        <Paragraph>Từ ngày {moment(enrollmentStartDate).format('DD/MM/YYYY')} đến ngày {moment(enrollmentEndDate).format('DD/MM/YYYY')}</Paragraph>
                    </Row>
                    <Divider />
                    <Row>
                        <Title level={5}>3. Ngày khai giảng dự kiến</Title>
                    </Row>
                    <Row>
                        <Paragraph>Ngày {moment(openingDay).format('DD/MM/YYYY')}</Paragraph>
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
                    <Row>
                        <div dangerouslySetInnerHTML={{ __html: note }} />
                    </Row>

                    <Divider />
                    <Row justify={'center'}>
                        <Title level={3} >Đăng ký nhập học</Title>
                    </Row>
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Card title="Thông tin trẻ" bordered={false} style={{ marginTop: 20 }}>
                            <Row gutter={16}>
                                <Col xs={24} md={16}>
                                    <Row gutter={16}>
                                        {renderFormItem(
                                            'childName',
                                            'Tên trẻ',
                                            'Nhập tên trẻ',
                                            [
                                                { required: true, message: 'Vui lòng nhập tên trẻ' },
                                                { pattern: /^[a-zA-ZÀ-ỹ\s]{3,50}$/, message: 'Tên phải từ 3 đến 50 ký tự, chỉ gồm chữ cái và khoảng trắng' },
                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        if (!value || value.trim().length !== 0) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject(new Error('Tên trẻ không được để trống'));
                                                    },
                                                }),
                                            ]
                                        )}
                                        {renderFormItem(
                                            'childBirthDate',
                                            'Ngày sinh',
                                            'Chọn ngày sinh',
                                            [{ required: true, message: 'Vui lòng chọn ngày sinh' }],
                                            <DatePicker style={{ width: '100%' }} />
                                        )}
                                        {renderFormItem(
                                            'gender',
                                            'Giới tính',
                                            'Chọn giới tính',
                                            [{ required: true, message: 'Vui lòng chọn giới tính' }],
                                            <Select>
                                                <Option value="male">Nam</Option>
                                                <Option value="female">Nữ</Option>
                                            </Select>
                                        )}
                                    </Row>
                                    <Row gutter={16}>
                                        {renderFormItem(
                                            'birthAddress',
                                            'Địa chỉ khai sinh',
                                            'Nhập địa chỉ hiện tại (ghi rõ xã/phường, quận/huyện, tỉnh/thành phố) Ví dụ: 123/4 Đường ABC, Phường XYZ, Quận Thanh Xuân, Hà Nội',
                                            [
                                                { required: true, message: 'Vui lòng nhập địa chỉ khai sinh' },
                                                { pattern: /^.{10,200}$/, message: 'Địa chỉ phải từ 10 đến 200 ký tự' },
                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        if (!value || value.trim().length !== 0) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject(new Error('Địa chỉ khai sinh không được để trống'));
                                                    },
                                                }),
                                            ],
                                            <Input />,
                                            24
                                        )}
                                    </Row>
                                    <Row gutter={16}>
                                        {renderFormItem(
                                            'childAddress',
                                            'Địa chỉ hiện tại',
                                            'Nhập địa chỉ hiện tại (ghi rõ xã/phường, quận/huyện, tỉnh/thành phố) Ví dụ: 123/4 Đường ABC, Phường XYZ, Quận Thanh Xuân, Hà Nội',
                                            [
                                                { required: true, message: 'Vui lòng nhập địa chỉ hiện tại' },
                                                { pattern: /^.{10,200}$/, message: 'Địa chỉ phải từ 10 đến 200 ký tự' },
                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        if (!value || value.trim().length !== 0) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject(new Error('Địa chỉ hiện tại không được để trống'));
                                                    },
                                                }),
                                            ],
                                            <Input />,
                                            24
                                        )}
                                    </Row>
                                </Col>
                            </Row>
                        </Card>


                        {/* Thông tin bố mẹ */}
                        <Card title="Thông tin bố" bordered={false} style={{ marginTop: 20 }}>
                            <Row gutter={16}>
                                {renderFormItem(
                                    ['father', 'fullName'],
                                    'Họ và tên',
                                    'Nhập tên bố',
                                    [{ required: true, message: 'Vui lòng nhập tên bố' }]
                                )}
                                {renderFormItem(
                                    ['father', 'phone'],
                                    'Số điện thoại',
                                    'Nhập số điện thoại bố',
                                    [{ required: true, message: 'Vui lòng nhập số điện thoại bố' }]
                                )}
                                {renderFormItem(
                                    ['father', 'idCardNumber'],
                                    'Số CMND/CCCD',
                                    'Nhập số CMND/CCCD bố',
                                    [{ required: true, message: 'Vui lòng nhập số CMND/CCCD bố' }]
                                )}
                            </Row>
                        </Card>

                        <Card title="Thông tin mẹ" bordered={false} style={{ marginTop: 20 }}>
                            <Row gutter={16}>
                                {renderFormItem(
                                    ['mother', 'fullName'],
                                    'Họ và tên',
                                    'Nhập tên mẹ',
                                    [
                                        { required: true, message: 'Vui lòng nhập tên mẹ' },
                                        { pattern: /^[a-zA-ZÀ-ỹ\s]{3,50}$/, message: 'Tên phải từ 3 đến 50 ký tự, chỉ gồm chữ cái và khoảng trắng' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || value.trim().length !== 0) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Tên mẹ không được để trống'));
                                            },
                                        }),
                                    ]
                                )}
                                {renderFormItem(
                                    ['mother', 'phone'],
                                    'Số điện thoại',
                                    'Nhập số điện thoại mẹ',
                                    [
                                        { required: true, message: 'Vui lòng nhập số điện thoại mẹ' },
                                        { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại phải có 10 đến 11 chữ số' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || value.trim().length !== 0) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Số điện thoại không được để trống'));
                                            },
                                        }),
                                    ]
                                )}
                                {renderFormItem(
                                    ['mother', 'idCardNumber'],
                                    'Số CMND/CCCD',
                                    'Nhập số CMND/CCCD mẹ',
                                    [
                                        { required: true, message: 'Vui lòng nhập số CMND/CCCD mẹ' },
                                        { pattern: /^[0-9]{9,12}$/, message: 'Số CMND/CCCD phải có từ 9 đến 12 chữ số' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || value.trim().length !== 0) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Số CMND/CCCD không được để trống'));
                                            },
                                        }),
                                    ]
                                )}
                            </Row>
                        </Card>
                        <Form.Item>
                            <Spin spinning={loading}>
                                <Button type="primary" htmlType="submit" style={{ width: '100%' }} disabled={loading}>
                                    Nộp đơn đăng ký
                                </Button>
                            </Spin>
                        </Form.Item>
                    </Form>
                </Card>
            </Content>
            <Footer>
            </Footer>
        </Layout>
    );
};