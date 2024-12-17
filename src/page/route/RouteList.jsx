import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Modal, Form, Input, Row, notification, message } from "antd";
import RouteTable from "../../component/table/RouteTable";
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { fetchRoutesAPI, newRouteAPI } from '../../services/services.route';
import { AuthContext } from '../../component/context/auth.context';

const RouteList = () => {
    const [routes, setRoutes] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [form] = Form.useForm();
    const { user } = useContext(AuthContext);
    const validateNotEmpty = (value, fieldName) => {
        if (!value || value.trim().length === 0) {
            return Promise.reject(new Error(`${fieldName} không được để trống hoặc chỉ chứa khoảng trắng`));
        }
        return Promise.resolve();
    };

    // Show modal to add a new route
    const showModal = () => {
        setIsModalVisible(true);
    };

    // Close modal and reset form
    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const stopLocations = values.stopLocations
                ? values.stopLocations.map(location => location.stop).filter(Boolean)
                : [];

            if (stopLocations.length === 0) {
                message.warning('Vui lòng thêm ít nhất một điểm dừng');
                return;
            }


            const payload = {
                ...values,
                stopLocations,
            };

            console.log("Payload:", payload);
            await newRouteAPI(payload);
            fetchRoutes();
            notification.success({
                message: 'Thêm tuyến thành công',
                description: 'Tuyến mới đã được thêm vào danh sách',
            });

            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            if (error.errorFields) {
                message.error('Vui lòng điền đầy đủ thông tin');
            } else {
                console.error("Error adding route:", error);
                message.error('Có lỗi xảy ra, vui lòng thử lại sau');
            }
        }
    };


    const fetchRoutes = async () => {
        const response = await fetchRoutesAPI(currentPage);
        setRoutes(response.data.listData);
    }

    useEffect(() => {
        fetchRoutes();
    }, currentPage);
    return (
        <Card className="m-2">
            <Col span={24} style={{ marginBottom: 20, display: 'flex', justifyContent: 'flex-end' }}>
                {user.role === 'ADMIN' && (
                    <Button type="primary" onClick={showModal}>Thêm tuyến mới</Button>
                )
                }
            </Col>
            <RouteTable data={routes} />
            <Modal
                title="Thêm tuyến mới"
                visible={isModalVisible}
                onCancel={handleCancel}
                onOk={handleOk}
                okText="Lưu"
                cancelText="Hủy"
                width={800}
            >
                <Form form={form} layout="vertical" name="addRouteForm">
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Tên tuyến"
                                name="routeName"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập tên tuyến' },
                                    { validator: (_, value) => validateNotEmpty(value, 'Tên tuyến') },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Vị trí bắt đầu"
                                name="startLocation"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập vị trí bắt đầu' },
                                    { validator: (_, value) => validateNotEmpty(value, 'Vị trí bắt đầu') },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Vị trí kết thúc"
                                name="endLocation"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập vị trí kết thúc' },
                                    { validator: (_, value) => validateNotEmpty(value, 'Vị trí kết thúc') },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Thời gian đón"
                                name="pickupTime"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập thời gian đón' },
                                    { validator: (_, value) => validateNotEmpty(value, 'Thời gian đón') },
                                ]}
                            >
                                <Input placeholder="hh:mm" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Thời gian đưa trẻ về"
                                name="dropOffTime"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập thời gian trả' },
                                    { validator: (_, value) => validateNotEmpty(value, 'Thời gian trả') },
                                ]}
                            >
                                <Input placeholder="hh:mm" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.List name="stopLocations">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Row gutter={16} key={key}>
                                        <Col span={20}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'stop']}
                                                label="Điểm dừng"
                                                rules={[
                                                    { required: true, message: 'Vui lòng nhập điểm dừng' },
                                                    { validator: (_, value) => validateNotEmpty(value, 'Điểm dừng') },
                                                ]}
                                            >
                                                <Input placeholder="Điểm dừng" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={4}>
                                            <Button
                                                type="text"
                                                onClick={() => remove(name)}
                                                icon={<MinusCircleOutlined />}
                                                style={{ color: 'red', fontSize: '20px', marginTop: '35px' }}
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
                                        Thêm điểm dừng
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form>

            </Modal>
        </Card>
    );
};

export default RouteList;
