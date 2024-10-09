import { Pagination, Tag, Table } from "antd";
import { Link } from "react-router-dom";

export const ProviderTable = ({ data, currentPage, total, setCurrentPage, providerType }) => {
    const columns = [
        {
            title: providerType === 'food' ? 'Nhà cung cấp Thực phẩm' : 'Nhà cung cấp Vận chuyển',
            dataIndex: 'providerName',
            key: 'providerName',
            render: (text, record) => (
                <Link to={`/pms/manage/provider/${providerType}/${record.id}`} className="text-blue-2" style={{ textDecoration: "none" }}>
                    {text}
                </Link>
            ),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'providerPhone',
            key: 'providerPhone',
            render: (text) => `${text}`,
        },
        {
            title: 'Số đăng kí',
            dataIndex: 'providerRegisterNumber',
            key: 'providerRegisterNumber',
        },
        {
            title: 'Email',
            dataIndex: 'providerEmail',
            key: 'providerEmail',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}
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
            <Pagination
                current={currentPage}
                total={total}
                onChange={handlePageChange}
                style={{ marginTop: '16px', textAlign: 'center' }}
            />
        </div>
    );
};
