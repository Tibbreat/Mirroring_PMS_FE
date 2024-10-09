import React, { useState, useEffect } from 'react';
import { Spin, Tag, Row, Col, Avatar, Button, Input, Modal, message, Card, Descriptions, Divider, Switch } from 'antd';
import { useParams } from 'react-router-dom';
import { changeStatusAPI, getFoodProviderDetailAPI } from '../../../services/service.foodprovider';

const FoodProviderInformation = () => {
    const [foodProvider, setFoodProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { id } = useParams();

    const fetchFoodProvider = async (id) => {
        setLoading(true);
        try {
            const response = await getFoodProviderDetailAPI(id);
            setFoodProvider(response.data);
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching provider:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFoodProvider(id);
    }, [id]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const newStatus = foodProvider?.isActive ? false : true;

            // Gọi API với id và trạng thái mới
            await changeStatusAPI(id, newStatus);
      
            message.success('Cập nhật trạng thái thành công');
            await fetchFoodProvider(id);
        } catch (error) {
            console.error('Error changing Food Provider status:', error);
        } finally {
            setIsModalVisible(false);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    if (loading) {
        return (
            <div className='d-flex justify-content-center align-items-center' style={{ height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className='container'>
            <Card style={{ marginTop: 20 }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={16}>
                        <Descriptions title="Thông tin nhà cung cấp" bordered>
                            <Descriptions.Item label="Tên người đại diện" span={3}>{foodProvider?.representativeName}</Descriptions.Item>
                            <Descriptions.Item label="Tên nhà cung cấp" span={3}>{foodProvider?.providerName}</Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại nhà cung cấp" span={3}>
                                {foodProvider?.providerPhone}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái" span={3}>
                            <Switch checked={foodProvider.isActive} onClick={showModal} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Số đăng kí" span={3}>{foodProvider?.providerRegisterNumber}</Descriptions.Item>
                            <Descriptions.Item label="Email" span={3}>{foodProvider?.providerEmail}</Descriptions.Item>
                            <Descriptions.Item label="Số giấy phép" span={3}>{foodProvider?.providerLicenseNumber}</Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ" span={3}>
                                <Input value={foodProvider?.providerAddress
                                } readOnly />
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
                <Divider />
                <Row justify="center">
                    <Button type="primary" className="logout-btn">
                        Lưu thông tin
                    </Button>
                </Row>
            </Card>
            <Modal title="Thay đổi trạng thái" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <p>
                    {foodProvider?.isActive
                        ? 'Bạn có muốn hạn chế tài khoản này?'
                        : 'Bạn có muốn kích hoạt tài khoản này?'}
                </p>
            </Modal>
        </div>
    );
};

export default FoodProviderInformation;