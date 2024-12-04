import { EditOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Descriptions, Form, Input, Modal, Radio, Row, Steps, Switch, Table, message, DatePicker, Select, Tag } from "antd";
import Title from "antd/es/typography/Title";
import UploadImage from "../../component/input/UploadImage";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { fetchAvailableRoutesAPI } from "../../services/services.route";
import { getChildDetailAPI, updateServiceStatus, uploadImageAPI } from "../../services/service.children";

const { Step } = Steps;
const { Option } = Select;

export const ChildrenDetail = ({ id, role }) => {
    const [updating, setUpdating] = useState(false);
    const [children, setChildren] = useState();
    const [isBoardingModalVisible, setIsBoardingModalVisible] = useState(false);
    const [isTransportModalVisible, setIsTransportModalVisible] = useState(false);
    const [isUploadImageModalVisible, setIsUploadImageModalVisible] = useState(false);
    const [availableRoutes, setAvailableRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [stopLocations, setStopLocations] = useState([]);
    const [selectedStopLocation, setSelectedStopLocation] = useState();
    const [isRouteModalVisible, setIsRouteModalVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [hasUploadedImage, setHasUploadedImage] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [isModalUpdateChildren, setIsModalUpdateChildren] = useState(false);
    const [formUpdateChildren] = Form.useForm();

    useEffect(() => {
        fetchChildrenData(id);
    }, [id]);

    const fetchAvailableRoutes = async () => {
        try {
            const response = await fetchAvailableRoutesAPI();
            setAvailableRoutes(response.data);
        } catch (error) {
            console.error('Error fetching available routes:', error);
        }
    };

    const fetchChildrenData = async (id) => {
        try {
            const response = await getChildDetailAPI(id);
            setChildren(response.data);
        } catch (error) {
            console.error('Error fetching children data:', error);
        }
    };

    const fetchStopLocations = async (route) => {
        try {
            setStopLocations(route.stopLocations);
        } catch (error) {
            console.error('Error fetching stop locations:', error);
        }
    };

    const handleChangeServiceStatus = async (serviceName) => {
        setUpdating(true);
        try {
            if (serviceName === 'transport') {
                if (!children.isRegisteredForTransport) {
                    if (selectedRoute === null || selectedStopLocation === null) {
                        message.error("Vui lòng chọn tuyến và điểm dừng");
                        setUpdating(false);
                        return;
                    } else {
                        await updateServiceStatus(id, serviceName, selectedRoute.id, selectedStopLocation);
                        message.success("Đăng ký đưa đón thành công");
                    }
                } else {
                    await updateServiceStatus(id, serviceName);
                    message.success("Hủy đăng ký đưa đón thành công");
                }
            } else {
                if (children.isRegisteredForBoarding) {
                    await updateServiceStatus(id, serviceName);
                    message.success("Hủy đăng ký bán trú thành công");
                } else {
                    await updateServiceStatus(id, serviceName);
                    message.success("Đăng ký bán trú thành công");
                }
            }
            await fetchChildrenData(id);
        } catch (error) {
            console.error('Error changing service status:', error);
            message.error("Đăng ký thất bại");
        } finally {
            setUpdating(false);
        }
    };

    const handleBoardingSwitchChange = () => {
        setIsBoardingModalVisible(true);
    };

    const handleTransportSwitchChange = () => {
        if (!children?.isRegisteredForTransport) {
            setIsRouteModalVisible(true);
            fetchAvailableRoutes();
        } else {
            setIsTransportModalVisible(true);
        }
    };

    const handleConfirmBoarding = () => {
        handleChangeServiceStatus('boarding');
        setIsBoardingModalVisible(false);
    };

    const handleConfirmTransport = async () => {
        await handleChangeServiceStatus('transport');
        setIsTransportModalVisible(false);
        setIsRouteModalVisible(false);
    };

    const handleCancelBoarding = () => {
        setIsBoardingModalVisible(false);
    };

    const handleCancelTransport = () => {
        setSelectedRoute(null);
        setSelectedStopLocation(null);
        setIsTransportModalVisible(false);
    };

    const handleRouteSelect = (route) => {
        setSelectedRoute(route);
        fetchStopLocations(route);
        setCurrentStep(1);
    };

    const handleStopLocationSelect = (stopLocationId) => {
        setSelectedStopLocation(stopLocationId);
    };

    const handleBack = () => {
        setSelectedRoute(null);
        setSelectedStopLocation(null);
        setCurrentStep(currentStep - 1);
    };

    const handleImageChange = async () => {
        const file = imageFile;
        if (!file) {
            message.error("Vui lòng chọn ảnh");
            return;
        }

        try {
            await uploadImageAPI(id, file);
            message.success("Ảnh đã được cập nhật thành công");
            fetchChildrenData(id);
        } catch (error) {
            console.error("Error uploading image:", error);
            message.error("Có lỗi xảy ra khi cập nhật ảnh");
        } finally {
            setIsUploadImageModalVisible(false);
            setHasUploadedImage(true);
        }
    };

    const handleUpdateChildren = () => {
        setIsModalUpdateChildren(false);
    };

    const handleUploadChange = (file) => {
        setImageFile(file);
    };

    const openUpdateChildrenModal = () => {
        setIsModalUpdateChildren(true);
    };

    const handleCandelRouteSelect = () => {
        setIsRouteModalVisible(false);
    };

    const renderFormItem = (name, label, placeholder, rules, component = <Input />, span) => (
        <Col xs={24} md={span}>
            <Form.Item name={name} label={label} rules={rules}>
                {React.cloneElement(component, { placeholder, disabled: updating })}
            </Form.Item>
        </Col>
    );

    const columns = [
        { title: 'Tên tuyến', dataIndex: 'routeName', key: 'routeName' },
        { title: 'Điểm đón', dataIndex: 'startLocation', key: 'startLocation' },
        { title: 'Thời gian đón', dataIndex: 'pickupTime', key: 'pickupTime' },
        { title: 'Thời gian trả', dataIndex: 'dropOffTime', key: 'dropOffTime' },
        {
            title: 'Chặng',
            dataIndex: 'stopLocations',
            key: 'stopLocations',
            render: (stopLocations) => {
                if (stopLocations && stopLocations.length > 0) {
                    return stopLocations.map((location) => (
                        <div key={location.id} style={{ fontSize: '12px' }}>
                            {location.locationName || location.id}
                        </div>
                    ));
                }
                return 'No stops available';
            },
        },
        {
            title: 'Chọn',
            key: 'select',
            render: (text, record) => (
                <Radio.Group onChange={() => handleRouteSelect(record)} value={selectedRoute}>
                    <Radio value={record.id}>Chọn</Radio>
                </Radio.Group>
            ),
        },
    ];

    const stopLocationColumns = [
        { title: 'Tên điểm dừng', dataIndex: 'locationName', key: 'locationName' },
        {
            title: 'Chọn',
            key: 'select',
            align: 'center',
            render: (text, record) => (
                <Radio.Group onChange={() => handleStopLocationSelect(record.id)} value={selectedStopLocation}>
                    <Radio value={record.id}>Chọn</Radio>
                </Radio.Group>
            ),
        },
    ];

    return (
        <>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={8} className='d-flex flex-column align-items-center justify-content-center'>
                    <Avatar
                        size={156}
                        src={hasUploadedImage || children?.imageUrl ? children?.imageUrl : "/image/placeholder.jpg"}
                        style={{ display: hasUploadedImage || children?.imageUrl ? "block" : "none" }}
                    />
                    {role === 'CLASS_MANAGER' && (<Button className='mt-3' type="link" onClick={() => setIsUploadImageModalVisible(true)}>Cập nhật ảnh</Button>)}

                </Col>
                <Col xs={24} sm={16}>
                    <Row justify="space-between" className='mb-3'>
                        <Col><Title level={5}>Thông tin cá nhân</Title></Col>
                        <Col>
                            {role === 'CLASS_MANAGER' && (<Button type="link" icon={<EditOutlined />} onClick={openUpdateChildrenModal} >Chỉnh sửa thông tin</Button>)}
                        </Col>
                    </Row>
                    <Descriptions bordered column={6}>
                        <Descriptions.Item label="Họ và tên" span={6}>{children?.childName} </Descriptions.Item>
                        <Descriptions.Item label="Ngày sinh" span={3}>{dayjs(children?.childBirthDate).format('DD/MM/YYYY')}</Descriptions.Item>
                        <Descriptions.Item label="Giới tính" span={3}>{children?.gender === 'female' ? "Nữ" : "Nam"}</Descriptions.Item>
                        <Descriptions.Item label="Nơi khai sinh" span={6}>{children?.birthAddress}</Descriptions.Item>
                        <Descriptions.Item label="Nơi ở hiện tại" span={6}>{children?.childAddress}</Descriptions.Item>
                        <Descriptions.Item label="Đăng ký bán trú" span={3}>
                            {role === 'CLASS_MANAGER' ? (
                                <Switch
                                    checked={children?.isRegisteredForBoarding}
                                    loading={updating}
                                    onChange={handleBoardingSwitchChange}
                                />
                            ) : (
                                <Tag color={children?.isRegisteredForBoarding ? 'green' : 'red'}>
                                    {children?.isRegisteredForBoarding ? 'Đã đăng ký' : 'Chưa đăng ký'}
                                </Tag>
                            )}
                        </Descriptions.Item>

                        <Descriptions.Item label="Đăng ký xe" span={3}>
                            {role === 'CLASS_MANAGER' ? (
                                <Switch
                                    checked={children?.isRegisteredForTransport}
                                    loading={updating}
                                    onChange={handleTransportSwitchChange}
                                />
                            ) : (
                                <Tag color={children?.isRegisteredForTransport ? 'green' : 'red'}>
                                    {children?.isRegisteredForTransport ? 'Đã đăng ký' : 'Chưa đăng ký'}
                                </Tag>
                            )}
                        </Descriptions.Item>

                    </Descriptions>
                </Col>
            </Row>

            <Modal
                title="Xác nhận thay đổi"
                open={isBoardingModalVisible}
                onOk={handleConfirmBoarding}
                onCancel={handleCancelBoarding}
                okText="Xác nhận"
                cancelText="Đóng"
            >
                <p>Bạn có chắc chắn muốn thay đổi trạng thái đăng ký bán trú?</p>
            </Modal>

            <Modal
                title="Xác nhận thay đổi"
                open={isTransportModalVisible}
                onOk={handleConfirmTransport}
                onCancel={handleCancelTransport}
                okText="Xác nhận"
                cancelText="Đóng"
            >
                <p>Bạn có chắc chắn muốn hủy đăng ký xe đưa đón?</p>
            </Modal>

            <Modal
                title="Chọn tuyến"
                open={isRouteModalVisible}
                onCancel={handleCandelRouteSelect}
                width={`${window.innerWidth * 0.8}px`}
                footer={[
                    selectedRoute !== null && (
                        <Button key="back" onClick={handleBack}>
                            Quay lại
                        </Button>
                    ),
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleConfirmTransport}
                        disabled={selectedRoute === null} // Disable "Xác nhận" if no route is selected
                    >
                        Xác nhận
                    </Button>,
                ].filter(Boolean)} // Filter out null values from the footer array
            >
                <Steps current={currentStep}>
                    <Step title="Chọn tuyến" />
                    <Step title="Chọn điểm đón" />
                </Steps>

                {currentStep === 0 && (
                    <Table
                        className="mt-4"
                        dataSource={availableRoutes}
                        columns={columns}
                        rowKey="id"
                        pagination={false}
                    />
                )}

                {currentStep === 1 && (
                    <Table
                        dataSource={stopLocations}
                        columns={stopLocationColumns}
                        rowKey="id"
                        pagination={false}
                    />
                )}
            </Modal>

            <Modal
                title="Cập nhật ảnh"
                open={isUploadImageModalVisible}
                onCancel={() => setIsUploadImageModalVisible(false)}
                onOk={handleImageChange}
                okText="Xác nhận"
                cancelText="Đóng"
            >
                <UploadImage onImageChange={handleUploadChange} />
            </Modal>

            <Modal
                title="Cập nhật thông tin trẻ"
                open={isModalUpdateChildren}
                onCancel={() => setIsModalUpdateChildren(false)}
                onOk={handleUpdateChildren}
                okText="Cập nhật"
                cancelText="Đóng"
                width={800}
            >
                <Form form={formUpdateChildren} layout="vertical"
                    initialValues={{
                        childName: children?.childName,
                        gender: children?.gender,
                        birthAddress: children?.birthAddress,
                        childAddress: children?.childAddress,
                    }}
                >
                    <Row gutter={16}>
                        <Col xs={24} md={24}>
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
                        </Col>
                        <Col xs={24} md={12}>
                            {renderFormItem(
                                'childBirthDate',
                                'Ngày sinh',
                                'Chọn ngày sinh',
                                [{ required: true, message: 'Vui lòng chọn ngày sinh' }],
                                <DatePicker style={{ width: '100%' }} />
                            )}
                        </Col>
                        <Col xs={24} md={12}>
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
                        </Col>
                        <Col xs={24} md={24}>
                            {renderFormItem(
                                'birthAddress',
                                'Địa chỉ khai sinh',
                                'Nhập địa chỉ khai sinh',
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
                        </Col>
                        <Col xs={24} md={24}>
                            {renderFormItem(
                                'childAddress',
                                'Địa chỉ hiện tại',
                                'Nhập địa chỉ hiện tại',
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
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};