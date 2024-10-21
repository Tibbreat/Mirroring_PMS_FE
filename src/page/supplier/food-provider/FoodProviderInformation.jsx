import React, { useState, useEffect, useContext } from 'react';
import { Spin, Tag, Row, Col, Avatar, Button, Input, Modal, message, Card, Descriptions, Divider, Switch, Form } from 'antd';
import { useParams } from 'react-router-dom';
import { getFoodProviderDetailAPI } from '../../../services/service.foodprovider';
import Title from 'antd/es/typography/Title';
import { EditOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { AuthContext } from '../../../component/context/auth.context';

const FoodProviderInformation = () => {
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [form] = Form.useForm();
    const { user } = useContext(AuthContext);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const fetchFoodProvider = async (id) => {
        setLoading(true);
        try {
            const response = await getFoodProviderDetailAPI(id);
            setProvider(response.data);

        } catch (error) {
            console.error('Error fetching provider:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleOk = () => {
        form.validateFields()
            .then(values => {
                console.log('Yêu cầu thực phẩm:', values.foodRequestItems);
                setIsModalVisible(false);
                // form.resetFields();
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    useEffect(() => {
        fetchFoodProvider(id);
    }, [id]);

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
                    <Col xs={24} sm={24}>
                        <Row justify="space-between" className='mb-3'>
                            <Col>
                                <Title level={5}>Thông tin đơn vị</Title>
                            </Col>
                            <Col>
                                <Button type="link" icon={<EditOutlined />} >
                                    Chỉnh sửa thông tin
                                </Button>
                            </Col>
                        </Row>
                        <Descriptions bordered column={6}>
                            <Descriptions.Item label="Tên đơn vị" span={4}>
                                <span>{provider?.providerName}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái" span={2}>
                                <Switch checked={provider?.isActive} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Người đại diện" span={2}>
                                <span>{provider?.representativeName}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Chức vụ" span={2}>
                                <span>{provider?.representativePosition}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Mã số thuế" span={2}>
                                <span>{provider?.providerTaxCode}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại" span={2}>
                                <span>{provider?.providerPhone}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Email" span={4}>
                                <span>{provider?.providerEmail}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngân hàng" span={2}>
                                <span>{provider?.bankName}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Số tài khoản" span={4}>
                                <span>{provider?.bankAccountNumber}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ" span={6}>
                                <span>{provider?.providerAddress}</span>
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
                <Divider />
                <Col xs={24} sm={16} className="container">
                    <Row justify="space-between" className='mb-3'>
                        <Col>
                            <Title level={5}>Danh sách yêu cầu</Title>
                        </Col>
                        <Col>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
                                Tạo yêu cầu
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Card>

            <Modal
                title="Tạo danh sách yêu cầu thực phẩm"
                open={isModalVisible}
                onCancel={handleCancel}
                onOk={handleOk}
                okText="Lưu"
                cancelText="Hủy"
                width={1000}
            >
                <Form form={form} layout="vertical">
                    <Form.List name="foodRequestItems">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <Row gutter={16} key={key}>
                                        <Col span={8}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'foodName']}
                                                label="Tên thực phẩm"
                                                rules={[{ required: true, message: 'Vui lòng nhập tên thực phẩm' }]}
                                            >
                                                <Input placeholder="Tên thực phẩm" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'quantity']}
                                                label="Số lượng"
                                                rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
                                            >
                                                <Input placeholder="Số lượng" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'note']}
                                                label="Ghi chú"
                                            >
                                                <Input placeholder="Ghi chú" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={2}>
                                            <MinusCircleOutlined
                                                onClick={() => remove(name)}
                                                style={{ marginTop: '40px', fontSize: '20px', color: 'red' }}
                                            />
                                        </Col>
                                    </Row>
                                ))}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        style={{ width: '100%' }}
                                        icon={<PlusOutlined />}
                                    >
                                        Thêm yêu cầu
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>
        </div>
    );
};

export default FoodProviderInformation;
