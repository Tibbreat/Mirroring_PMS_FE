import { Pagination, Tag, Table } from "antd";
import { Link } from "react-router-dom";

export const ProviderTable = ({ data, currentPage, total, setCurrentPage, providerType }) => {
    const columns = [
        {
            title: "Tên công ty/đối tác",
            dataIndex: 'providerName',
            key: 'providerName',
            render: (text, record) => {
                // Get the current path
                const currentPath = window.location.pathname;

                // Determine the base path based on the current URL
                let basePath;
                if (currentPath.includes("/transport")) {
                    basePath = `/pms/manage/transport/provider/${record.id}`;
                } else if (currentPath.includes("/kitchen")) {
                    basePath = `/pms/manage/kitchen/provider/${record.id}`;
                } else {
                    basePath = `/pms/manage/provider/${providerType}/${record.id}`;
                }

                return (
                    <Link to={basePath} style={{ textDecoration: "none" }}>
                        {text}
                    </Link>
                );
            },
        },

        {
            title: 'Số điện thoại',
            dataIndex: 'providerPhone',
            key: 'providerPhone',
            render: (text) => `${text}`,
        },
        {
            title: 'Mã số thuế',
            dataIndex: 'providerTaxCode',
            key: 'providerTaxCode',
        },
        {
            title: 'Email',
            dataIndex: 'providerEmail',
            key: 'providerEmail',
        },
        {
            title: 'Người đại diện',
            dataIndex: 'representativeName',
            key: 'representativeName',
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
        </div>
    );
};
