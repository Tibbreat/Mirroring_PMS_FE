import React, { useState, useEffect } from 'react';
import { Calendar, Modal, Form, Input, Row, Col, Button, message, Badge, Descriptions, Card } from 'antd';
import moment from 'moment';
import 'moment/locale/vi';
import { addNewMenu, getDailyMenuByDate, getMonthlyMenu } from '../../services/services.menu';
import viVN from 'antd/es/calendar/locale/vi_VN';
moment.locale('vi');

const MenuCalendar = () => {
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [monthlyData, setMonthlyData] = useState([]);
    const [viewData, setViewData] = useState({});
    const [form] = Form.useForm();

    const ageGroups = ['2-3 tuổi', '3-4 tuổi', '5-6 tuổi'];

    const fetchMonthlyMenu = async (year, month) => {
        try {
            const response = await getMonthlyMenu(year, month);
            setMonthlyData(response.data);
        } catch (error) {
            message.error('Lỗi khi tải thực đơn của tháng');
            console.log(error);
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
                // Directly set the response data to viewData
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
            console.log(error);
        }
    };


    const onSelect = (date) => {
        const formattedDate = date.format('YYYY-MM-DD');
        const today = moment().startOf('day');
        const isPastDate = date.isBefore(today);
        setSelectedDate(formattedDate);
        fetchMenu(formattedDate, isPastDate);
    };

    useEffect(() => {
        const currentDate = moment();
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
                    await addNewMenu(requestData);  // Pass the structured data to backend
                    message.success('Thêm thực đơn thành công');
                    setIsAddModalVisible(false);
                    form.resetFields();
                    const [year, month] = selectedDate.split('-').map(Number);
                    fetchMonthlyMenu(year, month);  // Refresh calendar data
                    setSelectedDate(null);
                } catch (error) {
                    message.error('Thêm thực đơn thất bại');
                    console.log(error);
                }
            })
            .catch(info => {
                console.log('Validate Failed:', info);
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
        <div style={{ padding: 20 }}>
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
                    viewData.map((menu) => (
                        <Card title={`Lứa tuổi ${menu.ageRange}`} key={menu.id} style={{ marginBottom: 16 }}>
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
                    ))
                ) : (
                    <p>Không có thực đơn cho ngày này</p>
                )}
            </Modal>


            {/* Modal Thêm Thực Đơn */}
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
                            <Col span={8} key={age}>
                                <Form.Item
                                    label="Bữa sáng 7h30 - 8h15"
                                    name={`${age}_breakfast`}
                                >
                                    <Input placeholder="Nhập thực đơn buổi sáng" />
                                </Form.Item>
                                <Form.Item
                                    label="Bữa trưa 10h30 - 11h30"
                                    name={`${age}_lunch`}
                                >
                                    <Input placeholder="Nhập thực đơn buổi trưa" />
                                </Form.Item>
                                <Form.Item
                                    label="Bữa chiều 14h30 - 15h30"
                                    name={`${age}_afternoon`}
                                >
                                    <Input placeholder="Nhập thực đơn buổi chiều" />
                                </Form.Item>
                            </Col>
                        ))}
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default MenuCalendar;
