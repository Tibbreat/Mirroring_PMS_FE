import { Pagination, Tag, Table, Button } from "antd";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../component/context/auth.context";
import { useContext } from "react";

export const ClassTable = ({ data, currentPage, total, setCurrentPage }) => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

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
            title: 'Phụ Trách',
            dataIndex: 'managerName',
            key: 'managerName',
        },
        {
            title: 'Năm học',
            dataIndex: 'openingDay',
            key: 'openingDay',
            render: (text, record) => {
                const openingYear = text ? moment(text).year() : '';
                const closingYear = record.closingDay ? moment(record.closingDay).year() : '';
                return `${openingYear} - ${closingYear}`;
            },
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

    if (user.role === "ADMIN") {
        columns.push({
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <Button color="primary" variant="outlined" onClick={() => onAttendance(record.id)}>
                    Điểm danh
                </Button>
            ),
        });
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const onAttendance = (id) => {
        navigate(`/pms/manage/class/attendance/${id}`);
        console.log(id);
    };

    return (
        <div className="p-2">
            <Table
                columns={columns}
                dataSource={data}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: total,
                    onChange: onPageChange,
                }}
                rowKey="id"
            />
        </div>
    );
};