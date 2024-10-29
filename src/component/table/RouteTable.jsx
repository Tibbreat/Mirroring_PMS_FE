import { EyeOutlined } from '@ant-design/icons';
import { exp } from '@tensorflow/tfjs';
import { Link, useNavigate } from "react-router-dom";
import { Button, Pagination, Row, Switch, Table } from 'antd';
import { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';

const RouteTable = ({ data }) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);

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
        { title: 'Số trẻ đăng ký', dataIndex: 'countRegistered', key: 'countRegistered' },
        {
            title: 'Trạng thái', dataIndex: 'isActive', key: 'isActive', render: (isActive, record) => (
                <Switch checked={isActive} />
            )
        },
    ];

    const fetchRoutes = async () => {
        const reponse = fetchRoutes();
    }

    useEffect(() => {
        fetchRoutes();
    }, []);
    return (
        <div className="p-2">
            <Table columns={columns} dataSource={data} pagination={false} />
            <Pagination
                current={currentPage}
                total={total}
                className='mt-3'
            />
        </div>
    );
};

export default RouteTable;
