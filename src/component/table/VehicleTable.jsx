import { Pagination, Tag, Table } from "antd";
import { Link } from "react-router-dom";

export const VehicleTable = ({ data, currentPage, total, setCurrentPage }) => {
    const columns = [
        {
            title: 'Biển số xe',
            dataIndex: 'licensePlate',
            key: 'clicensePlate',
            render: (text, record) => (
                <Link to={`/pms/manage/vehicle/${record.id}`} className="text-blue-2" style={{ textDecoration: "none" }}>
                    {text}
                </Link>
            ),
        },
        {
            title: 'Màu sắc',
            dataIndex: 'color',
            key: 'color',
            render: (text) => `${text}`,
        },
        {
            title: 'Kiểu dáng',
            dataIndex: 'model',
            key: 'model',
        },
        {
            title: 'Nhãn hiệu',
            dataIndex: 'model',
            key: 'model',
        },
        // {
        //     title: 'Trạng thái',
        //     dataIndex: 'status',
        //     key: 'status',
        //     render: (status) => (
        //         <Tag color={status ? 'green' : 'red'}>
        //             {status ? 'Đang hoạt động' : 'Ngưng hoạt động'}
        //         </Tag>
        //     ),
        // },
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