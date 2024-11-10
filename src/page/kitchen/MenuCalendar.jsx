import React, { useState, useEffect } from 'react';
import { Calendar, Modal, Form, Input, Row, Col, Button, message, Badge, Descriptions, Card, Typography, Tabs } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { addNewMenu, getDailyMenuByDate, getMonthlyMenu } from '../../services/services.menu';
import viVN from 'antd/es/calendar/locale/vi_VN';
import TabPane from 'antd/es/tabs/TabPane';

dayjs.locale('vi');

const { Title } = Typography;

const MenuCalendar = () => {
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [monthlyData, setMonthlyData] = useState([]);
    const [viewData, setViewData] = useState({});
    const [form] = Form.useForm();

    const ageGroups = ['3-4 tuổi', '4-5 tuổi', '5-6 tuổi'];

    const fetchMonthlyMenu = async (year, month) => {
        try {
            const response = await getMonthlyMenu(year, month);
            setMonthlyData(response.data);
        } catch (error) {
            message.error('Lỗi khi tải thực đơn của tháng');
            console.error(error);
        }
    };

    const onPanelChange = (date) => {
        fetchMonthlyMenu(date.year(), date.month() + 1);
    };

    const fetchMenu = async (date, isPastDate) => {
        try {
            const response = await getDailyMenuByDate(date);
            const data = response.data;

            if (data && data.length > 0) {
                setViewData(data);
                setIsViewModalVisible(true);
            } else {
                if (isPastDate) {
                    message.warning('Ngày đã qua và chưa có thực đơn, không thể tạo thực đơn mới.');
                    setSelectedDate(null);
                    return;
                }
                form.resetFields();
                setIsAddModalVisible(true);
            }
        } catch (error) {
            message.error('Lỗi khi tải thực đơn');
            console.error(error);
        }
    };

    const onSelect = (date) => {
        const formattedDate = date.format('YYYY-MM-DD');
        const today = dayjs().startOf('day');
        const isPastDate = date.isBefore(today);
        setSelectedDate(formattedDate);
        fetchMenu(formattedDate, isPastDate);
    };

    useEffect(() => {
        const currentDate = dayjs();
        fetchMonthlyMenu(currentDate.year(), currentDate.month() + 1);
    }, []);

    const handleAddOk = () => {
        form.validateFields()
            .then(async values => {
                const requestData = ageGroups.map(age => ({
                    date: selectedDate,
                    ageRange: age,
                    breakfast: values[`${age}_breakfast`] || '',
                    lunch: values[`${age}_lunch`] || '',
                    afternoon: values[`${age}_afternoon`] || ''
                }));

                try {
                    await addNewMenu(requestData);
                    message.success('Thêm thực đơn thành công');
                    setIsAddModalVisible(false);
                    form.resetFields();
                    const [year, month] = selectedDate.split('-').map(Number);
                    fetchMonthlyMenu(year, month);
                    setSelectedDate(null);
                } catch (error) {
                    message.error('Thêm thực đơn thất bại');
                    console.error(error);
                }
            })
            .catch(info => {
                console.error('Validate Failed:', info);
            });
    };

    const handleViewCancel = () => {
        setIsViewModalVisible(false);
        setSelectedDate(null);
    };

    const handleAddCancel = () => {
        setIsAddModalVisible(false);
        form.resetFields();
        setSelectedDate(null);
    };

    const dateCellRender = (value) => {
        const formattedDate = value.format('YYYY-MM-DD');
        const hasMenu = monthlyData.some(menu => menu.date === formattedDate);

        return hasMenu ? (
            <Badge status="success" text="Đã lên thực đơn" />
        ) : null;
    };

    const disabledDate = (current) => {
        return current && (current.day() === 6 || current.day() === 0);
    };

    const renderFoodItems = (foodItems) => {
        return foodItems.split(',').map((item, index) => (
            <div key={index}>{item.trim()}</div>
        ));
    };

    return (
        <Card className="m-2">
            <Calendar
                locale={viVN}
                onSelect={onSelect}
                onPanelChange={onPanelChange}
                dateCellRender={dateCellRender}
                disabledDate={disabledDate}
                mode="month"
            />

            <Modal
                title={`Xem thực đơn ngày ${selectedDate}`}
                open={isViewModalVisible}
                onCancel={handleViewCancel}
                width={800}
                footer={[
                    <Button key="close" onClick={handleViewCancel}>
                        Đóng
                    </Button>
                ]}
            >
                {viewData && viewData.length > 0 ? (
                    <Tabs defaultActiveKey="1">
                        {viewData.map((menu) => (
                            <TabPane tab={`Lứa tuổi ${menu.ageRange}`} key={menu.ageRange}>
                                <Card key={menu.id} style={{ marginBottom: 16 }}>
                                    <Descriptions bordered column={1}>
                                        <Descriptions.Item label="Bữa sáng">
                                            {renderFoodItems(menu.breakfast) || 'Không có thực đơn'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Bữa trưa">
                                            {renderFoodItems(menu.lunch) || 'Không có thực đơn'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Bữa chiều">
                                            {renderFoodItems(menu.afternoon) || 'Không có thực đơn'}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </TabPane>
                        ))}
                    </Tabs>
                ) : (
                    <p>Không có thực đơn cho ngày này</p>
                )}
            </Modal>

            <Modal
                title="Nhập thực đơn"
                open={isAddModalVisible}
                onOk={handleAddOk}
                onCancel={handleAddCancel}
                width={1000}
                footer={[
                    <Button key="cancel" onClick={handleAddCancel}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleAddOk}>
                        Lưu
                    </Button>,
                ]}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={[16, 16]}>
                        {ageGroups.map(age => (
                            <Col span={24} key={age}>
                                <Title level={5}>Lớp {age}</Title>
                                <Row gutter={[16, 16]}>
                                    <Col span={8}>
                                        <Form.Item
                                            label="Bữa sáng 7h30 - 8h15"
                                            name={`${age}_breakfast`}
                                        >
                                            <Input placeholder="Nhập thực đơn buổi sáng" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            label="Bữa trưa 10h30 - 11h30"
                                            name={`${age}_lunch`}
                                        >
                                            <Input placeholder="Nhập thực đơn buổi trưa" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            label="Bữa chiều 14h30 - 15h30"
                                            name={`${age}_afternoon`}
                                        >
                                            <Input placeholder="Nhập thực đơn buổi chiều" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        ))}
                    </Row>
                </Form>
            </Modal>
        </Card>
    );
};

export default MenuCalendar;