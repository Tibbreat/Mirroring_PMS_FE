import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Table, Image, Card, Row, Col, DatePicker, Radio, message, Tag, Input } from 'antd';
import { useParams } from 'react-router-dom';
import { attendAPI, createBaseLogAPI } from '../../services/service.log';
import { AuthContext } from '../../component/context/auth.context';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const Attendance = () => {
    const [children, setChildren] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [attendanceStatus, setAttendanceStatus] = useState({});
    const [notes, setNotes] = useState({});
    const { id } = useParams();
    const { user } = useContext(AuthContext);

    const loadChildren = async () => {
        try {
            const response = await createBaseLogAPI(id, selectedDate.format('YYYY-MM-DD'));
            setChildren(response.data);
        } catch (error) {
            console.error('Failed to fetch children:', error);
        }
    };

    useEffect(() => {
        loadChildren();
    }, [selectedDate]);

    const handleViewNote = (childId) => {
        const note = notes[childId] !== undefined ? notes[childId] : children.find((child) => child.id === childId)?.note || 'Không có ghi chú';

        Modal.info({
            title: 'Ghi chú',
            content: <p>{note}</p>,
        });
    };

    const handleAddNote = (childId) => {
        const defaultNote = notes[childId] || children.find((child) => child.id === childId)?.note || '';

        let noteContent = defaultNote;

        Modal.confirm({
            title: 'Thêm ghi chú',
            content: (
                <Input.TextArea
                    rows={4}
                    defaultValue={defaultNote}
                    onChange={(e) => {
                        noteContent = e.target.value;
                    }}
                />
            ),
            onOk: () => {
                setNotes((prevNotes) => ({
                    ...prevNotes,
                    [childId]: noteContent,
                }));
                message.success('Ghi chú đã được thêm');
            },
        });
    };

    const handleDateChange = (date) => {
        if (date && (!selectedDate || !date.isSame(selectedDate, 'day'))) {
            setSelectedDate(date);
        }
    };

    const handleAttendanceChange = (childId, status) => {
        setAttendanceStatus((prevStatus) => ({
            ...prevStatus,
            [childId]: status,
        }));
    };

    const handleSave = () => {
        const attendanceDate = selectedDate.format('YYYY-MM-DD');
        const totalChildren = children.length;

        // Bắt đầu bằng dữ liệu trả về từ API
        let initialPresentCount = children.filter(child => child.status === 'PRESENT').length;
        let initialAbsentCount = children.filter(child => child.status === 'ABSENT').length;

        // Cập nhật lại số lượng dựa trên các thay đổi trong `attendanceStatus`
        Object.entries(attendanceStatus).forEach(([childId, status]) => {
            const originalStatus = children.find(child => child.id === childId)?.status;

            // Nếu trạng thái thay đổi, cập nhật số lượng
            if (status === 'PRESENT' && originalStatus !== 'PRESENT') {
                initialPresentCount += 1;
                if (originalStatus === 'ABSENT') initialAbsentCount -= 1;
            } else if (status === 'ABSENT' && originalStatus !== 'ABSENT') {
                initialAbsentCount += 1;
                if (originalStatus === 'PRESENT') initialPresentCount -= 1;
            }
        });

        Modal.confirm({
            title: `Xác nhận điểm danh ngày ${selectedDate.format('DD-MM-YYYY')}`,
            width: 800,
            content: (
                <>
                    <p>Tổng số trẻ: {totalChildren}</p>
                    <Tag color='green'>Tổng số có mặt: {initialPresentCount}</Tag>
                    <Tag color='red'>Tổng số vắng: {initialAbsentCount}</Tag>

                    <Table
                        className='mt-3'
                        dataSource={children.map((child) => ({
                            key: child.id,
                            name: child.childName,
                            status: attendanceStatus[child.id] || child.status || 'Chưa điểm danh',
                            note: notes[child.id] !== undefined ? notes[child.id] : child.note,
                        }))}
                        columns={[
                            {
                                title: 'Họ và tên',
                                dataIndex: 'name',
                                key: 'name',
                                width: 200,
                            },
                            {
                                title: 'Trạng thái',
                                dataIndex: 'status',
                                key: 'status',
                                align: 'center',
                                width: 200,
                                render: (text) => {
                                    let color = 'gray';
                                    let label = 'Chưa điểm danh';

                                    if (text === 'PRESENT') {
                                        color = 'green';
                                        label = 'Có mặt';
                                    } else if (text === 'ABSENT') {
                                        color = 'red';
                                        label = 'Vắng';
                                    }

                                    return <Tag color={color}>{label}</Tag>;
                                },
                            },
                            {
                                title: 'Ghi chú',
                                dataIndex: 'note',
                                width: 400,
                                key: 'note',
                            },
                        ]}
                        pagination={{
                            defaultPageSize: 10,
                            showSizeChanger: false,
                        }}
                        bordered
                        size="small"
                    />
                </>
            ),
            onOk: async () => {
                const requestData = {
                    classId: id,
                    attendanceDate: attendanceDate,
                    children: children.map((child) => ({
                        childrenId: child.id,
                        status: attendanceStatus[child.id] || child.status || 'Chưa điểm danh',
                        note: notes[child.id] !== undefined ? notes[child.id] : child.note,
                    })),
                };

                console.log('Formatted Attendance Request:', requestData);
                await attendAPI(requestData);
                message.success('Điểm danh thành công');
                loadChildren();
            },
        });
    };


    const columns = [
        {
            title: 'Hình ảnh',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            align: 'center',
            render: (text) => <Image width={80} src={text} />,
        },
        {
            title: 'Họ và tên',
            dataIndex: 'childName',
            key: 'childName',
        },
        {
            title: 'Sáng',
            align: 'center',
            children: [
                {
                    title: 'Thời gian lên xe',
                    dataIndex: 'morningBoardingTime',
                    key: 'morningBoardingTime',
                    align: 'center',
                    render: (text) => text || 'Chưa có',
                },
                {
                    title: 'Thời gian xuống xe',
                    dataIndex: 'morningAlightingTime',
                    key: 'morningAlightingTime',
                    align: 'center',
                    render: (text) => text || 'Chưa có',
                }
            ],
        },
        {
            title: 'Chiều',
            align: 'center',
            children: [
                {
                    title: 'Thời gian lên xe',
                    dataIndex: 'afternoonBoardingTime',
                    key: 'afternoonBoardingTime',
                    align: 'center',
                    render: (text) => text || 'Chưa có',
                },
                {
                    title: 'Thời gian xuống xe',
                    dataIndex: 'afternoonAlightingTime',
                    key: 'afternoonAlightingTime',
                    align: 'center',
                    render: (text) => text || 'Chưa có',
                }
            ],
        },
        {
            title: 'Điểm danh',
            key: 'actions',
            align: 'center',
            render: (record) => (
                <Radio.Group
                    value={attendanceStatus[record.id] || record.status}
                    onChange={(e) => handleAttendanceChange(record.id, e.target.value)}
                >
                    <Radio.Button value="ABSENT" className="absent-button">Vắng</Radio.Button>
                    <Radio.Button value="PRESENT" className="present-button">Có mặt</Radio.Button>
                </Radio.Group>
            ),
        },
        {
            title: 'Ghi chú',
            key: 'note',
            align: 'center',
            render: (text, record) => (
                <Row>
                    <Col span={24}>
                        <Button type="link" icon={<EditOutlined />} onClick={() => handleAddNote(record.id)} />
                    </Col>
                    <Col span={24}>
                        <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewNote(record.id)} />
                    </Col>
                </Row>
            ),
        },
    ];

    return (
        <Card title='Điểm danh' className='m-2'>
            <Row gutter={[16, 16]} className='mb-2' justify="end">
                <Col>
                    <DatePicker
                        placeholder="Ngày"
                        style={{ width: '100%' }}
                        value={selectedDate}
                        onChange={handleDateChange}
                        disabledDate={(current) => current && current > dayjs().endOf('day')}
                    />
                </Col>
            </Row>

            <Table
                className='mt-3'
                dataSource={children}
                columns={columns}
                rowKey="id"
                pagination={false}
                bordered={true}
            />

            {selectedDate.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD') && (
                <Row justify="end" className="mt-3">
                    <Col>
                        <Button type="primary" onClick={handleSave}>
                            Lưu
                        </Button>
                    </Col>
                </Row>
            )}
        </Card>
    );
};

export default Attendance;