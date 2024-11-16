import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Row, Table } from "antd";
import { Link } from "react-router-dom";
import { getChildrenByRoute } from "../../services/service.children";
import { useEffect, useState } from "react";

export const ChildrenTab = ({ id, routeActive }) => {
    const [childrenData, setChildrenData] = useState([]);

    const fetchChildrenData = async () => {
        try {
            const response = await getChildrenByRoute(id);
            setChildrenData(response.data);
        } catch (error) {
            console.error('Error fetching route:', error);
        }
    };
    useEffect(() => {
        fetchChildrenData();
    }, [id, routeActive]);

    const childrenColumns = [
        {
            title: 'Ảnh',
            dataIndex: 'childrenImage',
            key: 'childrenImage',
            align: 'center',
            render: (url) => url ? <Avatar width={50} src={url} /> : <Avatar size="small" icon={<UserOutlined />} />,
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
            dataIndex: 'childrenGender',
            key: 'childrenGender',
            render: (text) => text === 'male' ? 'Nam' : text === 'female' ? 'Nữ' : text,
        },
        {
            title: 'Điểm đón',
            dataIndex: 'stopLocationRegistered',
            key: 'stopLocationRegistered',
        },
        {
            title: 'Lớp',
            dataIndex: 'childrenClassName',
            key: 'childrenClassName',
        },
        {
            title: 'Xe đăng ký',
            dataIndex: 'vehicleName',
            key: 'vehicleName',
        },
    ];
    return (
        <>
            <Row justify="end" className="mb-3">
                {routeActive && (
                    <Button type="primary" >
                        Đăng ký học sinh
                    </Button>
                )}
            </Row>
            <Table
                columns={childrenColumns}
                dataSource={childrenData}
                rowKey="id"
                bordered
            />
        </>
    );
};