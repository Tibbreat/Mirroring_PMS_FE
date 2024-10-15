import React, { useState, useEffect, useContext } from 'react';
import { Button, Card, Col, DatePicker, Divider, Form, Input, message, Row, Select } from 'antd';
import moment from 'moment';
import { addChildAPI } from '../../services/service.children'; // API để thêm trẻ
import { AuthContext } from '../../component/context/auth.context';
import UploadImage from '../../component/input/UploadImage';

const { Option } = Select;

const AddChildren = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const { user } = useContext(AuthContext);
    const [parents, setParents] = useState([{ id: Date.now(), fullName: '', idCardNumber: '', address: '', phone: '', isRepresentative: false }]);
    const [imageFile, setImageFile] = useState(null);
    const [fileList, setFileList] = useState([]); // Dùng để lưu file cho phụ huynh

    // Hàm để thêm phụ huynh
    const addParent = () => {
        setParents([...parents, { id: Date.now(), fullName: '', idCardNumber: '', address: '', phone: '', isRepresentative: false }]);
    };

    // Hàm để xóa phụ huynh
    const removeParent = (id) => {
        setParents(parents.filter((parent) => parent.id !== id));
    };

    const handleImageChange = (file) => {
        setImageFile(file);
    };

    const handleParentImageChange = (index, file) => {
        const newFileList = [...fileList];
        newFileList[index] = file;
        setFileList(newFileList);
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            // Chuẩn bị dữ liệu cho AddChildrenRequest
            const addChildrenRequest = {
                childName: values.childName,
                childAge: values.childAge,
                childBirthDate: values.childBirthDate.format('YYYY-MM-DD'),
                childAddress: values.childAddress,
                people: values.people,
                birthAddress: values.birthAddress,
                nationality: values.nationality,
                identificationNumber: values.identificationNumber,
                createdById: user.id, // ID của người tạo
                relationships: [
                    {
                        relationship: 'Bố',
                        isRepresentative: values.father.isRepresentative,
                        parent: {
                            fullName: values.father.fullName,
                            idCardNumber: values.father.idCardNumber,
                            address: values.father.address,
                            phone: values.father.phone,
                            role: 'PARENT', // Auto set role là PARENT
                        },
                    },
                    {
                        relationship: 'Mẹ',
                        isRepresentative: values.mother.isRepresentative,
                        parent: {
                            fullName: values.mother.fullName,
                            idCardNumber: values.mother.idCardNumber,
                            address: values.mother.address,
                            phone: values.mother.phone,
                            role: 'PARENT', // Auto set role là PARENT
                        },
                    },
                ],
            };
            const formData = new FormData();
            formData.append('childImage', imageFile);
            console.log(imageFile);// Thêm ảnh trẻ
            formData.append('fatherImage', fileList.father); // Thêm ảnh Bố
            formData.append('motherImage', fileList.mother); // Thêm ảnh Mẹ
            formData.append('addChildrenRequest', new Blob([JSON.stringify(addChildrenRequest)], { type: 'application/json' }));

            // Gọi API để thêm trẻ cùng với thông tin Bố và Mẹ
            const response = await addChildAPI(formData);

            message.success('Thêm học sinh thành công');
            form.resetFields(); // Reset form sau khi thêm thành công
            setFileList([]); // Reset fileList sau khi upload xong
            setImageFile(null); // Reset ảnh trẻ// Reset form sau khi thêm thành công
        } catch (error) {
            console.log(error);
            message.error('Lỗi khi thêm trẻ: ' + error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="container">
            <Card title="Thêm trẻ mới" style={{ marginTop: 20 }}>
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Row gutter={16}>
                        {/* Field Tên trẻ */}
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Tên trẻ"
                                name="childName"
                                rules={[{ required: true, message: 'Vui lòng nhập tên trẻ' }]}
                            >
                                <Input placeholder="Nhập tên trẻ" style={{ width: '80%' }} />
                            </Form.Item>
                        </Col>
                        {/* Field Ngày sinh */}
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Ngày sinh"
                                name="childBirthDate"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
                            >
                                <DatePicker
                                    format="DD-MM-YYYY"
                                    placeholder="Chọn ngày sinh"
                                    style={{ width: '80%' }} // Phóng to chiều cao DatePicker
                                />
                            </Form.Item>
                        </Col>
                        {/* Field Địa chỉ */}
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Địa chỉ"
                                name="childAddress"
                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                            >
                                <Input placeholder="Nhập địa chỉ" style={{ width: '80%' }} />
                            </Form.Item>
                        </Col>
                        {/* Field Nơi khai sinh */}
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Nơi khai sinh"
                                name="birthAddress"
                                rules={[{ required: true, message: 'Vui lòng nhập nơi khai sinh' }]}
                            >
                                <Input placeholder="Nhập nơi khai sinh" style={{ width: '80%' }} />
                            </Form.Item>
                        </Col>
                        {/* Field Dân tộc */}
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Dân tộc"
                                name="people"
                                rules={[{ required: true, message: 'Vui lòng nhập dân tộc' }]}
                            >
                                <Input placeholder="Nhập dân tộc" style={{ width: '80%' }} />
                            </Form.Item>
                        </Col>
                        {/* Field Quốc tịch */}
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Quốc tịch"
                                name="Nationality"
                                rules={[{ required: true, message: 'Vui lòng nhập quốc tịch' }]}
                            >
                                <Input placeholder="Nhập quốc tịch" style={{ width: '80%' }} />
                            </Form.Item>
                        </Col>
                        {/* Field Số định danh */}
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Số định danh"
                                name="identificationNumber"
                                rules={[{ required: true, message: 'Vui lòng nhập số định danh' }]}
                            >
                                <Input placeholder="Nhập số định danh của trẻ" style={{ width: '80%' }} />
                            </Form.Item>
                        </Col>
                        {/* Field Ảnh trẻ */}
                        <Col xs={24} md={12}>
                            <div className="col-4 d-flex justify-content-center align-items-center">
                                <UploadImage onImageChange={handleImageChange} />
                            </div>
                        </Col>
                    </Row>
                    <Divider />
                    <Card title="Thông tin phụ huynh" style={{ marginTop: 20 }}>
                        {/* Thông tin Bố */}
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Tên Bố"
                                    name={['father', 'fullName']}
                                    rules={[{ required: true, message: 'Vui lòng nhập tên Bố' }]}
                                >
                                    <Input placeholder="Nhập tên Bố" style={{ width: '80%' }} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Số định danh Bố"
                                    name={['father', 'idCardNumber']}
                                    rules={[{ required: true, message: 'Vui lòng nhập số định danh Bố' }]}
                                >
                                    <Input placeholder="Nhập số định danh Bố" style={{ width: '80%' }} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Address"
                                    name={['father', 'address']}
                                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ Bố' }]}
                                >
                                    <Input placeholder="Nhập địa chỉ Bố" style={{ width: '80%' }} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Phone"
                                    name={['father', 'phone']}
                                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                                >
                                    <Input placeholder="Nhập số điện thoại" style={{ width: '80%' }} />
                                </Form.Item>
                            </Col>
                            {/* Thông tin khác... */}
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Người đại diện"
                                    name={['father', 'isRepresentative']}
                                    rules={[{ required: true }]}
                                >
                                    <Select placeholder="Chọn" style={{ width: '80%' }}>
                                        <Option value={true}>Có</Option>
                                        <Option value={false}>Không</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        {/* Thông tin Mẹ */}
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Tên Mẹ"
                                    name={['mother', 'fullName']}
                                    rules={[{ required: true, message: 'Vui lòng nhập tên Mẹ' }]}
                                >
                                    <Input placeholder="Nhập tên Mẹ" style={{ width: '80%' }} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Số định danh Mẹ"
                                    name={['mother', 'idCardNumber']}
                                    rules={[{ required: true, message: 'Vui lòng nhập số định danh Mẹ' }]}
                                >
                                    <Input placeholder="Nhập số định danh Mẹ" style={{ width: '80%' }} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Address"
                                    name={['mother', 'address']}
                                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ Mẹ' }]}
                                >
                                    <Input placeholder="Nhập địa chỉ Mẹ" style={{ width: '80%' }} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Phone"
                                    name={['mother', 'phone']}
                                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                                >
                                    <Input placeholder="Nhập số điện thoại" style={{ width: '80%' }} />
                                </Form.Item>
                            </Col>
                            {/* Thông tin khác... */}
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Người đại diện"
                                    name={['mother', 'isRepresentative']}
                                    rules={[{ required: true }]}
                                >
                                    <Select placeholder="Chọn" style={{ width: '80%' }}>
                                        <Option value={true}>Có</Option>
                                        <Option value={false}>Không</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                    <Divider />
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Thêm trẻ
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default AddChildren;
