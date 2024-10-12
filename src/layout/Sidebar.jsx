import React, { useState, useEffect } from 'react';
import { HomeOutlined, UserOutlined, UsergroupAddOutlined, AimOutlined, DashboardOutlined, ReconciliationOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const items = [
    {
        key: '1',
        icon: <DashboardOutlined />,
        label: 'Trang chủ',
    },
    {
        key: '2',
        icon: <UserOutlined />,
        label: 'Giáo viên',
    },
    {
        key: '3',
        icon: <UsergroupAddOutlined />,
        label: 'Nhân viên',
    },
    {
        key: '4',
        icon: <HomeOutlined />,
        label: 'Lớp',
    },
    {
        key: '5',
        icon: <ReconciliationOutlined />,
        label: 'Đối tác',
        children: [
            {
                key: '51',
                label: 'Thực phẩm',
            },
            {
                key: '52',
                label: 'Vận chuyển',
            }
        ],
    },
    // {
    //     key: '6',
    //     icon: <AimOutlined />,
    //     label: 'Điểm danh',
    // },
];

const Sidebar = () => {
    const [openKeys, setOpenKeys] = useState([]);
    const [selectedKey, setSelectedKey] = useState();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Update selected key based on current location path
        if (location.pathname.includes('/dashboard')) {
            setSelectedKey('1');
        } else if (location.pathname.includes('/teacher')) {
            setSelectedKey('2');
        } else if (location.pathname.includes('/staff')) {
            setSelectedKey('3');
        } else if (location.pathname.includes('/class')) {
            setSelectedKey('4');
        } else if (location.pathname.includes('/provider/food')) {
            setSelectedKey('51');
        } else if (location.pathname.includes('/provider/transport')) {
            setSelectedKey('52');
        } else {
            setSelectedKey(undefined);
        }
    }, [location.pathname]);

    const onOpenChange = (keys) => {
        setOpenKeys(keys);
    };

    const onClick = (item) => {
        switch (item.key) {
            case '1':
                navigate('/pms/manage/dashboard');
                break;
            case '2':
                navigate('/pms/manage/teacher');
                break;
            case '3':
                navigate('/pms/manage/staff');
                break;
            case '4':
                navigate('/pms/manage/class');
                break;
            case '51':
                navigate('/pms/manage/provider/food');
                break;
            case '52':
                navigate('/pms/manage/provider/transport');
                break;
            // case '6':
            //     navigate('/pms/manage/attendance');
            //     break;
            default:
                break;
        }
    };

    return (
        <div className='sidebar-custom-antd'>
            <Menu
                mode="inline"
                openKeys={openKeys}
                selectedKeys={[selectedKey]}
                onOpenChange={onOpenChange}
                className='sidebar-custom-antd'
                items={items}
                onClick={onClick}
            />
        </div>
    );
};

export default Sidebar;