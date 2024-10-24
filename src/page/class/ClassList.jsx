import { useCallback, useContext, useEffect, useState } from "react";
import { addClassAPI, getClassesAPI } from "../../services/services.class";
import { Pagination, Spin, Card, Row, Col, Input, Select, Button, Modal, Form, DatePicker, notification, message } from "antd";
import { getUserOpnionAPI } from "../../services/services.user";
import NoData from "../../component/no-data-page/NoData";
import { AuthContext } from "../../component/context/auth.context";
import moment from "moment";
import { ClassTable } from "../../component/table/ClassTable";

const { Option } = Select;
const { RangePicker } = DatePicker;

const ClassList = () => {
    const [classes, setClasses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [teachers, setTeachers] = useState([]);
    const [classManager, setClassManager] = useState([]);

    const { user } = useContext(AuthContext);

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

    const fetchTeachers = useCallback(async () => {
        try {
            const response = await getUserOpnionAPI("TEACHER");
            setTeachers(response.data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    }, []);

    const fetchClassManager = useCallback(async () => {
        try {
            const response = await getUserOpnionAPI("CLASS_MANAGER");
            setClassManager(response.data);
        } catch (error) {
            console.error('Error fetching class managers:', error);
        }
    }, []);

    useEffect(() => {
        fetchClasses(currentPage);
        fetchTeachers();
        fetchClassManager();
    }, [currentPage, fetchClasses, fetchTeachers, fetchClassManager]);

    const handleOk = async () => {

        const values = await form.validateFields();
        const [openingDay, closingDay] = values.dateRange || [];
        const payload = {
            ...values,
            openingDay: openingDay ? openingDay.format('YYYY-MM-DD') : null,
            closingDay: closingDay ? closingDay.format('YYYY-MM-DD') : null,
            createdBy: user.id,
            schoolYear: moment(openingDay).year() + ' - ' + moment(closingDay).year(),
        };
        console.log('Payload to send to BE:', payload);

        try {
            const response = await addClassAPI(payload);
            console.log('Response from BE:', response);
            fetchClasses(currentPage);
            setIsModalOpen(false);
            notification.success({
                message: "Thêm lớp thành công",
            });
            form.resetFields();
        } catch (error) {
            console.error('Error adding class:', error);
            notification.error({
                message: "Lỗi khi thêm lớp",
                description: error.message,
            });
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
                    <Select placeholder="Độ tuổi" style={{ width: '100%' }}>
                        <Option value="1 - 2">1 - 2 tuổi</Option>
                        <Option value="2 - 3">2 - 3 tuổi</Option>
                        <Option value="3 - 4">3 - 4 tuổi</Option>
                        <Option value="4 - 5">4 - 5 tuổi</Option>
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
                                rules={[
                                    { required: true, message: 'Vui lòng nhập tên lớp' },
                                    { pattern: /^[a-zA-Z0-9\s]{3,50}$/, message: 'Tên lớp phải từ 3 đến 50 ký tự, chỉ gồm chữ, số và khoảng trắng' }
                                ]}
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
                                <Select placeholder="Chọn lứa tuổi">
                                    <Select.Option value="1-2">1 - 2 tuổi</Select.Option>
                                    <Select.Option value="2-3">2 - 3 tuổi</Select.Option>
                                    <Select.Option value="3-4">3 - 4 tuổi</Select.Option>
                                    <Select.Option value="4-5">4 - 5 tuổi</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="dateRange"
                                label="Ngày khai giảng và ngày bế giảng"
                                rules={[{ required: true, message: 'Vui lòng chọn khoảng thời gian' }]}
                            >
                                <RangePicker
                                    style={{ width: '100%' }}
                                    disabledDate={(current) => {
                                        // Không cho chọn ngày hôm nay và 7 ngày kế tiếp
                                        return current && current.isBefore(moment().add(7, 'days').endOf('day'));
                                    }}
                                    format="DD/MM/YYYY"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="teacherId"
                                label="Chọn giáo viên"
                                rules={[{ required: true, message: 'Vui lòng chọn giáo viên' }]}
                            >
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="Chọn giáo viên"
                                >
                                    {teachers.map((teacher) => (
                                        <Option key={teacher.id} value={teacher.id}>
                                            {teacher.username}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="managerId"
                                label="Quản lý lớp"
                                rules={[{ required: true, message: 'Vui lòng chọn quản lý lớp' }]}
                            >
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="Nhập danh sách quản lý lớp"
                                >
                                    {classManager.map((manager) => (
                                        <Option key={manager.id} value={manager.id}>
                                            {manager.username}
                                        </Option>
                                    ))}
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