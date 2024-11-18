import { UserOutlined } from "@ant-design/icons";
import { Table, Avatar, Tag } from "antd";
import { Link } from "react-router-dom";

export const ChildrenTable = ({ data }) => {
    const columns = [
        {
            title: 'Ảnh', dataIndex: 'imageUrl', key: 'imageUrl', align: 'center',
            render: (url) => url ? <Avatar width={50} src={url} /> : <Avatar size="small" icon={<UserOutlined />} />,
        },
        {
            title: 'Họ và tên', dataIndex: 'childName', key: 'childName',
            render: (text, record) => (
                <Link to={`/pms/manage/children/${record.id}`} style={{ textDecoration: "none" }}>
                    {text}
                </Link>
            ),
        },
        {
            title: 'Giới tính', dataIndex: 'gender', key: 'gender',
            render: (text) => text === 'male' ? 'Nam' : text === 'female' ? 'Nữ' : text,
        },
        {
            title: 'Ngày sinh', dataIndex: 'childBirthDate', key: 'childBirthDate',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        { title: 'Cha', dataIndex: 'fatherName', key: 'fatherName', },
        { title: 'Mẹ', dataIndex: 'motherName', key: 'motherName', },
        {
            title: 'Lớp', dataIndex: 'className', key: 'className',
            render: (text) => <Tag color="lime">{text}</Tag>,
        },
    ];

    return (
        <div className="p-2">
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                rowKey="id"
                bordered
            />
        </div>
    );
};