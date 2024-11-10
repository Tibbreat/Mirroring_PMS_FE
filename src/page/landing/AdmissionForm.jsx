import { Button, Card, Col, DatePicker, Form, Input, message, Row, Select, Spin } from "antd";
import React, { useState } from "react";
import dayjs from "dayjs";

const { Option } = Select;

export const AdmissionForm = ({ academicYear }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const renderFormItem = (name, label, placeholder, rules, component = <Input />, span = 8) => (
        <Col xs={24} sm={24} md={span}>
            <Form.Item name={name} label={label} rules={rules}>
                {React.cloneElement(component, { placeholder, disabled: loading })}
            </Form.Item>
        </Col>
    );

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        // Handle form submission here
        message.success('Đăng ký thành công');
    };

    const disabledDate = (current) => {
        // Can not select days after today
        return current && current > dayjs().endOf('day');
    };

    return (
        <>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Card title="Thông tin đăng ký" className="m-3">
                    <Card title="Thông tin trẻ" bordered={false} style={{ marginTop: 20 }}>
                        <Row gutter={16}>
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
                            {renderFormItem(
                                'childBirthDate',
                                'Ngày sinh',
                                'Chọn ngày sinh',
                                [{ required: true, message: 'Vui lòng chọn ngày sinh' }],
                                <DatePicker style={{ width: '100%' }} disabledDate={disabledDate} />
                            )}
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
                        </Row>
                        <Row gutter={16}>
                            {renderFormItem(
                                'birthAddress',
                                'Địa chỉ khai sinh',
                                'Nhập địa chỉ hiện tại (ghi rõ xã/phường, quận/huyện, tỉnh/thành phố) Ví dụ: 123/4 Đường ABC, Phường XYZ, Quận Thanh Xuân, Hà Nội',
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
                        </Row>
                        <Row gutter={16}>
                            {renderFormItem(
                                'childAddress',
                                'Địa chỉ hiện tại',
                                'Nhập địa chỉ hiện tại (ghi rõ xã/phường, quận/huyện, tỉnh/thành phố) Ví dụ: 123/4 Đường ABC, Phường XYZ, Quận Thanh Xuân, Hà Nội',
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
                        </Row>
                    </Card>
                    <Card title="Thông tin bố" bordered={false} style={{ marginTop: 20 }}>
                        <Row gutter={16}>
                            {renderFormItem(
                                ['father', 'fullName'],
                                'Họ và tên',
                                'Nhập tên bố',
                                [{ required: true, message: 'Vui lòng nhập tên bố' }]
                            )}
                            {renderFormItem(
                                ['father', 'phone'],
                                'Số điện thoại',
                                'Nhập số điện thoại bố',
                                [{ required: true, message: 'Vui lòng nhập số điện thoại bố' }]
                            )}
                            {renderFormItem(
                                ['father', 'idCardNumber'],
                                'Số CMND/CCCD',
                                'Nhập số CMND/CCCD bố',
                                [{ required: true, message: 'Vui lòng nhập số CMND/CCCD bố' }]
                            )}
                        </Row>
                    </Card>

                    <Card title="Thông tin mẹ" bordered={false} style={{ marginTop: 20 }}>
                        <Row gutter={16}>
                            {renderFormItem(
                                ['mother', 'fullName'],
                                'Họ và tên',
                                'Nhập tên mẹ',
                                [
                                    { required: true, message: 'Vui lòng nhập tên mẹ' },
                                    { pattern: /^[a-zA-ZÀ-ỹ\s]{3,50}$/, message: 'Tên phải từ 3 đến 50 ký tự, chỉ gồm chữ cái và khoảng trắng' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || value.trim().length !== 0) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Tên mẹ không được để trống'));
                                        },
                                    }),
                                ]
                            )}
                            {renderFormItem(
                                ['mother', 'phone'],
                                'Số điện thoại',
                                'Nhập số điện thoại mẹ',
                                [
                                    { required: true, message: 'Vui lòng nhập số điện thoại mẹ' },
                                    { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại phải có 10 đến 11 chữ số' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || value.trim().length !== 0) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Số điện thoại không được để trống'));
                                        },
                                    }),
                                ]
                            )}
                            {renderFormItem(
                                ['mother', 'idCardNumber'],
                                'Số CMND/CCCD',
                                'Nhập số CMND/CCCD mẹ',
                                [
                                    { required: true, message: 'Vui lòng nhập số CMND/CCCD mẹ' },
                                    { pattern: /^[0-9]{9,12}$/, message: 'Số CMND/CCCD phải có từ 9 đến 12 chữ số' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || value.trim().length !== 0) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Số CMND/CCCD không được để trống'));
                                        },
                                    }),
                                ]
                            )}
                        </Row>
                    </Card>
                    <Form.Item>
                        <Spin spinning={loading}>
                            <Button type="primary" htmlType="submit" style={{ width: '100%' }} disabled={loading}>
                                Nộp đơn đăng ký
                            </Button>
                        </Spin>
                    </Form.Item>
                </Card>
            </Form>
        </>
    );
};