import React, { useState, useEffect, useContext } from 'react';
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../component/context/auth.context';

const Sidebar = () => {
    const { user } = useContext(AuthContext);
    const [openKeys, setOpenKeys] = useState([]);
    const [selectedKey, setSelectedKey] = useState();
    const navigate = useNavigate();
    const location = useLocation();

    const allItems = [
        {
            key: '1',
            label: 'Trang chủ',
        },
        {
            key: '2',
            label: 'Quản lý giáo viên',
        },
        {
            key: '3',
            label: 'Quản lý nhân viên',
        },
        {
            key: '4',
            label: 'Quản lý lớp',
        },
        {
            key: '5',
         
            label: 'Quản lý đối tác',
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
        {
            key: '6',
            label: 'Quản lý trẻ',
        },
        {
            key: '8',
            label: 'Thực đơn',
        },
    ];

    // Nếu user là ADMIN, thêm mục Cài đặt thông tin
    if (user.role === "ADMIN") {
        allItems.push({
            key: '7',
          
            label: 'Cài đặt thông tin',
        });
    }

    // Kiểm tra vai trò TEACHER và điều chỉnh items hiển thị
    const items = user.role === "TEACHER"
        ? allItems.filter(item => ['1', '2', '4', '6'].includes(item.key))
        : allItems;

    useEffect(() => {
        // Cập nhật selectedKey dựa trên đường dẫn hiện tại
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
        } else if (location.pathname.includes('/children')) {
            setSelectedKey('6');
        } else if (location.pathname.includes('/settings')) {
            setSelectedKey('7');
        }else if (location.pathname.includes('/kitchen')) {
            setSelectedKey('8');
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
            case '6':
                navigate('/pms/manage/children');
                break;
            case '7':
                navigate('/pms/manage/settings');
                break;
            case '8':
                navigate('/pms/manage/kitchen/menu/calendar');
                break;
            default:
                break;
        }
    };

    return (
        <div className=''>
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
