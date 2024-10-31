import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Card, message, Spin, FloatButton } from 'antd';
import { getSchoolInformationAPI } from '../../services/service.school';
import { AuthContext } from '../../component/context/auth.context';

const Dashboard = () => {
    const [schoolInfo, setSchoolInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchSchoolInfo = async () => {
            try {
                const response = await getSchoolInformationAPI(user.schoolId);
                setSchoolInfo(response.data);
            } catch (error) {
                console.error('Error fetching school information:', error);
                message.error('Không thể lấy thông tin trường học');
            } finally {
                setLoading(false);
            }
        };

        fetchSchoolInfo();
    }, [user.id]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <Card className="m-2">
            <Row gutter={[16, 16]} className="welcome-screen">
                <Col xs={24} md={18} className="d-flex flex-column justify-content-center align-items-center">
                    <div className="col-10" style={{ textAlign: 'center' }}>
                        <p className="welcome-title">Chào mừng đến với hệ thống quản lý PMS</p>
                        <p className="welcome-sub-title">{schoolInfo?.emailContact}</p>
                    </div>
                    <div className="col-10">

                        <Row>
                            <Col span={3}>
                                <img className="ele-icon" src="/icon/profile-add.svg" alt="" />
                            </Col>
                            <Col span={21}>
                                <p className="ele-title fw-bold">Thêm tài khoản cho các nhân viên trong trường</p>
                                <p className="ele-sub-title">Bạn có thể thêm tài khoản cho các nhân viên như quản lý lớp, quản lý nhà bếp, quản lý vận chuyển... để dễ dàng giám sát các hoạt động của trường.</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={3}>
                                <img className="ele-icon" src="/icon/bank.svg" alt="" />
                            </Col>
                            <Col span={21}>
                                <p className="ele-title fw-bold">Thêm các lớp học</p>
                                <p className="ele-sub-title">Tạo các lớp học để dễ dàng quản lý các hoạt động của lớp.</p>
                            </Col>
                        </Row>


                        <Row>
                            <Col span={3}>
                                <img className="ele-icon" src="/icon/education.svg" alt="" />
                            </Col>
                            <Col span={21}>
                                <p className="ele-title fw-bold">Thêm thông tin trẻ theo lớp</p>
                                <p className="ele-sub-title">Thêm thông tin trẻ theo lứa tuổi, dễ dàng quản lý thông tin cá nhân của trẻ.</p>
                            </Col>
                        </Row>

                    </div>
                </Col>

            </Row>
        </Card>
    );
};

export default Dashboard;