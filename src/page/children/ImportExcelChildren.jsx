import { Card, Upload, Table, Button, Divider, message, Modal, Form, Input, Row, Col, Select, DatePicker, Tag } from "antd";
import { DeleteOutlined, EditOutlined, InboxOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import Title from "antd/es/typography/Title";
import dayjs from 'dayjs';
import { handleExcelData, saveChildrenFromExcel } from "../../services/service.children";
import { getClassList } from "../../services/services.class";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const { Dragger } = Upload;
const { Option } = Select;

const ImportExcelChildren = () => {
    const [fileList, setFileList] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [parentDetails, setParentDetails] = useState({ father: {}, mother: {} });
    const [editingChild, setEditingChild] = useState(null);
    const [classAvailable, setClassAvailable] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [isSaveLoading, setIsSaveLoading] = useState(false);
    const [form] = Form.useForm();

    const navigate = useNavigate();
    const columns = [
        { title: "STT", dataIndex: "index", key: "index", align: "center" },
        { title: "Họ và Tên", dataIndex: "childName", key: "childName" },
        { title: "Ngày Sinh", dataIndex: "childBirthDate", key: "childBirthDate", align: "center", },
        {
            title: "Địa Chỉ Hiện Tại", dataIndex: "childAddress", key: "childAddress",
            render: (text) => {
                if (text.length > 15) {
                    return text.substring(0, 15) + '...';
                } else {
                    return text;
                }
            }
        },
        {
            title: "Nơi Sinh", dataIndex: "birthAddress", key: "birthAddress",
            render: (text) => {
                if (text.length > 15) {
                    return text.substring(0, 15) + '...';
                } else {
                    return text;
                }
            }
        },
        { title: "Quốc Tịch", dataIndex: "nationality", key: "nationality", align: "center" },
        { title: "Giới Tính", dataIndex: "gender", key: "gender", align: "center", render: (text) => text === "male" ? "Nam" : "Nữ" },
        {
            title: "Khuyết tật", dataIndex: "isDisabled", key: "isDisabled", align: "center",
            render: (text) => text ?
                <Tag color="red"> Có </Tag> : <Tag color="green"> Không </Tag>
        },
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
                <>
                    <EditOutlined style={{ cursor: "pointer" }} className="m-2" onClick={() => handleEdit(record)} />
                    <DeleteOutlined style={{ cursor: "pointer", color: 'red' }} onClick={() => handleDelete(record)} />
                </>

            )
        }
    ];

    const handleDelete = (record) => {
        const updatedData = tableData.filter((item) => item.key !== record.key);
        setTableData(updatedData);
        message.success("Đã xóa thành công!");
    };

    const handleUploadChange = async (info) => {
        const newFileList = info.fileList.slice(-1);
        // setFileList(newFileList);

        const file = newFileList[0]?.originFileObj;
        if (file) {
            try {
                const data = await handleExcelData(file);
                const dataWithIndex = data.map((item, index) => ({ ...item, index: index + 1, key: index + 1 }));
                setTableData(dataWithIndex);
                message.success("Tải lên và xử lý file thành công!");
            } catch (error) {
                message.error("Lỗi khi tải lên file! Hãy kiểm tra lại file và thử lại.");
                setTableData([]);
                console.error(error);
            }
        }
    };

    const fetchClassAvailable = async () => {
        try {
            const today = moment();
            const currentYear = today.year();
            const nextYear = currentYear + 1;
            const academicYear = `${currentYear}-${nextYear}`;
            const response = await getClassList(academicYear);
            setClassAvailable(response.data);
        } catch (error) {
            console.error(error);
            setClassAvailable([]);
        }
    };

    useEffect(() => {
        fetchClassAvailable();
    }, []);

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

    const handleClassChange = (value) => {
        setSelectedClass(value);
    };

    const handleConfirm = async () => {
        setIsSaveLoading(true);
        try {
            const payload = tableData.map((item) => ({
                ...item,
                classId: selectedClass,
            }));
            console.log(payload);
            await saveChildrenFromExcel(payload);
            message.success(`Đã thêm ${tableData.length} trẻ vào lớp thành công!`);
            setIsConfirmModalVisible(false);
            navigate(`/pms/manage/class/${selectedClass}`);
        } catch (error) {
            console.log("Error:", error.status);
            console.log("Error:", error.data);

            if (error.status === 404) {
                message.error(error.data.data);
            } else {
                message.error("Có lỗi xảy ra khi thêm trẻ vào lớp");
            }
        } finally {
            setIsSaveLoading(false);
        }
    };


    const handleSaveButtonClick = () => {
        if (!selectedClass) {
            message.warning("Vui lòng chọn lớp trước khi lưu");
        } else {
            setIsConfirmModalVisible(true);
        }
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
                <Row justify="space-between" align="middle" className="mb-3">
                    <Col span={12}>
                        <span>Số lượng trẻ: {tableData.length}</span>
                    </Col>
                    <Col span={12}>
                        <Select
                            placeholder="Chọn lớp"
                            style={{ width: '100%' }}
                            onChange={handleClassChange}
                            allowClear>
                            {classAvailable.map((classItem) => (
                                <Option key={classItem.id} value={classItem.id}>
                                    {classItem.className}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
                <Table
                    columns={columns}
                    dataSource={tableData}
                    pagination={false}
                />
                <Row justify="center" className="mt-3">
                    <Button type="primary" onClick={handleSaveButtonClick} disabled={tableData.length == 0}>Lưu</Button>
                </Row>
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
                                    <Option value="male">Nam</Option>
                                    <Option value="female">Nữ</Option>
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

            <Modal
                title="Xác nhận"
                open={isConfirmModalVisible}
                onCancel={() => setIsConfirmModalVisible(false)}
                onOk={handleConfirm}
                okText="Xác nhận"
                cancelText="Hủy"
                confirmLoading={isSaveLoading}
            >
                <p>Bạn có chắc chắn muốn thêm toàn bộ trẻ vào lớp đã chọn không?</p>
            </Modal>
        </div>
    );
};

export default ImportExcelChildren;