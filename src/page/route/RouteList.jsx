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

    // Show modal to add a new route
    const showModal = () => {
        setIsModalVisible(true);
    };

    // Close modal and reset form
    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    // Handle form submission
    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            // Map stopLocations to an array of strings
            const stopLocations = values.stopLocations.map(location => location.stop);

            const payload = {
                ...values,
                stopLocations,  // Send as an array of strings
            };

            if (stopLocations.length === 0) {
                message.warning('Vui lòng thêm ít nhất một điểm dừng');
                return;
            }

            // Call the API to save the route
            const response = await newRouteAPI(payload);
            fetchRoutes();
            setIsModalVisible(false);
            form.resetFields();
            notification.success({
                message: 'Thêm tuyến thành công',
                description: 'Tuyến mới đã được thêm vào danh sách',
            });
        } catch (error) {
            console.error("Error adding route:", error);
            message.error('Có lỗi xảy ra, vui lòng thử lại sau');
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
                                rules={[{ required: true, message: 'Vui lòng nhập tên tuyến' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Vị trí bắt đầu"
                                name="startLocation"
                                rules={[{ required: true, message: 'Vui lòng nhập vị trí bắt đầu' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Vị trí kết thúc"
                                name="endLocation"
                                rules={[{ required: true, message: 'Vui lòng nhập vị trí kết thúc' }]}
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
                                rules={[{ required: true, message: 'Vui lòng nhập thời gian đón' }]}
                            >
                                <Input placeholder="hh:mm" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Thời gian đưa trẻ về"
                                name="dropOffTime"
                                rules={[{ required: true, message: 'Vui lòng nhập thời gian trả' }]}
                            >
                                <Input placeholder="hh:mm" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Dynamic stop locations using Form.List similar to foodRequestItems */}
                    <Form.List name="stopLocations">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <Row gutter={16} key={key}>
                                        <Col span={20}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'stop']}
                                                label="Điểm dừng"
                                                rules={[{ required: true, message: 'Vui lòng nhập điểm dừng' }]}
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
