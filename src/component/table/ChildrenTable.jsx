import { Pagination, Tag, Table } from "antd";
import { Link } from "react-router-dom";

export const ChildrenTable = ({ data, currentPage, total, setCurrentPage }) => {
    const columns = [
        {
            title: 'Tên trẻ',
            dataIndex: 'childName',
            key: 'childName',
            render: (text, record) => (
                <Link to={`/pms/manage/children/${record.id}`} className="text-blue-2" style={{ textDecoration: "none" }}>
                    {text}
                </Link>
            ),
        },
        {
            title: 'Độ tuổi',
            dataIndex: 'childAge',
            key: 'childAge',
            render: (text) => `${text} tuổi`,
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'childBirthDate',
            key: 'childBirthDate',
            render: (date) => new Date(date).toLocaleDateString(),  
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'childAddress',
            key: 'childAddress',
        },
        {
            title: 'ID lớp',
            dataIndex: 'classId',
            key: 'classId',
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
