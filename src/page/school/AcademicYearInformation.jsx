import { EditOutlined } from "@ant-design/icons";
import { Button, Col, Form, InputNumber, Row, Select, DatePicker, Card, Modal, message } from "antd";
import Title from "antd/es/typography/Title";
import moment from "moment";
import { useCallback, useContext, useEffect, useState } from "react";
import { getAcademicYearsAPI } from "../../services/services.public";
import { getAcademicYearInformationAPI } from "../../services/service.school";
import { AuthContext } from "../../component/context/auth.context";

const { RangePicker } = DatePicker;
const { Option } = Select;

const AcademicYearInformation = () => {
    const [isEdit, setIsEdit] = useState(true);
    const [form] = Form.useForm();
    const [initialValues, setInitialValues] = useState({});
    const [academicYears, setAcademicYears] = useState([]);
    const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const { user } = useContext(AuthContext);

    const fetchAcademicYearInformation = async () => {
        try {
            const response = await getAcademicYearInformationAPI(user.schoolId, selectedAcademicYear);
            const data = response.data;

            if (data.enrollmentStartDate && data.enrollmentEndDate) {
                data.enrollmentPeriod = [
                    moment(data.enrollmentStartDate),
                    moment(data.enrollmentEndDate)
                ];
            }

            data.openingDay = moment(data.openingDay);
            setInitialValues(data);
            form.setFieldsValue(data);
        } catch (error) {
            console.error('Failed to fetch academic year:', error);
        }
    };

    const today = moment();
    const currentYear = today.year();
    const nextYear = currentYear + 1;
    const currentAcademicYear = `${currentYear}-${nextYear}`;

    const fetchAcademicYear = useCallback(async () => {
        try {
            const response = await getAcademicYearsAPI();
            setAcademicYears(response.data || []);
        } catch (error) {
            console.error("Error fetching academic years:", error);
        }
    }, []);

    const handleFinish = async (values) => {
        const { totalClassLevel1, totalStudentLevel1, totalClassLevel2, totalStudentLevel2, totalClassLevel3, totalStudentLevel3, totalEnrolledStudents } = values;
        const totalExpectedStudents = (totalClassLevel1 * totalStudentLevel1) + (totalClassLevel2 * totalStudentLevel2) + (totalClassLevel3 * totalStudentLevel3);

        if (totalExpectedStudents > totalEnrolledStudents) {
            message.error("Số lớp vượt quá chỉ tiêu tuyển sinh.");
            return;
        }
        try {
            setLoading(true);
            const values = await form.validateFields();
            if (JSON.stringify(values) === JSON.stringify(initialValues)) {
                message.info('Không có gì thay đổi');
                setIsEdit(true);
                setLoading(false);
                return;
            }
            setIsModalVisible(true);
        } catch (error) {
            console.error('Validation failed:', error);
        }
        setIsModalVisible(true);
    };

    const handleEditClick = () => {
        setIsEdit(!isEdit);
    };

    const handleCancelClick = () => {
        setIsEdit(true);
        setLoading(false);
        form.setFieldsValue(initialValues);
    };

    const handleConfirmSave = async () => {
        try {
            const values = form.getFieldsValue();
            console.log("Saving data:", values);
            setInitialValues(values);
            setIsEdit(true);
            message.success("Lưu thành công");
        } catch (error) {
            console.error('Failed to save:', error);
        } finally {
            setLoading(false);
            setIsModalVisible(false);
        }
    };

    const uniqueAcademicYears = Array.from(new Set([currentAcademicYear, ...academicYears]));

    const disableDatesOutsideCurrentYear = (current) => current && current.year() !== currentYear;

    useEffect(() => {
        fetchAcademicYear();
        setSelectedAcademicYear(currentAcademicYear);
    }, [fetchAcademicYear]);

    useEffect(() => {
        if (selectedAcademicYear) {
            fetchAcademicYearInformation();
        }
    }, [selectedAcademicYear]);

    return (
        <>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                    <Title level={5}>Thông tin năm học</Title>
                </Col>
                <Col xs={24} md={16}>
                    <Select
                        placeholder="Chọn năm học"
                        style={{ width: '100%' }}
                        defaultValue={currentAcademicYear}
                        onChange={(value) => setSelectedAcademicYear(value)}
                    >
                        {uniqueAcademicYears.map((year) => (
                            <Option key={year} value={year}>
                                {year}
                            </Option>
                        ))}
                    </Select>
                </Col>
            </Row>
            <Row justify="end" className="mb-3 mt-3">
                <Col>
                    <Button type="link" icon={<EditOutlined />} onClick={handleEditClick} hidden={!isEdit}>
                        Chỉnh sửa thông tin
                    </Button>
                </Col>
            </Row>

            <Form form={form} layout="horizontal" onFinish={handleFinish}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Chỉ tiêu tuyển sinh"
                            name="totalEnrolledStudents"
                            rules={[
                                { required: true, message: "Vui lòng nhập chỉ tiêu tuyển sinh cho năm học này" },
                                { type: "number", min: 1, message: "Chỉ tiêu tuyển sinh phải lớn hơn 0" },
                            ]}
                        >
                            <InputNumber disabled={isEdit} min={1} style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Khai giảng dự kiến"
                            name="openingDay"
                            rules={[
                                { required: true, message: "Vui lòng chọn ngày khai giảng cho năm học này" },
                            ]}
                        >
                            <DatePicker
                                disabled={isEdit}
                                style={{ width: "100%" }}
                                disabledDate={disableDatesOutsideCurrentYear}
                                format="YYYY-MM-DD"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                        <Card>
                            <Title level={5}>Lớp 3-4 tuổi</Title>
                            <Form.Item label="Số lớp mở dự kiến" name="totalClassLevel1">
                                <InputNumber disabled={isEdit} min={1} style={{ width: "100%" }} />
                            </Form.Item>
                            <Form.Item label="Sĩ số tối đa 1 lớp" name="totalStudentLevel1">
                                <InputNumber disabled={isEdit} min={1} style={{ width: "100%" }} />
                            </Form.Item>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card>
                            <Title level={5}>Lớp 4-5 tuổi</Title>
                            <Form.Item label="Số lớp mở dự kiến" name="totalClassLevel2">
                                <InputNumber disabled={isEdit} min={1} style={{ width: "100%" }} />
                            </Form.Item>
                            <Form.Item label="Sĩ số tối đa 1 lớp" name="totalStudentLevel2">
                                <InputNumber disabled={isEdit} min={1} style={{ width: "100%" }} />
                            </Form.Item>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card>
                            <Title level={5}>Lớp 5-6 tuổi</Title>
                            <Form.Item label="Số lớp mở dự kiến" name="totalClassLevel3">
                                <InputNumber disabled={isEdit} min={1} style={{ width: "100%" }} />
                            </Form.Item>
                            <Form.Item label="Sĩ số tối đa 1 lớp" name="totalStudentLevel3">
                                <InputNumber disabled={isEdit} min={1} style={{ width: "100%" }} />
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} className="mt-3">
                    <Col xs={24}>
                        <Form.Item
                            label="Thời gian nhận đơn nhập học dự tính"
                            name="enrollmentPeriod"
                            rules={[
                                { required: true, message: "Vui lòng chọn thời gian nhận đơn dự tính" },
                            ]}
                        >
                            <RangePicker disabled={isEdit} style={{ width: "100%" }} disabledDate={disableDatesOutsideCurrentYear} format="YYYY-MM-DD" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row justify="center">
                    <Button type="primary" htmlType="submit" hidden={isEdit} loading={loading} className='me-5'>
                        Lưu
                    </Button>
                    <Button type="default" htmlType="button" hidden={isEdit} onClick={handleCancelClick}>
                        Hủy
                    </Button>
                </Row>
            </Form>

            {/* Confirmation Modal */}
            <Modal
                title="Xác nhận lưu thông tin"
                open={isModalVisible}
                onOk={handleConfirmSave}
                onCancel={() => {
                    setIsModalVisible(false);
                    setLoading(false);  // Reset loading state when modal is canceled
                }}
                okText="Đồng ý"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn lưu thông tin đã thay đổi không?</p>
            </Modal>
        </>
    );
};

export default AcademicYearInformation;