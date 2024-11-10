import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Card, message, Spin, Typography } from 'antd';
import { getSchoolInformationAPI } from '../../services/service.school';
import { AuthContext } from '../../component/context/auth.context';

const { Title, Paragraph } = Typography;

const Dashboard = () => {

    return (
        <Card className="m-2">
            <Row gutter={[16, 16]} className="welcome-screen">
                <Col xs={24} md={18} className="d-flex flex-column justify-content-center align-items-center">
                    <div className="col-10" style={{ textAlign: 'center' }}>
                        <Title level={2}>Chào mừng đến với hệ thống quản lý PMS</Title>
                    </div>
                    <div className="col-10">
                        <Row gutter={[16, 16]} align="middle" className='mt-5'>
                            <Col span={3}>
                                <img className="ele-icon" src="/icon/profile-add.svg" alt="Thêm tài khoản" />
                            </Col>
                            <Col span={21}>
                                <Title level={4}>Thêm tài khoản cho nhân viên trong trường</Title>
                                <Paragraph>Bạn có thể thêm tài khoản cho các nhân viên như quản lý lớp, quản lý nhà bếp, quản lý vận chuyển... để dễ dàng giám sát các hoạt động của trường.</Paragraph>
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]} align="middle" className='mt-5'>
                            <Col span={3}>
                                <img className="ele-icon" src="/icon/bank.svg" alt="Thêm các lớp học" />
                            </Col>
                            <Col span={21}>
                                <Title level={4}>Thêm các lớp học</Title>
                                <Paragraph>Tạo các lớp học để dễ dàng quản lý các hoạt động của lớp.</Paragraph>
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]} align="middle" className='mt-5'>
                            <Col span={3}>
                                <img className="ele-icon" src="/icon/education.svg" alt="Thêm thông tin trẻ theo lớp" />
                            </Col>
                            <Col span={21}>
                                <Title level={4}>Thêm thông tin trẻ theo lớp</Title>
                                <Paragraph>Thêm thông tin trẻ theo lứa tuổi, dễ dàng quản lý thông tin cá nhân của trẻ.</Paragraph>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </Card>
    );
};

export default Dashboard;