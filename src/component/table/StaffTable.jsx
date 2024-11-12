import React from 'react';
import { Link } from "react-router-dom";
import { Avatar, Table, Tag } from "antd";
import { UserOutlined } from '@ant-design/icons';

const roleMapping = {
    CLASS_MANAGER: 'Quản lý lớp',
    KITCHEN_MANAGER: 'Quản lý bếp',
    TRANSPORT_MANAGER: 'Quản lý đưa đón',
};

const StaffTable = ({ data, currentPage, pageSize, total, onPageChange }) => {
    const columns = [
        {   align: 'center',
            title: '',
            dataIndex: 'imageLink',
            key: 'imageLink',
            render: (url) => url ? <Avatar width={50} src={url} /> : <Avatar size="small" icon={<UserOutlined />} />,
        },
        {
            title: 'Tên đầy đủ',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (text, record) => (
                <Link to={`/pms/manage/staff/${record.id}`} style={{ textDecoration: "none" }}>
                    {text}
                </Link>
            ),
        },
        {
            title: 'Account',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            render: (text) => text || "N/A",
        },
        {
            title: 'Chức vụ',
            dataIndex: 'role',
            key: 'role',
            render: (text) => roleMapping[text] || "N/A",  
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

    return (
        <div>
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
}

export default StaffTable;
