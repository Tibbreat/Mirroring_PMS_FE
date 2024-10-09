import React from 'react';
import Sidebar from './layout/Sidebar';
import Navbar from './layout/Navbar';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';



const { Content, Sider } = Layout;

const ManageSite = () => {
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
      </Layout>
    </Layout>
  );
};

export default ManageSite;