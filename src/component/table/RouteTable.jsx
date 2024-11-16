import { Link } from "react-router-dom";
import { Table, Tag } from 'antd';

const RouteTable = ({ data }) => {
    const columns = [
        {
            title: 'Tên tuyến',
            dataIndex: 'routeName',
            key: 'routeName',
            render: (text, record) => (
                <Link to={`/pms/manage/transport/route/${record.id}`} style={{ textDecoration: "none" }}>
                    {text}
                </Link>
            )
        },
        { title: 'Điểm đầu', dataIndex: 'startLocation', key: 'startLocation' },
        { title: 'Điểm cuối', dataIndex: 'endLocation', key: 'endLocation' },
        { title: 'Thời gian đón', dataIndex: 'pickupTime', key: 'pickupTime' },
        { title: 'Thời gian trả', dataIndex: 'dropOffTime', key: 'dropOffTime' },
        { title: 'Số trẻ đăng ký', dataIndex: 'childrenCount', key: 'childrenCount' },
        {
            title: 'Trạng thái', dataIndex: 'isActive', key: 'isActive',
            render: (isActive) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                </Tag>
            )
        },
    ];
    return (
        <div className="p-2">
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                rowKey='id' />
        </div>
    );
};

export default RouteTable;
