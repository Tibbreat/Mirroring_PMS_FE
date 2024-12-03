import React, { useContext, useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, FloatButton, Divider } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import Navbar from './layout/Navbar';
import ChatDrawer from './component/drawer/ChatDrawer';
import { AuthContext } from './component/context/auth.context';
import "./assets/style.css";

const { Content, Sider } = Layout;

const ManageSite = () => {
  const { user } = useContext(AuthContext);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Sidebar menu items in the specified order
  const allItems = [
    { key: '1', label: 'Trang chủ' },
    { key: '7', label: 'Trẻ' },
    {
      key: '2', label: 'Nhân viên',
      children: [
        { key: '21', label: 'Giáo viên' },
        { key: '22', label: 'Quản lý' },
      ],
    },
    { key: '4', label: 'Lớp' },
    {
      key: '5', label: 'Bếp',
      children: [
        { key: '51', label: 'Danh sách đối tác' },
        { key: '52', label: 'Thực đơn' }
      ],
    },
    {
      key: '6', label: 'Đưa đón',
      children: [
        { key: '61', label: 'Đối tác' },
        { key: '62', label: 'Danh sách tuyến' },
        { key: '63', label: 'Đơn đăng ký' },
      ],
    },
  ];

  if (user.role === "ADMIN") {
    allItems.push({ key: '8', label: 'Cài đặt thông tin' });
  }

  const items = (() => {
    if (user.role === "TEACHER") {
      return allItems
        .filter(item => {
          // Lọc các nhóm menu
          if (item.key === '6') {
            // Chỉ hiển thị các menu con 71, 72 cho role TEACHER
            return item.children && item.children.some(child => ['61', '62'].includes(child.key));
          }
          // Lọc các nhóm khác bình thường
          return ['1', '2', '4', '6', '5', '7'].includes(item.key);
        })
        .map(item => {
          if (item.key === '6') {
            // Lọc các menu con 71, 72 cho nhóm 7
            item.children = item.children.filter(child => ['61', '62'].includes(child.key));
          }
          return item;
        });
    } else if (user.role === "TRANSPORT_MANAGER") {
      return allItems.filter(item => ['1', '4', '6'].includes(item.key));
    } else if (user.role === "KITCHEN_MANAGER") {
      return allItems.filter(item => ['1', '4', '5'].includes(item.key));
    } else {
      return allItems;
    }
  })();



  useEffect(() => {
    const pathMap = {
      '/dashboard': '1',
      '/teacher': '21',
      '/staff': '22',
      '/class': '4',
      '/kitchen/provider': '51',
      '/kitchen/menu/calendar': '52',
      '/transport/provider': '61',
      '/transport/route': '62',
      '/transport/submited-application': '63',
      '/children': '7',
      '/settings': '8',
    };
    const selected = Object.keys(pathMap).find(path => location.pathname.includes(path));
    setSelectedKey(selected ? pathMap[selected] : undefined);
  }, [location.pathname]);

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    if (allItems.map(item => item.key).indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const onClick = (item) => {
    const routes = {
      '1': '/pms/manage/dashboard',
      '21': '/pms/manage/teacher',
      '22': '/pms/manage/staff',
      '4': '/pms/manage/class',
      '51': '/pms/manage/kitchen/provider',
      '52': '/pms/manage/kitchen/menu/calendar',
      '61': '/pms/manage/transport/provider',
      '62': '/pms/manage/transport/route',
      '63': '/pms/manage/transport/submited-application',
      '7': '/pms/manage/children',
      '8': '/pms/manage/settings',
    };
    navigate(routes[item.key]);
  };

  const showChat = () => setIsChatVisible(true);

  const closeChat = () => setIsChatVisible(false);

  return (
    <Layout hasSider style={{ minHeight: '100vh', borderRadius: 8, overflow: 'hidden' }}>
      <Sider
        style={{
          backgroundColor: '#001529',
          position: 'fixed',
          height: '100vh',
          top: 0,
          bottom: 0,
          overflowY: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        breakpoint="lg"
        collapsedWidth="0"
        onCollapse={(collapsed) => setCollapsed(collapsed)}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100px',
            marginTop: '16px',
          }}
        >
          <img src="/icon/logo.svg" alt="logo" style={{ maxWidth: '80%' }} />
        </div>

        <Divider style={{ background: 'white', width: "80%" }} />

        <Menu
          theme="dark"
          mode="inline"
          openKeys={openKeys}
          selectedKeys={[selectedKey]}
          onOpenChange={onOpenChange}
          items={items}
          onClick={onClick}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 0 : 200 }}>
        <Navbar />
        <Content>
          <Outlet />
        </Content>
      </Layout>

      {user?.role === 'TEACHER' && (
        <>
          <FloatButton
            className="position-fixed rounded-circle d-flex justify-content-center align-items-center shadow"
            onClick={showChat}
            icon={<MessageOutlined />}
            style={{ right: 24, bottom: 24 }}
          />
          <ChatDrawer isVisible={isChatVisible} onClose={closeChat} />
        </>
      )}
    </Layout>
  );
};

export default ManageSite;