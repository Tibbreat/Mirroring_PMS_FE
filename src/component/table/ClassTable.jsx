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
            render: (text) => `${text} tuổi`,
        },
        {
            title: 'Sĩ số tối đa',
            dataIndex: 'totalStudent',
            key: 'totalStudent',
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
        },
        {
            title: 'Ngày khai giảng',
            dataIndex: 'openingDay',
            key: 'openingDay',
            render: (text) => {
                return text ? moment(text).format('DD-MM-YYYY') : '';
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status ? 'green' : 'red'}>
                    {status ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                </Tag>
            ),
        },
    ];

    // If the user has the role "ADMIN", add the "Hành động" column
    if (user.role === "ADMIN") {
        columns.push({
            title: 'Hành động',
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
