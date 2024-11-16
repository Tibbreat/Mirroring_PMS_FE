import { Pagination, Tag, Table, Button } from "antd";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../component/context/auth.context";
import { useContext } from "react";

export const ClassTable = ({ data }) => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    // Define columns for the table
    const columns = [
        {
            title: 'Tên lớp',
            dataIndex: 'className',
            key: 'className',
            render: (text, record) => (
                <Link to={`/pms/manage/class/${record.id}`} style={{ textDecoration: "none" }}>
                    {text}
                </Link>
            ),
        },
        {
            title: 'Độ tuổi',
            dataIndex: 'ageRange',
            key: 'ageRange',
            align: 'center',
            render: (text) => `${text} tuổi`,
        },
        {
            title: 'Sĩ số hiện tại',
            dataIndex: 'countStudentStudying',
            key: 'countStudentStudying',
            align: 'center'
        },
        {
            title: 'Sĩ số tối đa',
            dataIndex: 'totalStudent',
            key: 'totalStudent',
            align: 'center'
        },
        {
            title: 'Quản lý',
            dataIndex: 'managerName',
            key: 'managerName',
        },
        {
            title: 'Năm học',
            dataIndex: 'academicYear',
            key: 'academicYear',
            align: 'center'
        },
        {
            title: 'Ngày khai giảng',
            dataIndex: 'openingDay',
            key: 'openingDay',
            align: 'center',
            render: (text) => {
                return text ? moment(text).format('DD-MM-YYYY') : '';
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
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
        }

    ];

    // If the user has the role "ADMIN", add the "Hành động" column
    if (user.role === "TEACHER") {
        columns.push({
            title: '',
            key: 'action',
            render: (text, record) => (
                <Button type="primary" onClick={() => onAttendance(record.id)}>
                    Điểm danh
                </Button>
            ),
        });
    }

    // Handle page change for pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Redirect to the attendance page for the class
    const onAttendance = (id) => {
        navigate(`/pms/manage/class/attendance/${id}`);
    };

    // Pagination handler for table
    const onPageChange = (page) => {
        handlePageChange(page);
    };

    return (
        <div className="p-2">
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                rowKey="id"
            />
        </div>
    );
};
