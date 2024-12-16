import { useCallback, useContext, useEffect, useState } from "react";
import { addClassAPI, getClassesAPI } from "../../services/services.class";
import { Card, Row, Col, Input, Select, Button, Modal, Form, message } from "antd";
import { getTeacherAvailableInYear, getUserOpnionAPI } from "../../services/services.user";
import NoData from "../../component/no-data-page/NoData";
import { AuthContext } from "../../component/context/auth.context";
import dayjs from "dayjs";
import { ClassTable } from "../../component/table/ClassTable";
import Title from "antd/es/typography/Title";
import { getAcademicYearsAPI } from "../../services/services.public";
import Loading from "../common/Loading";

const { Option } = Select;

const ClassList = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [teachers, setTeachers] = useState([]);
    const [classManager, setClassManager] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    const { user } = useContext(AuthContext);

    const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
    const currentYear = dayjs().year();
    const nextYear = currentYear + 1;
    const academicYear = `${currentYear}-${nextYear}`;
    const openingDate = `5-9-${currentYear}`;

    const fetchClasses = async (year) => {
        setLoading(true);
        try {
            const response = await getClassesAPI(year);
            setClasses(response.data);
        } catch (error) {
            console.error('Error fetching classes:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchModalData = useCallback(async () => {
        try {
            const teacherData = await getTeacherAvailableInYear(academicYear);
            setTeachers(teacherData.data);

            const academicYearData = await getAcademicYearsAPI();
            setAcademicYears(academicYearData.data);

            const classManagerData = await getUserOpnionAPI("CLASS_MANAGER");
            setClassManager(classManagerData.data);
        } catch (error) {
            console.error('Error fetching modal data:', error);
        }
    }, [academicYear]);

    useEffect(() => {
        fetchClasses(selectedAcademicYear || academicYear);
    }, [selectedAcademicYear, academicYear]);

    useEffect(() => {
        fetchModalData();
    }, [fetchModalData]);

    const handleOk = async () => {
        try {
            const today = dayjs();
            const septemberFifth = dayjs(`${today.year()}-09-05`, "YYYY-MM-DD");

            // if (today.isAfter(septemberFifth)) {
            //     message.error("Đã quá ngày khai giảng");
            //     return;
            // }

            const values = await form.validateFields();
            const payload = {
                className: values.className,
                ageRange: values.ageRange,
                openingDay: `${today.year()}-09-05`,
                teacherId: values.teacherId,
                managerId: values.managerId,
                createdBy: user.id,
                schoolId: user.schoolId,
                academicYear: academicYear,
            };

            await addClassAPI(payload);
            fetchClasses(academicYear);
            setIsModalOpen(false);
            message.success("Thêm lớp thành công");
            form.resetFields();
        } catch (error) {
            console.error("Error adding class:", error);
            message.error("Thêm lớp thất bại: " + error.data.data);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    return (
        <Card className="m-2">
            <Row gutter={[16, 16]} justify="between" className="m-2">
                <Col span={12}>
                    <Select
                        placeholder="Năm học"
                        style={{ width: '100%' }}
                        onChange={(value) => setSelectedAcademicYear(value)}
                        defaultValue={academicYear}
                    >
                        {academicYears.map((year) => (
                            <Option key={year} value={year}>
                                {year}
                            </Option>
                        ))}
                    </Select>
                </Col>
                {(user.role === "ADMIN") && (
                    <Col span={12} style={{ display: "flex", justifyContent: "end" }}>
                        <Button type="primary" onClick={() => setIsModalOpen(true)}>Thêm lớp</Button>
                    </Col>
                )}

            </Row>

            {loading ? (
                <Loading />
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
                                rules={[
                                    { required: true, message: 'Vui lòng nhập tên lớp' },
                                    {
                                        validator: (_, value) =>
                                            value && value.trim() ? Promise.resolve() : Promise.reject('Tên lớp không được chỉ chứa khoảng trắng'),
                                    },
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
                                <Select placeholder="Chọn tuổi" style={{ width: '100%' }}>
                                    <Option value="3-4">3-4 tuổi</Option>
                                    <Option value="4-5">4-5 tuổi</Option>
                                    <Option value="5-6">5-6 tuổi</Option>
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
