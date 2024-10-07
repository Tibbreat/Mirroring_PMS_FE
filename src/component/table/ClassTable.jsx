import { Pagination, Tag, Table } from "antd";
import { Link } from "react-router-dom";

export const ClassTable = ({ data, currentPage, total, setCurrentPage }) => {
    const columns = [
        {
            title: 'Tên lớp',
            dataIndex: 'className',
            key: 'className',
            render: (text, record) => (
                <Link to={`/pms/manage/class/${record.id}`} className="text-blue-2" style={{ textDecoration: "none" }}>
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
            dataIndex: 'schoolYear',
            key: 'schoolYear',
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

    const handlePageChange = (page) => {
        setCurrentPage(page);
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