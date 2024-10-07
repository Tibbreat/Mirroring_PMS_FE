import { useCallback, useState, useEffect } from "react";
import NoData from "../../component/no-data-page/NoData";
import { ClassTable } from "../../component/table/ClassTable";
import { getClassesAPI } from "../../services/services.class";
import { Pagination, Spin, Card, Row, Col, Input, Select, Button, Modal, Form, DatePicker, Radio } from "antd";

const { Option } = Select;

const ClassList = () => {
    const [classes, setClasses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const fetchClasses = useCallback(async (page) => {
        setLoading(true);
        try {
            const response = await getClassesAPI(page, null, null);
            setClasses(response.data.listData);
            setTotal(response.data.total);
        } catch (error) {
            console.error('Error fetching classes:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchClasses(currentPage);
    }, [currentPage, fetchClasses]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            console.log('Form values:', values);
            // Add your logic to handle form submission here
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            console.error('Form validation failed:', error);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    return (
        <Card style={{ margin: 20 }}>
            <Row gutter={[16, 16]} justify="center" style={{ marginBottom: 20 }}>
                <Col xs={24} sm={8}>
                    <Select defaultValue="option 1" style={{ width: '100%' }}>
                        <Option value="option 1">Option 1</Option>
                        <Option value="option 2">Option 2</Option>
                    </Select>
                </Col>
                <Col xs={24} sm={16}>
                    <Input.Search
                        placeholder="Nhập tên lớp cần tìm"
                        enterButton
                        onSearch={(value) => console.log(value)}
                    />
                </Col>
            </Row>
            <Col span={24} style={{ marginBottom: 20, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" onClick={() => setIsModalOpen(true)}>Thêm lớp</Button>
            </Col>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <Spin size="large" />
                </div>
            ) : classes.length > 0 ? (
                <>
                    <ClassTable data={classes} />
                    <Pagination
                        current={currentPage}
                        total={total}
                        onChange={(page) => setCurrentPage(page)}
                        style={{ textAlign: 'center', marginTop: 20 }}
                    />
                </>
            ) : (
                <div className="d-flex justify-content-center align-items-center">
                    <NoData
                        title={"Không có lớp nào"}
                        subTitle={"Danh sách lớp sẽ xuất hiện khi bạn thêm dữ liệu vào hệ thống"}
                    />
                </div>
            )}
            <Modal
                title="Thêm lớp mới"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        Thêm
                    </Button>
                ]}
                width={800}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="className"
                                label="Tên lớp"
                                rules={[{ required: true, message: 'Vui lòng nhập tên lớp' }]}
                            >
                                <Input placeholder="Nhập tên lớp" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="ageRange"
                                label="Tuổi"
                                rules={[{ required: true, message: 'Vui lòng nhập tuổi' }]}
                            >
                                <Select
                                    defaultValue="1-2 tuổi"

                                    options={[
                                        {
                                            value: '1-2 tuổi',
                                            label: '1-2 tuổi',
                                        },
                                        {
                                            value: '2-3 tuổi',
                                            label: '2-3 tuổi',
                                        },
                                        {
                                            value: '3-4 tuổi',
                                            label: '3-4 tuổi',
                                        },
                                        {
                                            value: '4-5 tuổi',
                                            label: '4-5 tuổi',
                                        }
                                    ]}
                                />
                            </Form.Item>
                        </Col>


                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="openingDay"
                                label="Ngày khai giảng"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày khai giảng' }]}
                            >
                                <DatePicker style={{ width: '100%' }}
                                    format="DD-MM-YYYY" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="closingDay"
                                label="Ngày bế giảng"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày bế giảng' }]}
                            >
                                <DatePicker style={{ width: '100%' }}
                                    format="DD-MM-YYYY" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="teacherId"
                                label="Danh sách giáo viên"
                                rules={[{ required: true, message: 'Vui lòng nhập danh sách giáo viên' }]}
                            >
                                <Select mode="tags" style={{ width: '100%' }} placeholder="Nhập danh sách giáo viên">
                                    {/* Add options dynamically if needed */}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="managerId"
                                label="Quản lý lớp"
                                rules={[{ required: true, message: 'Vui lòng nhập quản lý lớp' }]}
                            >
                                <Select mode="tags" style={{ width: '100%' }} placeholder="Nhập danh sách giáo viên">

                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </Card>
    );
};

export default ClassList;