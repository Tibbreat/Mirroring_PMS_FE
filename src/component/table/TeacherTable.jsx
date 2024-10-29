import React from 'react';
import { Link } from "react-router-dom";
import { Table, Tag } from "antd";

const TeacherTable = ({ data }) => {
    const columns = [
        {
            title: 'Tên đầy đủ',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (text, record) => (
                <Link to={`/pms/manage/teacher/${record.id}`}  style={{ textDecoration: "none" }}>
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
            title: 'Hợp đồng',
            dataIndex: 'contractType',
            key: 'contractType',
            render: (text) => text || "N/A",
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
                pagination={false}
                rowKey="id"
            />
        </div>
    );
}

export default TeacherTable;