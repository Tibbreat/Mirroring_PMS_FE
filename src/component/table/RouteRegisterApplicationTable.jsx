import { Table, Tag } from "antd";

export const RouteSubmittedApplicationTable = ({ data }) => {
    const columns = [
        { title: "Tên trẻ", dataIndex: "childrenName", key: "childrenName" },
        { title: "Tuyến đăng ký", dataIndex: "routeName", key: "routeName" },
        { title: "Điểm đón", dataIndex: "stopLocationName", key: "stopLocationName" },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                switch (status) {
                    case "PENDING":
                        return <Tag color="orange">Đang chờ xếp xe</Tag>;
                    case "ACCEPTED":
                        return <Tag color="green">Đã xếp xe</Tag>;
                    case "REJECTED":
                        return <Tag color="red">Đã bị từ chối</Tag>;
                    default:
                        return <Tag>Không xác định</Tag>;
                }
            },
        },
    ];

    return <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        bordered
        pagination={{ defaultPageSize: 10 }} />;
};
