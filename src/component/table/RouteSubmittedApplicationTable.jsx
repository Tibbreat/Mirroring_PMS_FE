import { Button, message, Modal, Table, Tag } from "antd";
import { approveApplicationAPI } from "../../services/services.route";
import { useEffect } from "react";

export const RouteSubmittedApplicationTable = ({ data }) => {

    const columns = [
        { title: "Tên trẻ", dataIndex: "childrenName", key: "childrenName" },
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
        {
            title: "Xe",
            dataIndex: "vehicleName",
            key: "vehicleName",
            render: (vehicleName) => {
                return vehicleName ? vehicleName : <Tag color="red">Không có</Tag>;
            },
        },
        {
            title: "Hành động",
            key: "action",
            align: "center",
            render: (record) => {
                return (
                    <Button type="link" size="small" onClick={() => onCLick(record)}>
                        Xếp xe
                    </Button>
                );
            },
        },
    ];

    const onCLick = (record) => {
        console.log("record", record);
        Modal.confirm({
            title: "Xác nhận xếp xe",
            content: `Bạn có chắc chắn muốn hệ thống tự động xếp xe cho  ${record.childrenName} không?`,
            onOk: async () => {
                const payload = {
                    applicationId: record.id,
                    routeId: record.routeId,
                    childrenId: record.childrenId,
                    stopLocationId: record.stopLocationId,
                };
                try {
                    await approveApplicationAPI(payload);
                    message.success("Đã xếp xe thành công");
                } catch (error) {
                    console.error("Error approving application:", error);
                    message.error("Xếp xe thất bại");
                }
            },
            onCancel() {
                console.log("Cancel");
            },
        });
    };

    return (
        <>
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                bordered
                size="small"
                className="m-2"
                pagination={{ defaultPageSize: 10 }} />
        </>
    );

};
