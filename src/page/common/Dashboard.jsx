import React from 'react';
import { Row, Col, Card, Button } from 'antd';
import SupportBtn from "../../component/button/SupportBtn";

const Dashboard = () => {
    return (
        <div style={{ padding: 24 }}>
            <Row gutter={[16, 16]} className="welcome-screen">
                <Col xs={24} md={18} className="d-flex flex-column justify-content-center align-items-center">
                    <Card className="col-10" style={{ textAlign: 'center' }}>
                        <p className="welcome-title">Chào mừng đến với hệ thống quản lý PMS</p>
                        <p className="welcome-sub-title">mail...</p>
                    </Card>
                    <div className="col-10">
                        <Card className="ele-1" hoverable>
                            <Row>
                                <Col span={3}>
                                    <img className="ele-icon" src="/icon/profile-add.svg" alt="" />
                                </Col>
                                <Col span={21}>
                                    <p className="ele-title fw-bold">Thêm tài khoản cho các nhân viên trong trường</p>
                                    <p className="ele-sub-title">Bạn có thể thêm tài khoản cho các nhân viên như quản lý lớp, quản lý nhà bếp, quản lý vận chuyển... để dễ dàng giám sát các hoạt động của trường.</p>
                                </Col>
                            </Row>
                        </Card>
                        <Card className="ele-1 " hoverable>
                            <Row>
                                <Col span={3}>
                                    <img className="ele-icon" src="/icon/bank.svg" alt="" />
                                </Col>
                                <Col span={21}>
                                    <p className="ele-title fw-bold">Thêm các lớp học</p>
                                    <p className="ele-sub-title">Tạo các lớp học để dễ dàng quản lý các hoạt động của lớp.</p>
                                </Col>
                            </Row>
                        </Card>
                        <Card className="ele-1 " hoverable>
                            <Row>
                                <Col span={3}>
                                    <img className="ele-icon" src="/icon/education.svg" alt="" />
                                </Col>
                                <Col span={21}>
                                    <p className="ele-title fw-bold">Thêm thông tin trẻ theo lớp</p>
                                    <p className="ele-sub-title">Thêm thông tin trẻ theo lứa tuổi, dễ dàng quản lý thông tin cá nhân của trẻ.</p>
                                </Col>
                            </Row>
                        </Card>
                    </div>
                </Col>
                <Col xs={24} md={6} className="d-flex flex-column">
                    <div className="mt-auto">
                        <SupportBtn />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;