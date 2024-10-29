import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Button, Input, Modal, message, Card, Descriptions, Divider, Switch, Form, notification, DatePicker } from 'antd';
import { useParams } from 'react-router-dom';
import { getFoodProviderDetailAPI, getFoodRequestsAPI, requestFoodAPI } from '../../../services/service.foodprovider';
import Title from 'antd/es/typography/Title';
import { EditOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { AuthContext } from '../../../component/context/auth.context';
import moment from 'moment';
import { FoodRequestTable } from '../../../component/table/FoodRequestTable';
import Loading from '../../common/Loading';

const FoodProviderInformation = () => {
    const [provider, setProvider] = useState(null);
    const [foodRequest, setFoodRequest] = useState([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
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

    const fetchfoodRequest = async (id) => {
        try {
            const response = await getFoodRequestsAPI(id, currentPage);
            setFoodRequest(response.data.listData);
            setTotal(response.data.total);
        } catch (error) {
            console.error('Error fetching provider:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            const payload = {
                ...values,
                dayNeeded: values.dayNeeded ? values.dayNeeded.format('YYYY-MM-DD') : null,
                providerId: id,
                createdBy: user?.id
            };
            const foodRequestItems = form.getFieldValue('foodRequestItems') || [];

            if (foodRequestItems.length === 0) {
                message.warning('Không có thực phẩm nào được yêu cầu');
                return;
            }

            const response = await requestFoodAPI(payload);
            setIsModalVisible(false);
            fetchfoodRequest(id, currentPage);
            form.resetFields();
            notification.success({
                message: 'Tạo yêu cầu thành công',
                description: 'Vui lòng chờ xác nhận từ quản trị viên'
            });
        } catch (error) {
            console.error('Error creating food request:', error);
            message.error('Có lỗi xảy ra, vui lòng thử lại sau');
        }
    };


    useEffect(() => {
        fetchFoodProvider(id);
        fetchfoodRequest(id);
    }, [id]);


    const disablePastDates = (current) => {
        return current && current < moment().startOf('day');
    };
    if (loading) {
        return (
            <Loading />
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
                                <Button type="link" icon={<EditOutlined />} >Chỉnh sửa thông tin</Button>
                            </Col>
                        </Row>
                        <Descriptions bordered column={6}>
                            <Descriptions.Item label="Tên đơn vị" span={4}>{provider?.providerName}</Descriptions.Item>
                            <Descriptions.Item label="Trạng thái" span={2}>
                                <Switch checked={provider?.isActive} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Người đại diện" span={2}>{provider?.representativeName}</Descriptions.Item>
                            <Descriptions.Item label="Chức vụ" span={2}>{provider?.representativePosition}</Descriptions.Item>
                            <Descriptions.Item label="Mã số thuế" span={2}>{provider?.providerTaxCode}</Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại" span={2}>{provider?.providerPhone}</Descriptions.Item>
                            <Descriptions.Item label="Email" span={4}>{provider?.providerEmail}</Descriptions.Item>
                            <Descriptions.Item label="Ngân hàng" span={2}>{provider?.bankName} </Descriptions.Item>
                            <Descriptions.Item label="Số tài khoản" span={4}>{provider?.bankAccountNumber}</Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ" span={6}>{provider?.providerAddress}</Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
                <Divider />
                <Col xs={24} sm={16} className="container">
                    <Row justify="space-between" className='mb-3'>
                        <Col>
                            <Title level={5}>Danh sách yêu cầu</Title>
                        </Col>
                        {provider?.isActive && (
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
                                Tạo yêu cầu
                            </Button>
                        )}
                    </Row>
                    <FoodRequestTable dataDefault={foodRequest} total={total} providerId={id} currentPage={currentPage} />
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
                    <Form.Item name="dayNeeded" label="Ngày cần thực phẩm"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày cần thực phẩm' }]}
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            format="DD-MM-YYYY"
                            placeholder="Chọn ngày"
                            disabledDate={disablePastDates}
                        />
                    </Form.Item>
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
                                            <Form.Item {...restField} name={[name, 'quantity']} label="Số lượng"
                                                rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
                                            >
                                                <Input placeholder="Số lượng" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item  {...restField} name={[name, 'note']} label="Ghi chú"
                                            >
                                                <Input placeholder="Ghi chú" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={2}>
                                            <MinusCircleOutlined onClick={() => remove(name)}
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
