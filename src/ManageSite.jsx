import React, { useContext, useState } from 'react';
import Sidebar from './layout/Sidebar';
import Navbar from './layout/Navbar';
import { Outlet } from 'react-router-dom';
import { Button, Drawer, FloatButton, Layout } from 'antd';

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
          className="position-fixed rounded-circle d-flex justify-content-center align-items-center shadow"
          onClick={showChat}
          icon={<MessageOutlined />}
        >
        </FloatButton>
        <div>
          <ChatDrawer isVisible={isChatVisible} onClose={closeChat} />
        </div>
      </Layout>
    </Layout>
  );
};

export default ManageSite;
