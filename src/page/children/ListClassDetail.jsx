import { Button, Col, Modal, Row, Table, Tag, message } from "antd";
import { getClassesBaseOnStudentId, getClassListToTransfer } from "../../services/services.class";
import Title from "antd/es/typography/Title";
import { useContext, useEffect, useState } from "react";
import dayjs from 'dayjs';
import { transferClass } from "../../services/service.children";
import { AuthContext } from "../../component/context/auth.context";

export const ListClassDetail = ({ id }) => {
    const [classes, setClasses] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [oldClass, setOldClass] = useState(null);
    const [classList, setClassList] = useState([]);
    const { user } = useContext(AuthContext);
    // Fetch classes for the specific student
    const fetchClassData = async (id) => {
        try {
            const response_class = await getClassesBaseOnStudentId(id);
            setClasses(response_class.data);
        } catch (error) {
            console.error('Error fetching children data:', error);
        }
    };

    // Fetch available classes for transfer
    const fetchClasses = async () => {
        const today = dayjs();
        const currentYear = today.year();
        const nextYear = currentYear + 1;
        const academicYear = `${currentYear}-${nextYear}`;
        try {
            const response = await getClassListToTransfer(academicYear, id);
            setClassList(response.data);
        } catch (error) {
            message.error('Không thể tải danh sách lớp');
        }
    };

    useEffect(() => {
        fetchClassData(id);
    }, [id]);

    const showModal = (record) => {
        setOldClass(record);
        setIsModalVisible(true);
        fetchClasses();
    };

    const confirmChangeClass = (selected) => {
        Modal.confirm({
            title: 'Xác nhận chuyển lớp',
            content: `Bạn có chắc chắn muốn chuyển sang lớp ${selected.className}?`,
            okText: 'Chuyển Lớp',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    console.log("Old class:", oldClass.className + " - " + oldClass.id);
                    console.log("New class:", selected.className + " - " + selected.id);
                    console.log("Student ID:", id);

                    await transferClass(id, oldClass.id, selected.id);
                    message.success(`Đã chuyển thành công sang lớp ${selected.className}`);
                    setIsModalVisible(false);
                    fetchClassData(id); 
                } catch (error) {
                    console.error('Error transferring class:', error);
                    message.error(error.data.data);
                }
            },
        });
    };

    const columns = [
        { title: 'Lớp', dataIndex: 'className', key: 'className' },
        { title: 'Năm học', dataIndex: 'academicYear', key: 'academicYear', align: 'center' },
        {
            title: 'Trạng thái lớp',
            dataIndex: 'classStatus',
            key: 'classStatus',
            align: 'center',
            render: (status) => {
                let color = '';
                let text = '';

                switch (status) {
                    case 'NOT_STARTED':
                        color = 'blue';
                        text = 'Chưa bắt đầu';
                        break;
                    case 'IN_PROGRESS':
                        color = 'green';
                        text = 'Đang trong năm học';
                        break;
                    case 'COMPLETED':
                        color = 'gray';
                        text = 'Đã kết thúc';
                        break;
                    case 'CANCELED':
                        color = 'red';
                        text = 'Đã hủy';
                        break;
                    default:
                        color = 'default';
                        text = 'Không xác định';
                }

                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: 'Trạng thái học',
            dataIndex: 'studyStatus',
            key: 'studyStatus',
            align: 'center',
            render: (status) => {
                let color = '';
                let text = '';

                switch (status) {
                    case 'DROPPED_OUT':
                        color = 'red';
                        text = 'Đã nghỉ học';
                        break;
                    case 'STUDYING':
                        color = 'green';
                        text = 'Đang học';
                        break;
                    case 'GRADUATED':
                        color = 'gray';
                        text = 'Đã học xong';
                        break;
                    case 'MOVED_OUT':
                        color = 'orange';
                        text = 'Đã chuyển lớp';
                        break;
                    default:
                        color = 'default';
                        text = 'Không xác định';
                }

                return <Tag color={color}>{text}</Tag>;
            },
        },
        { title: 'Tổng số ngày nghỉ', dataIndex: 'countAbsent', key: 'countAbsent', align: 'center' },
        // Hiển thị cột "Hành động" chỉ khi user là ADMIN
        ...(user.role === "ADMIN"
            ? [
                {
                    title: 'Hành động',
                    key: 'action',
                    align: 'center',
                    render: (record) => {
                        const canShowTransferButton =
                            (record.classStatus === 'IN_PROGRESS' && record.studyStatus === 'STUDYING') ||
                            (record.classStatus === 'NOT_STARTED' && record.studyStatus === 'STUDYING');

                        return canShowTransferButton ? (
                            <Button type="link" onClick={() => showModal(record)}>Chuyển lớp</Button>
                        ) : null;
                    },
                },
            ]
            : []),
    ];

    const availableClasses = [
        { title: 'Lớp', dataIndex: 'className', key: 'className' },
        { title: 'Giáo viên', dataIndex: 'teacherName', key: 'teacherName' },
        { title: 'Lứa tuổi', dataIndex: 'ageRange', key: 'ageRange', render: (ageRange) => `${ageRange} tuổi` },
        { title: 'Sĩ số hiện tại', dataIndex: 'countStudent', key: 'countStudent', align: 'center' },
        {
            title: '',
            key: 'action',
            align: 'center',
            render: (record) => (
                <Button type="link" onClick={() => confirmChangeClass(record)}>Chuyển</Button>
            ),
        },
    ];

    return (
        <>
            <Row justify="space-between" className='mb-3'>
                <Col><Title level={5}>Danh sách lớp đã và đang học</Title></Col>
            </Row>
            <Table dataSource={classes} columns={columns} bordered />
            <Modal
                title="Danh sách lớp có thể chuyển"
                open={isModalVisible}
                width={800}
                footer={null}
                onCancel={() => setIsModalVisible(false)}
            >
                <Table
                    dataSource={classList}
                    columns={availableClasses}
                    pagination={false}
                    bordered />
            </Modal>
        </>
    );
};
