import React, { useState, useEffect } from 'react';
import { Calendar, Card, Form, Modal, Tabs, Input, Button, Row, Col, message, Badge, Descriptions, Typography } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import locale from 'antd/es/calendar/locale/vi_VN';
import { createMeal, getMealsByMonth } from '../../services/services.meal';

dayjs.locale('vi');

const MenuCalendar = () => {
    const [selectedDate, setSelectedDate] = useState();
    const [isModalAddMealVisible, setIsModalAddMealVisible] = useState(false);
    const [isModalViewMealVisible, setIsModalViewMealVisible] = useState(false);
    const [mealData, setMealData] = useState([]);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(dayjs().startOf('month').format('YYYY-MM'));
    const [form] = Form.useForm();

    useEffect(() => {
        fetchMonthlyMealData(currentMonth);
    }, [currentMonth]);

    const onSelect = (date) => {
        const formattedDate = date.format('YYYY-MM-DD');
        const newMonth = date.startOf('month').format('YYYY-MM');
        const today = dayjs().startOf('day');

        if (newMonth !== currentMonth) {
            setCurrentMonth(newMonth);
            return;
        }

        setSelectedDate(date);
        const mealsForDate = mealData.filter(meal => meal.mealDate === formattedDate);

        if (date.isBefore(today)) {
            if (mealsForDate.length > 0) {
                setSelectedMeal(mealsForDate);
                setIsModalViewMealVisible(true);
            } else {
                message.info('Ngày được chọn không có thực đơn');
            }
        } else {
            if (mealsForDate.length > 0) {
                setSelectedMeal(mealsForDate);
                setIsModalViewMealVisible(true);
            } else {
                setIsModalAddMealVisible(true);
            }
        }
    };

    const handleCancel = () => {
        setIsModalAddMealVisible(false);
        setIsModalViewMealVisible(false);
        form.resetFields();
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const ageGroups = ['3-4', '4-5', '5-6'];
            for (let ageGroup of ageGroups) {
                const mainDishes = values[ageGroup]?.mainDishes;
                if (!mainDishes || mainDishes.length < 1) {
                    message.error(`Lớp ${ageGroup} phải có ít nhất 1 món chính`);
                    return;
                }
            }
            const formattedDate = selectedDate ? selectedDate.format('YYYY-MM-DD') : null;
            const payload = {
                group3To4: values['3-4'],
                group4To5: values['4-5'],
                group5To6: values['5-6'],
                date: formattedDate,
            };
            console.log("Payload", payload);
            await createMeal(payload);
            message.success('Thực đơn đã được lưu thành công');
            setIsModalAddMealVisible(false);
            form.resetFields();
            fetchMonthlyMealData(selectedDate.startOf('month').format('YYYY-MM'));
        } catch (error) {
            message.error('Có lỗi xảy ra, vui lòng thử lại');
        }
    };

    const fetchMonthlyMealData = async (month) => {
        try {
            const response = await getMealsByMonth(month);
            setMealData(response.data);
        } catch (error) {
            message.error('Không thể tải dữ liệu thực đơn cho tháng');
        }
    };

    const renderDishList = (ageGroup, dishType, label, isMainDish = false) => (
        <Form.List
            name={[ageGroup, dishType]}
            rules={isMainDish ? [{
                validator: async (_, dishes) => {
                    if (!dishes || dishes.length < 1) {
                        return Promise.reject(new Error('Phải có ít nhất một món chính'));
                    }
                }
            }] : []}
        >
            {(fields, { add, remove }) => (
                <>
                    <label>{label}</label>
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                        <Row key={key} gutter={16}>
                            <Col span={22}>
                                <Form.Item
                                    {...restField}
                                    name={[name, dishType]}
                                    fieldKey={[fieldKey, dishType]}
                                    rules={[{ required: true, message: `Vui lòng nhập ${label.toLowerCase()}` }]}
                                >
                                    <Input placeholder={`Nhập ${label.toLowerCase()}`} />
                                </Form.Item>
                            </Col>
                            <Col span={2}>
                                <MinusCircleOutlined onClick={() => remove(name)} />
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
                            Thêm {label.toLowerCase()}
                        </Button>
                    </Form.Item>
                </>
            )}
        </Form.List>
    );

    const renderMealTab = (ageGroup) => (
        <Row>
            <Col span={12}>
                <Card title="Bữa trưa" className='m-2'>
                    {renderDishList(ageGroup, 'mainDishes', 'Món chính', true)}
                    {renderDishList(ageGroup, 'sideDishes', 'Món phụ')}
                </Card>
            </Col>
            <Col span={12}>
                <Card title="Bữa xế" className='m-2'>
                    <Form.Item
                        name={[ageGroup, 'snack']}
                        label="Thực đơn bữa xế"
                        rules={[{ required: true, message: 'Vui lòng nhập thực đơn bữa xế' }]}
                    >
                        <Input.TextArea rows={4} placeholder="Nhập thực đơn bữa xế" />
                    </Form.Item>
                </Card>
            </Col>
        </Row>
    );

    const dateCellRender = (value) => {
        const formattedDate = value.format('YYYY-MM-DD');
        const mealsForDay = mealData.filter(meal => meal.mealDate === formattedDate);
        return mealsForDay.length ? (
            <Badge status="success" text="Đã lên thực đơn" />
        ) : null;
    };

    const tabItems = [
        {
            key: '1',
            label: 'Lớp 3-4 tuổi',
            children: renderMealTab('3-4'),
        },
        {
            key: '2',
            label: 'Lớp 4-5 tuổi',
            children: renderMealTab('4-5'),
        },
        {
            key: '3',
            label: 'Lớp 5-6 tuổi',
            children: renderMealTab('5-6'),
        },
    ];

    const renderViewMealTabs = () => {
        const tabs = selectedMeal.map((meal, index) => ({
            key: index.toString(),
            label: `Lớp ${meal.ageRange}`,
            children: (
                <Card key={index} title={`Lớp ${meal.ageRange}`}>
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label={<Typography.Text strong>Bữa trưa</Typography.Text>}>
                            <Typography.Text strong>Món chính:</Typography.Text>
                            <ul>
                                {meal.dishes
                                    .filter(dish => dish.dishType === 'main')
                                    .map(dish => (
                                        <li key={dish.id}> {dish.dishName}</li>
                                    ))}
                            </ul>

                            <Typography.Text strong>Món phụ:</Typography.Text>
                            <ul>
                                {meal.dishes
                                    .filter(dish => dish.dishType === 'side')
                                    .map(dish => (
                                        <li key={dish.id} className=""> {dish.dishName}</li>
                                    ))}
                            </ul>
                        </Descriptions.Item>

                        <Descriptions.Item label={<Typography.Text strong>Bữa xế</Typography.Text>}>
                            <ul>
                                {meal.dishes
                                    .filter(dish => dish.dishType === 'snack')
                                    .map(dish => (
                                        <li key={dish.id} > {dish.dishName}</li>
                                    ))}
                            </ul>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            )
        }));

        return <Tabs defaultActiveKey="0" items={tabs} />;
    };

    return (
        <>
            <Card className="m-2">
                <Calendar
                    className="custom-calendar"
                    locale={locale}
                    mode='month'
                    validRange={[dayjs().startOf('year'), dayjs().endOf('year')]}
                    onSelect={onSelect}
                    cellRender={dateCellRender}
                    disabledDate={(current) => current && (current.day() === 0 || current.day() === 6)}
                />
            </Card>
            <Modal
                title={`Thêm thực đơn cho ngày ${selectedDate ? selectedDate.format('DD-MM-YYYY') : ''}`}
                open={isModalAddMealVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Lưu"
                cancelText="Hủy"
                width={800}
            >
                <Form form={form} layout='horizontal'>
                    <Tabs defaultActiveKey="1" items={tabItems} />
                </Form>
            </Modal>
            <Modal
                title={`Thực đơn cho ngày ${selectedDate ? selectedDate.format('DD-MM-YYYY') : ''}`}
                open={isModalViewMealVisible}
                onCancel={handleCancel}
                footer={null}
                width={800}
            >
                {selectedMeal && renderViewMealTabs()}
            </Modal>
        </>
    );
};

export default MenuCalendar;