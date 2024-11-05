import { useCallback, useContext, useEffect, useState } from "react";
import { addClassAPI, getClassesAPI } from "../../services/services.class";
import { Pagination, Spin, Card, Row, Col, Input, Select, Button, Modal, Form, notification } from "antd";
import { getTeacherAvailableInYear, getUserOpnionAPI } from "../../services/services.user";
import NoData from "../../component/no-data-page/NoData";
import { AuthContext } from "../../component/context/auth.context";
import moment from "moment";
import { ClassTable } from "../../component/table/ClassTable";
import Title from "antd/es/typography/Title";

const { Option } = Select;

const ClassList = () => {
    const [classes, setClasses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAgeRange, setSelectedAgeRange] = useState(null);
    const [form] = Form.useForm();
    const [teachers, setTeachers] = useState([]);
    const [classManager, setClassManager] = useState([]);
    const { user } = useContext(AuthContext);
    const [className, setClassName] = useState('');

    const fetchClasses = useCallback(async (page, className, ageRange) => {
        setLoading(true);
        try {
            const response = await getClassesAPI(page, className, ageRange);
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
            const today = moment();
            const currentYear = today.year();
            const nextYear = currentYear + 1;
            const academicYear = `${currentYear}-${nextYear}`;
            const response = await getTeacherAvailableInYear(academicYear);
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
        fetchClasses(currentPage, className, selectedAgeRange);
        fetchTeachers();
        fetchClassManager();
    }, [currentPage, selectedAgeRange, fetchClasses, fetchTeachers, fetchClassManager]);

    const handleAgeRangeChange = (value) => {
        setSelectedAgeRange(value);
        fetchClasses(currentPage, className, value);
    };

    const handleClassNameChange = (event) => {
        const value = event.target.value;
        setClassName(value);
        fetchClasses(currentPage, value, selectedAgeRange);
    };

    const handleOk = async () => {
        try {
            const today = moment();
            const septemberFifth = moment(`${today.year()}-09-05`, "YYYY-MM-DD");

            if (today.isAfter(septemberFifth)) {
                notification.error({ message: "Đã quá ngày khai giảng" });
                return;
            }

            const values = await form.validateFields();
            const payload = {
                className: values.className,
                ageRange: values.ageRange,
                openingDay: `${today.year()}-09-05`,
                teacherId: values.teacherId,
                managerId: values.managerId,
                createdBy: user.id,
                schoolId: user.schoolId,
            };

            await addClassAPI(payload);
            fetchClasses(currentPage);
            fetchTeachers();
            setIsModalOpen(false);
            notification.success({ message: "Thêm lớp thành công" });
            form.resetFields();
        } catch (error) {
            console.error('Error adding class:', error);
            notification.error({ message: "Lỗi khi thêm lớp", description: error.message });
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const currentYear = moment().year();
    const nextYear = currentYear + 1;
    const academicYear = `${currentYear} - ${nextYear}`;
    const openingDate = `5-9-${currentYear}`;

    return (
        <Card className="m-2">
            <Row gutter={[16, 16]} justify="center" style={{ marginBottom: 20 }}>
                <Col xs={24} sm={8}>
                    <Select
                        placeholder="Độ tuổi"
                        style={{ width: '100%' }}
                        onChange={handleAgeRangeChange}
                        allowClear
                    >
                        <Option value="3-4">3 - 4 tuổi</Option>
                        <Option value="4-5">4 - 5 tuổi</Option>
                        <Option value="5-6">5 - 6 tuổi</Option>
                    </Select>
                </Col>
                <Col xs={24} sm={16}>
                    <Input
                        placeholder="Nhập tên lớp cần tìm"
                        onChange={handleClassNameChange}
                        value={className}
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
                <ClassTable data={classes} />
            ) : (
                <div className="d-flex justify-content-center align-items-center">
                    <NoData
                        title="Không có lớp nào"
                        subTitle="Danh sách lớp sẽ xuất hiện khi bạn thêm dữ liệu vào hệ thống"
                    />
                </div>
            )}
            <Modal
                title="Thêm lớp mới"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>Hủy</Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>Thêm</Button>
                ]}
                width={800}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Title level={5}>Năm học: {academicYear}</Title>
                        </Col>
                        <Col span={12}>
                            <Title level={5}>Ngày khai giảng: {openingDate}</Title>
                        </Col>
                    </Row>
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
                                <Select placeholder="Chọn lứa tuổi">
                                    <Option value="3-4">3 - 4 tuổi</Option>
                                    <Option value="4-5">4 - 5 tuổi</Option>
                                    <Option value="5-6">5 - 6 tuổi</Option>
                                </Select>
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
                                <Select placeholder="Chọn giáo viên" style={{ width: '100%' }}>
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
                                <Select placeholder="Chọn quản lý lớp" style={{ width: '100%' }}>
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