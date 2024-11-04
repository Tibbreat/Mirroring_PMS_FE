import { Pagination, Tag, Table, Avatar } from "antd";
import { Link } from "react-router-dom";

export const ChildrenTable = ({ data }) => {
    const columns = [
        {
            title: 'Ảnh',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (url) => url ? <Avatar width={50} src={url} /> : 'Không có ảnh',
        },
        {
            title: 'Họ và tên',
            dataIndex: 'childName',
            key: 'childName',
            render: (text, record) => (
                <Link to={`/pms/manage/children/${record.id}`} style={{ textDecoration: "none" }}>
                    {text}
                </Link>
            ),
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            render: (text) => text === 'male' ? 'Nam' : text === 'female' ? 'Nữ' : text,
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'childBirthDate',
            key: 'childBirthDate',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Cha',
            dataIndex: 'fatherName',
            key: 'fatherName',
        },
        {
            title: 'Mẹ',
            dataIndex: 'motherName',
            key: 'motherName',
        },
        {
            title: 'Lớp',
            dataIndex: 'className',
            key: 'className',
            render: (text) => text === null ?
                <Tag color="red" >Chưa được thêm vào lớp</Tag>
                :
                <Tag color="lime"> {text} </Tag>,
        }

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