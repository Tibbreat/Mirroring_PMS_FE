import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Table, Image, Card, Row, Col, DatePicker, Radio, message, Tag } from 'antd';
import { useParams } from 'react-router-dom';
import { attendAPI, createBaseLogAPI } from '../../services/service.log';
import { AuthContext } from '../../component/context/auth.context';
import { EyeOutlined } from '@ant-design/icons';
import moment from 'moment';

const Attendance = () => {
    const [children, setChildren] = useState([]);
    const [selectedDate, setSelectedDate] = useState(moment()); // Đặt mặc định là ngày hiện tại
    const [attendanceStatus, setAttendanceStatus] = useState({});
    const { id } = useParams();
    const { user } = useContext(AuthContext);

    const loadChildren = async () => {
        try {
            const response = await createBaseLogAPI(id, selectedDate ? selectedDate.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'));
            setChildren(response.data);
        } catch (error) {
            console.error('Failed to fetch children:', error);
        }
    };

    useEffect(() => {
        loadChildren();
    }, [selectedDate]);

    const handleViewNote = (note) => {
        Modal.info({
            title: 'Ghi chú',
            content: <p>{note || 'Không có ghi chú'}</p>,
        });
    };

    const handleDateChange = (date) => {
        if (date) {
            setSelectedDate(date);
        } else {
            setSelectedDate(null); 
        }
        // console.log('Selected Date:', date ? date.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'));
    };
    

    const handleAttendanceChange = (childId, status) => {
        setAttendanceStatus((prevStatus) => ({
            ...prevStatus,
            [childId]: status,
        }));
    };

    const handleSave = () => {
        Modal.confirm({
            title: 'Xác nhận điểm danh',
            content: (
                <Table
                    dataSource={children.map((child) => ({
                        key: child.id,
                        name: child.childName,
                        status: attendanceStatus[child.id] || child.status || 'Chưa điểm danh',
                    }))}
                    columns={[
                        {
                            title: 'Họ và tên',
                            dataIndex: 'name',
                            key: 'name',
                        },
                        {
                            title: 'Trạng thái',
                            dataIndex: 'status',
                            key: 'status',
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
                    ]}
                    pagination={{
                        defaultPageSize: 10,
                        showSizeChanger: false,
                    }}
                    bordered
                    size="small"
                />
            ),
            onOk: async () => {
                const requestDate = selectedDate ? selectedDate.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
                const requestData = {
                    classId: id,
                    attendanceDate: requestDate,
                    children: children.map((child) => ({
                        childrenId: child.id,
                        status: attendanceStatus[child.id] || child.status || 'Chưa điểm danh',
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
            render: (text) => <Image width={80} src={text} />,
        },
        {
            title: 'Họ và tên',
            dataIndex: 'childName',
            key: 'childName',
        },
        {
            title: 'Sáng',
            children: [
                {
                    title: 'Thời gian lên xe',
                    dataIndex: 'morningBoardingTime',
                    key: 'morningBoardingTime',
                    render: (text) => text || 'Chưa có',
                },
                {
                    title: 'Thời gian xuống xe',
                    dataIndex: 'morningAlightingTime',
                    key: 'morningAlightingTime',
                    render: (text) => text || 'Chưa có',
                },
            ],
        },
        {
            title: 'Chiều',
            children: [
                {
                    title: 'Thời gian lên xe',
                    dataIndex: 'afternoonBoardingTime',
                    key: 'afternoonBoardingTime',
                    render: (text) => text || 'Chưa có',
                },
                {
                    title: 'Thời gian xuống xe',
                    dataIndex: 'afternoonAlightingTime',
                    key: 'afternoonAlightingTime',
                    render: (text) => text || 'Chưa có',
                },
            ],
        },
        {
            title: 'Điểm danh',
            key: 'actions',
            render: (text, record) => {
                // Kiểm tra nếu ngày được chọn là ngày hiện tại
                const isToday = selectedDate && selectedDate.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD');
                const status = attendanceStatus[record.id] || record.status || 'Chưa điểm danh';

                // Chọn màu và nhãn cho Tag dựa trên trạng thái
                const getStatusTag = () => {
                    let color = 'gray';
                    let label = 'Chưa điểm danh';

                    if (status === 'PRESENT') {
                        color = 'green';
                        label = 'Có mặt';
                    } else if (status === 'ABSENT') {
                        color = 'red';
                        label = 'Vắng';
                    }

                    return <Tag color={color}>{label}</Tag>;
                };

                return isToday || !selectedDate ? (
                    <Radio.Group
                        value={status}
                        onChange={(e) => handleAttendanceChange(record.id, e.target.value)}
                    >
                        <Radio.Button value="ABSENT">Vắng</Radio.Button>
                        <Radio.Button value="PRESENT">Có mặt</Radio.Button>
                    </Radio.Group>
                ) : (
                    getStatusTag()
                );
            },
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            key: 'note',
            render: (text) => (
                <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewNote(text)} />
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
                        disabledDate={(current) => current && current > moment().endOf('day')}
                        allowClear={true} // Cho phép xóa ngày
                    />
                </Col>
            </Row>

            <Table
                className='mt-3'
                dataSource={children}
                columns={columns}
                rowKey="id"
                pagination={false}
            />

            {selectedDate && selectedDate.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') && (
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
