import { Card, Upload, Table, Button, Divider, message, Modal, Form, Input, Row, Col, Select, DatePicker } from "antd";
import { EditOutlined, InboxOutlined } from "@ant-design/icons";
import { useState } from "react";
import Title from "antd/es/typography/Title";
import dayjs from 'dayjs';
import { handleExcelData } from "../../services/service.children";

const { Dragger } = Upload;
const { Option } = Select;

const ImportExcelChildren = () => {
    const [fileList, setFileList] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [parentDetails, setParentDetails] = useState({ father: {}, mother: {} });
    const [editingChild, setEditingChild] = useState(null);
    const [form] = Form.useForm();

    const columns = [
        { title: "STT", dataIndex: "index", key: "index", align: "center" },
        { title: "Họ và Tên", dataIndex: "childName", key: "childName" },
        { title: "Ngày Sinh", dataIndex: "childBirthDate", key: "childBirthDate", align: "center" },
        { title: "Địa Chỉ Hiện Tại", dataIndex: "childAddress", key: "childAddress" },
        { title: "Nơi Sinh", dataIndex: "birthAddress", key: "birthAddress" },
        { title: "Quốc Tịch", dataIndex: "nationality", key: "nationality", align: "center" },
        { title: "Tôn Giáo", dataIndex: "religion", key: "religion", align: "center" },
        { title: "Giới Tính", dataIndex: "gender", key: "gender", align: "center", render: (text) => text === "male" ? "Nam" : "Nữ" },
        {
            title: "Thông Tin Phụ Huynh",
            key: "parentInfo",
            align: "center",
            render: (_, record) => (
                <Button type="link" onClick={() => showParentDetails(record.father, record.mother)}>
                    Xem
                </Button>
            )
        },
        {
            key: "action",
            align: "center",
            render: (_, record) => (
                <EditOutlined style={{ cursor: "pointer" }} className="m-2" onClick={() => handleEdit(record)} />
            )
        }
    ];

    const handleUploadChange = async (info) => {
        const newFileList = info.fileList.slice(-1);
        setFileList(newFileList);

        const file = newFileList[0]?.originFileObj;
        if (file) {
            try {
                const data = await handleExcelData(file);
                const dataWithIndex = data.map((item, index) => ({ ...item, index: index + 1, key: index + 1 }));
                setTableData(dataWithIndex);
                message.success("Tải lên và xử lý file thành công!");
            } catch (error) {
                message.error("Lỗi khi tải lên file!");
                console.error(error);
            }
        }
    };

    const showParentDetails = (father, mother) => {
        setParentDetails({ father, mother });
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setParentDetails({ father: {}, mother: {} });
    };

    const handleEdit = (record) => {
        setEditingChild(record);
        form.setFieldsValue({
            ...record,
            childBirthDate: dayjs(record.childBirthDate)
        });
        setIsEditModalVisible(true);
    };

    const handleEditModalClose = () => {
        setIsEditModalVisible(false);
        setEditingChild(null);
    };

    const handleSave = () => {
        form.validateFields().then((values) => {
            const updatedTableData = tableData.map((child) =>
                child.key === editingChild.key ? { ...child, ...values, childBirthDate: values.childBirthDate.format('YYYY-MM-DD') } : child
            );
            setTableData(updatedTableData);
            setIsEditModalVisible(false);
            setEditingChild(null);
            message.success("Cập nhật thông tin thành công!");
        }).catch((info) => {
            console.log('Validate Failed:', info);
        });
    };

    return (
        <div className="container">
            <Card className="mt-2">
                <Title level={5} className="mt-2">Nhập file dữ liệu</Title>
                <Dragger
                    fileList={fileList}
                    onChange={handleUploadChange}
                    beforeUpload={() => false}
                    multiple={false}
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Kéo thả file Excel vào đây để tải lên</p>
                    <p className="ant-upload-hint">
                        Hỗ trợ các file Excel (.xls, .xlsx)
                    </p>
                </Dragger>
                <Divider />
                <Title level={5} className="mt-2">Dữ liệu trẻ từ file Excel</Title>
                <Table
                    columns={columns}
                    dataSource={tableData}
                    pagination={false}
                />
            </Card>

            <Modal
                title="Thông tin Phụ Huynh"
                open={isModalVisible}
                onCancel={handleModalClose}
                footer={[
                    <Button key="close" onClick={handleModalClose}>
                        Đóng
                    </Button>
                ]}
            >
                <Title level={5}>Thông tin Cha</Title>
                <p><strong>Tên:</strong> {parentDetails.father.fullName}</p>
                <p><strong>CCCD:</strong> {parentDetails.father.idCardNumber}</p>
                <p><strong>Số điện thoại:</strong> {parentDetails.father.phone}</p>

                <Divider />

                <Title level={5}>Thông tin Mẹ</Title>
                <p><strong>Tên:</strong> {parentDetails.mother.fullName}</p>
                <p><strong>CCCD:</strong> {parentDetails.mother.idCardNumber}</p>
                <p><strong>Số điện thoại:</strong> {parentDetails.mother.phone}</p>
            </Modal>

            <Modal
                title="Chỉnh sửa thông tin trẻ"
                open={isEditModalVisible}
                onCancel={handleEditModalClose}
                onOk={handleSave}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="childName"
                                label="Tên trẻ"
                                rules={[{ required: true, message: 'Vui lòng nhập tên trẻ' }]}
                            >
                                <Input placeholder="Nhập tên trẻ" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="childBirthDate"
                                label="Ngày sinh"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
                            >
                                <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày sinh" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="gender"
                                label="Giới tính"
                                rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                            >
                                <Select placeholder="Chọn giới tính">
                                    <Option value="Nam">Nam</Option>
                                    <Option value="Nữ">Nữ</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="nationality"
                                label="Quốc tịch"
                                rules={[{ required: true, message: 'Vui lòng nhập quốc tịch' }]}
                            >
                                <Input placeholder="Nhập quốc tịch" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="religion"
                                label="Tôn giáo"
                                rules={[{ required: true, message: 'Vui lòng nhập tôn giáo' }]}
                            >
                                <Input placeholder="Nhập tôn giáo" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="birthAddress"
                                label="Nơi sinh"
                                rules={[{ required: true, message: 'Vui lòng nhập nơi sinh' }]}
                            >
                                <Input placeholder="Nhập nơi sinh" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24}>
                            <Form.Item
                                name="childAddress"
                                label="Địa chỉ hiện tại"
                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ hiện tại' }]}
                            >
                                <Input placeholder="Nhập địa chỉ hiện tại" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Card title="Thông tin bố" bordered={false} style={{ marginTop: 20 }}>
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name={['father', 'fullName']}
                                    label="Họ và tên"
                                    rules={[{ required: true, message: 'Vui lòng nhập tên bố' }]}
                                >
                                    <Input placeholder="Nhập tên bố" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name={['father', 'phone']}
                                    label="Số điện thoại"
                                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại bố' }]}
                                >
                                    <Input placeholder="Nhập số điện thoại bố" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name={['father', 'idCardNumber']}
                                    label="Số CMND/CCCD"
                                    rules={[{ required: true, message: 'Vui lòng nhập số CMND/CCCD bố' }]}
                                >
                                    <Input placeholder="Nhập số CMND/CCCD bố" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <Card title="Thông tin mẹ" bordered={false} style={{ marginTop: 20 }}>
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name={['mother', 'fullName']}
                                    label="Họ và tên"
                                    rules={[{ required: true, message: 'Vui lòng nhập tên mẹ' }]}
                                >
                                    <Input placeholder="Nhập tên mẹ" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name={['mother', 'phone']}
                                    label="Số điện thoại"
                                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại mẹ' }]}
                                >
                                    <Input placeholder="Nhập số điện thoại mẹ" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name={['mother', 'idCardNumber']}
                                    label="Số CMND/CCCD"
                                    rules={[{ required: true, message: 'Vui lòng nhập số CMND/CCCD mẹ' }]}
                                >
                                    <Input placeholder="Nhập số CMND/CCCD mẹ" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                </Form>
            </Modal>
        </div>
    );
};

export default ImportExcelChildren;