import React, { useState, useEffect } from 'react';
import { Spin, Tag, Row, Col, Avatar, Button, Input, Modal, message, Card, Descriptions, Divider, Switch, Pagination } from 'antd';
import { useParams } from 'react-router-dom';
import { changeStatusAPI, gettransportProviderDetailAPI } from '../../../services/service.transportprovider';
import Title from 'antd/es/typography/Title';
import { VehicleTable } from '../../../component/table/VehicleTable';
import { getVehicles } from '../../../services/service.vehicle';

const TransportProviderInformation = () => {
    const [TransportProvider, setTransportProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { id } = useParams();
    const [vehicle, setVehicles] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const fetchTransportProvider = async (id) => {
        setLoading(true);
        try {
            const response = await gettransportProviderDetailAPI(id);
            
            setTransportProvider(response.data);
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching provider:', error);
        } finally {
            setLoading(false);
        }
    };
    const fetchVehicles = async (transportProviderId) => {
        setLoading(true);
        try {
            const response = await getVehicles(currentPage, null, null, transportProviderId);
            setVehicles(response.data.listData); // Lưu danh sách xe
            setTotal(response.data.total); // Cập nhật tổng số xe
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransportProvider(id);
    }, [id]);
    useEffect(() => {
        if (TransportProvider) {
            fetchVehicles(TransportProvider.transportProviderId); // Lấy danh sách xe mỗi khi transport provider thay đổi
        }
    }, [TransportProvider, currentPage]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const newStatus = TransportProvider?.isActive ? false : true;

            // Gọi API với id và trạng thái mới
            await changeStatusAPI(id, newStatus);
      
            message.success('Cập nhật trạng thái thành công');
            await fetchTransportProvider(id);
        } catch (error) {
            console.error('Error changing Transport Provider status:', error);
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
                            <Descriptions.Item label="Tên người đại diện" span={3}>{TransportProvider?.representativeName}</Descriptions.Item>
                            <Descriptions.Item label="Tên nhà cung cấp" span={3}>{TransportProvider?.providerName}</Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại nhà cung cấp" span={3}>
                                {TransportProvider?.providerPhone}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái" span={3}>
                            <Switch checked={TransportProvider.isActive} onClick={showModal} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Số đăng kí" span={3}>{TransportProvider?.providerRegisterNumber}</Descriptions.Item>
                            <Descriptions.Item label="Email" span={3}>{TransportProvider?.providerEmail}</Descriptions.Item>
                            <Descriptions.Item label="Số giấy phép" span={3}>{TransportProvider?.providerLicenseNumber}</Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ" span={3}>
                                <Input value={TransportProvider?.providerAddress
                                } readOnly />
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
                <Divider />
                <Col xs={24} sm={16} className='container'>
                    <Title level={4}>Danh sách xe của nhà cung cấp</Title>
                </Col>
                <VehicleTable data={vehicle} />
                <Pagination
                    current={currentPage}
                    total={total}
                    onChange={(page) => setCurrentPage(page)}
                    style={{ textAlign: 'center', marginTop: 20 }}
                />                
                <Row justify="center">
                    <Button type="primary" className="logout-btn">
                        Lưu thông tin
                    </Button>
                </Row>
            </Card>
            <Modal title="Thay đổi trạng thái" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <p>
                    {TransportProvider?.isActive
                        ? 'Bạn có muốn hạn chế tài khoản này?'
                        : 'Bạn có muốn kích hoạt tài khoản này?'}
                </p>
            </Modal>
        </div>
    );
};

export default TransportProviderInformation;