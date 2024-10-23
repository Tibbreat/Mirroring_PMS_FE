import React, { useContext, useState } from 'react';
import Sidebar from './layout/Sidebar';
import Navbar from './layout/Navbar';
import { Outlet } from 'react-router-dom';
import { Drawer, FloatButton, Layout } from 'antd';

import "./assets/style.css"
import { MessageOutlined } from '@ant-design/icons';
import ChatDrawer from './component/drawer/ChatDrawer';
import { AuthContext } from './component/context/auth.context';


const { Content, Sider } = Layout;

const ManageSite = () => {
  const { user } = useContext(AuthContext);
  const [isChatVisible, setIsChatVisible] = useState(false);

  // Hàm để mở cửa sổ chat
  const showChat = () => {
    setIsChatVisible(true);
  };

  // Hàm để đóng cửa sổ chat
  const closeChat = () => {
    setIsChatVisible(false);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <Sidebar />
      </Sider>
      <Layout className="site-layout">
        <div className="site-layout-background">
          <Navbar />
        </div>
        <Content className="site-layout-content">
          <div className="site-layout-content-inner">
            <Outlet />
          </div>
        </Content>
        <FloatButton
          icon={<MessageOutlined />}  // Use the icon here
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 50,
            height: 50,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          }}
          onClick={showChat}
          badge={{ dot: true }}
        />

          <div>
          <ChatDrawer isVisible={isChatVisible} onClose={closeChat} />
          </div>
       
      </Layout>
    </Layout>
  );
};

export default ManageSite;
