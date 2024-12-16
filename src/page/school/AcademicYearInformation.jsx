import { EditOutlined, PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, InputNumber, Row, Select, DatePicker, Card, Modal, message, Input, Divider } from "antd";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";
import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../component/context/auth.context";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getAcademicYearInformationAPI, updateAcademicInformation } from "../../services/service.school";
import { getAcademicYearsAPI } from "../../services/services.public";

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
    const [transformedValues, setTransformedValues] = useState(null);

    const { user } = useContext(AuthContext);

    const fetchAcademicYearInformation = async () => {
        try {
            const response = await getAcademicYearInformationAPI(selectedAcademicYear);
            const data = response.data;

            if (data.onlineEnrollmentStartDate && data.onlineEnrollmentEndDate) {
                data.enrollmentPeriodOnline = [
                    dayjs(data.onlineEnrollmentStartDate),
                    dayjs(data.onlineEnrollmentEndDate)
                ];
            }

            if (data.offlineEnrollmentStartDate && data.offlineEnrollmentEndDate) {
                data.enrollmentPeriodOffline = [
                    dayjs(data.offlineEnrollmentStartDate),
                    dayjs(data.offlineEnrollmentEndDate)
                ];
            }

            data.openingDay = dayjs(data.openingDay);
            data.closingDay = dayjs(data.closingDay);
            data.admissionDocuments = data.admissionFiles.map(file => ({
                document: file.fileName,
                note: file.note
            }));

            setInitialValues(data);
            form.setFieldsValue(data);
        } catch (error) {
            console.error('Failed to fetch academic year:', error);
        }
    };

    const handleFinish = async (values) => {
        const {
            totalClassLevel1,
            totalStudentLevel1,
            totalClassLevel2,
            totalStudentLevel2,
            totalClassLevel3,
            totalStudentLevel3,
            totalEnrolledStudents,
            enrollmentPeriodOnline,
            enrollmentPeriodOffline,
            note,
            admissionDocuments
        } = values;

        const totalExpectedStudents =
            (totalClassLevel1 * totalStudentLevel1) +
            (totalClassLevel2 * totalStudentLevel2) +
            (totalClassLevel3 * totalStudentLevel3);

        if (totalExpectedStudents > totalEnrolledStudents) {
            message.error("Số lớp vượt quá chỉ tiêu tuyển sinh.");
            return;
        }

        const transformedValues = {
            academicYear: selectedAcademicYear,
            openingDay: dayjs(values.openingDay).format('YYYY-MM-DD'),
            closingDay: dayjs(values.closingDay).format('YYYY-MM-DD'),
            totalClassLevel1,
            totalStudentLevel1,
            totalClassLevel2,
            totalStudentLevel2,
            totalClassLevel3,
            totalStudentLevel3,
            totalEnrolledStudents,
            onlineEnrollmentStartDate: dayjs(enrollmentPeriodOnline[0]).format('YYYY-MM-DD'),
            onlineEnrollmentEndDate: dayjs(enrollmentPeriodOnline[1]).format('YYYY-MM-DD'),
            offlineEnrollmentStartDate: dayjs(enrollmentPeriodOffline[0]).format('YYYY-MM-DD'),
            offlineEnrollmentEndDate: dayjs(enrollmentPeriodOffline[1]).format('YYYY-MM-DD'),
            note,
            schoolId: user.schoolId,
            admissionFiles: admissionDocuments.map(doc => ({
                fileName: doc.document,
                note: doc.note
            }))
        };

        setTransformedValues(transformedValues);
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
            setLoading(true);
            await updateAcademicInformation(transformedValues);
            fetchAcademicYearInformation();
            setIsEdit(true);
            message.success(`Cập nhật thông tin tuyển sinh năm học ${selectedAcademicYear} thành công`);
        } catch (error) {
            console.error('Failed to save:', error);
            message.error("Cập nhật thông tin thất bại. Vui lòng thử lại.");
        } finally {
            setLoading(false);
            setIsModalVisible(false);
        }
    };

    const today = dayjs();
    const currentYear = today.year();
    const nextYear = currentYear + 1;
    const currentAcademicYear = `${currentYear}-${nextYear}`;
    const fifthSeptember = dayjs(`${currentYear}-09-05`);

    const uniqueAcademicYears = Array.from(new Set([currentAcademicYear, ...academicYears]));

    const disableDatesOutsideCurrentYear = (current) => current && current.year() !== currentYear;

    const fetchAcademicYear = useCallback(async () => {
        try {
            const response = await getAcademicYearsAPI();
            setAcademicYears(response.data || []);
        } catch (error) {
            console.error("Error fetching academic years:", error);
        }
    }, []);

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
                    {selectedAcademicYear === currentAcademicYear && isEdit && !today.isAfter(fifthSeptember) && (
                        <Button type="link" icon={<EditOutlined />} onClick={handleEditClick}>
                            Chỉnh sửa thông tin
                        </Button>
                    )}
                </Col>
            </Row>


            <Form form={form} layout="horizontal" onFinish={handleFinish}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={24}>
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
                        <Form.Item
                            label="Bế giảng dự kiến"
                            name="closingDay"
                            rules={[
                                { required: true, message: "Vui lòng chọn ngày bế giảng cho năm học này" },
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
                <Divider />
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                        <Card>
                            <Title level={5}>Lớp 3-4 tuổi</Title>
                            <Form.Item
                                label="Số lớp mở dự kiến"
                                name="totalClassLevel1"
                                rules={[{ required: true, message: "Vui lòng nhập số lớp mở dự kiến" }]}
                            >
                                <InputNumber disabled={isEdit} min={1} style={{ width: "100%" }} />
                            </Form.Item>
                            <Form.Item
                                label="Sĩ số tối đa 1 lớp"
                                name="totalStudentLevel1"
                                rules={[{ required: true, message: "Vui lòng nhập sĩ số tối đa 1 lớp" }]}
                            >
                                <InputNumber disabled={isEdit} min={1} style={{ width: "100%" }} />
                            </Form.Item>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card>
                            <Title level={5}>Lớp 4-5 tuổi</Title>
                            <Form.Item
                                label="Số lớp mở dự kiến"
                                name="totalClassLevel2"
                                rules={[{ required: true, message: "Vui lòng nhập số lớp mở dự kiến" }]}
                            >
                                <InputNumber disabled={isEdit} min={1} style={{ width: "100%" }} />
                            </Form.Item>
                            <Form.Item
                                label="Sĩ số tối đa 1 lớp"
                                name="totalStudentLevel2"
                                rules={[{ required: true, message: "Vui lòng nhập sĩ số tối đa 1 lớp" }]}
                            >
                                <InputNumber disabled={isEdit} min={1} style={{ width: "100%" }} />
                            </Form.Item>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card>
                            <Title level={5}>Lớp 5-6 tuổi</Title>
                            <Form.Item
                                label="Số lớp mở dự kiến"
                                name="totalClassLevel3"
                                rules={[{ required: true, message: "Vui lòng nhập số lớp mở dự kiến" }]}
                            >
                                <InputNumber disabled={isEdit} min={1} style={{ width: "100%" }} />
                            </Form.Item>
                            <Form.Item
                                label="Sĩ số tối đa 1 lớp"
                                name="totalStudentLevel3"
                                rules={[{ required: true, message: "Vui lòng nhập sĩ số tối đa 1 lớp" }]}
                            >
                                <InputNumber disabled={isEdit} min={1} style={{ width: "100%" }} />
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>
                <Divider />
                <Row gutter={[16, 16]} className="mt-3">
                    <Title level={5}>Thời gian tuyển sinh</Title>
                </Row>
                <Row gutter={[16, 16]} className="mt-3">
                    <Col xs={24} md={24}>
                        <Form.Item
                            label="Thời gian nhận đơn nhập học trực tuyến"
                            name="enrollmentPeriodOnline"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn thời gian nhận đơn dự tính",
                                },
                            ]}
                        >
                            <RangePicker
                                disabled={isEdit}
                                style={{ width: "100%" }}
                                disabledDate={disableDatesOutsideCurrentYear}
                                format="YYYY-MM-DD"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24}>
                        <Form.Item
                            label="Thời gian nhận đơn nhập học trực tiếp"
                            name="enrollmentPeriodOffline"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn thời gian nhận đơn dự tính",
                                },
                            ]}
                        >
                            <RangePicker
                                disabled={isEdit}
                                style={{ width: "100%" }}
                                disabledDate={disableDatesOutsideCurrentYear}
                                format="YYYY-MM-DD"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} className="mt-3">
                    <Title level={5}>Hồ sơ nhập học</Title>
                </Row>
                <Form.List name="admissionDocuments">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, fieldKey, ...restField }) => (
                                <Row key={key} gutter={[16, 16]}>
                                    <Col xs={10}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'document']}
                                            fieldKey={[fieldKey, 'document']}
                                            rules={[
                                                { required: true, message: 'Vui lòng nhập tên hồ sơ' },
                                                {
                                                    validator: (_, value) =>
                                                        value && value.trim()
                                                            ? Promise.resolve()
                                                            : Promise.reject('Tên hồ sơ không được chỉ chứa khoảng trắng'),
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Tên hồ sơ" disabled={isEdit} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={10}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'note']}
                                            fieldKey={[fieldKey, 'note']}
                                        >
                                            <Input placeholder="Ghi chú" disabled={isEdit} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={4}>
                                        <MinusCircleOutlined
                                            onClick={() => remove(name)}
                                            style={{ display: isEdit ? 'none' : 'inline-block' }}
                                        />
                                    </Col>
                                </Row>
                            ))}
                            <Row>
                                <Col xs={24}>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        block
                                        icon={<PlusOutlined />}
                                        style={{ display: isEdit ? 'none' : 'inline-block' }}
                                    >
                                        Thêm hồ sơ
                                    </Button>
                                </Col>
                            </Row>
                        </>
                    )}
                </Form.List>
                <Row gutter={[16, 16]} className="mt-3">
                    <Title level={5}>Ghi chú</Title>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col xs={24}>
                        <Form.Item name="note">
                            <CKEditor
                                editor={ClassicEditor}
                                data={initialValues.note || ''}
                                disabled={isEdit}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    form.setFieldsValue({ note: data });
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify="center" className="mt-3">
                    <Button type="primary" htmlType="submit" hidden={isEdit} loading={loading} className='me-5'>
                        Lưu
                    </Button>
                    <Button type="default" htmlType="button" hidden={isEdit} onClick={handleCancelClick}>
                        Hủy
                    </Button>
                </Row>
            </Form>

            <Modal
                title="Xác nhận lưu thông tin"
                open={isModalVisible}
                onOk={handleConfirmSave}
                onCancel={() => {
                    setIsModalVisible(false);
                    setLoading(false);
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