import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Select, Card, Row, Col, message, Spin } from 'antd';
import { addChildren } from '../../services/service.children';
import UploadImage from '../../component/input/UploadImage';
import { AuthContext } from '../../component/context/auth.context';
import { getClassList } from '../../services/services.class';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const AddChildren = () => {
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState(null);
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [classList, setClassList] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const navigate = useNavigate();
    const handleImageChange = (file) => {
        setImageFile(file);
    };

    useEffect(() => {
        const today = dayjs();
        const currentYear = today.year();
        const nextYear = currentYear + 1;
        const academicYear = `${currentYear}-${nextYear}`;
        const fetchClasses = async () => {
            try {
                const response = await getClassList(academicYear);
                setClassList(response.data);
            } catch (error) {
                message.error('Không thể tải danh sách lớp');
            }
        };
        fetchClasses();
    }, []);

    const onFinish = async (values) => {
        const formattedValues = {
            ...values,
            childBirthDate: values.childBirthDate ? values.childBirthDate.format('YYYY-MM-DD') : null,
            createdBy: user.id,
            classId: selectedClass,
        };

        const formData = new FormData();
        formData.append('children', new Blob([JSON.stringify(formattedValues)], { type: 'application/json' }));

        if (!imageFile) {
            message.error('Vui lòng chọn ảnh');
        } else {
            formData.append('image', imageFile);
            setLoading(true);
            try {
                console.log(formData);
                const response = await addChildren(formData);
                console.log(response);
                message.success('Thêm trẻ thành công!');
                form.resetFields();
                setImageFile(null);
                setSelectedClass(null);
                navigate(`/pms/manage/children/${response.data.id}`);
            } catch (error) {
                console.error('Error:', error);
                message.error('Có lỗi xảy ra!');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleClassChange = (value) => {
        setSelectedClass(value);
    };

    const disabledDate = (current) => {
        return current && current > dayjs().endOf('day');
    };

    const renderFormItem = (name, label, placeholder, rules, component = <Input />, span = 8) => (
        <Col xs={24} md={span}>
            <Form.Item name={name} label={label} rules={rules}>
                {React.cloneElement(component, { placeholder, disabled: loading })}
            </Form.Item>
        </Col>
    );

    return (
        <div className="container" style={{ padding: '24px' }}>
            <Card title="Thêm trẻ mới" bordered={false}>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row gutter={16}>
                        <Col xs={24} md={8}>
                            <Form.Item name="image">
                                <UploadImage onImageChange={handleImageChange} disabled={loading} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={16}>
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
                                    'nationality',
                                    'Quốc tịch',
                                    'Nhập quốc tịch',
                                    [
                                        { required: true, message: 'Vui lòng nhập quốc tịch' },
                                        { pattern: /^[a-zA-ZÀ-ỹ\s]{3,20}$/, message: 'Quốc tịch phải từ 3 đến 20 ký tự, chỉ gồm chữ cái và khoảng trắng' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || value.trim().length !== 0) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Quốc tịch không được để trống'));
                                            },
                                        }),
                                    ],
                                    <Input />,
                                    12
                                )}
                                {renderFormItem(
                                    'religion',
                                    'Tôn giáo',
                                    'Nhập tôn giáo',
                                    [
                                        { required: true, message: 'Vui lòng nhập tôn giáo' },
                                        { pattern: /^[a-zA-ZÀ-ỹ\s]{3,20}$/, message: 'Tôn giáo phải từ 3 đến 20 ký tự, chỉ gồm chữ cái và khoảng trắng' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || value.trim().length !== 0) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Tôn giáo không được để trống'));
                                            },
                                        }),
                                    ],
                                    <Input />,
                                    12
                                )}
                            </Row>
                            <Row gutter={16}>
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
                            </Row>
                            <Row gutter={16}>
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
                            </Row>
                        </Col>
                    </Row>

                    {/* Thông tin bố mẹ */}
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
                    <Card title="Chọn Lớp" bordered={false} style={{ marginTop: 20 }}>
                        <Row gutter={16}>
                            <Col xs={24} md={24}>
                                <Form.Item
                                    name="classId"
                                    label="Chọn Lớp"
                                    rules={[{ required: true, message: 'Vui lòng chọn lớp' }]}
                                >
                                    <Select
                                        placeholder="Chọn lớp cho trẻ"
                                        loading={!classList.length && loading}
                                        disabled={loading}
                                        onChange={handleClassChange}
                                    >
                                        {classList.map((classItem, index) => (
                                            <Option key={index} value={classItem.id}>
                                                {classItem.className} - Giáo viên: {classItem.teacherName} - Độ tuổi: {classItem.ageRange}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                    <Form.Item>
                        <Spin spinning={loading}>
                            <Button type="primary" htmlType="submit" style={{ width: '100%' }} disabled={loading}>
                                Thêm trẻ em
                            </Button>
                        </Spin>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default AddChildren;