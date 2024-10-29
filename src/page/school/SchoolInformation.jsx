import React, { useState, useEffect, useContext } from 'react';
import { Card, Spin, message, Tabs, Form } from 'antd';
import SchoolInformationTab from './SchoolInformationTab';
import RouteInformationTab from './RouteInformationTab';


const { TabPane } = Tabs;

export const SchoolInformation = () => {
    return (
        <div className="container">
            <Card style={{ marginTop: 20 }}>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Thông tin trường" key="1">
                        <SchoolInformationTab />
                    </TabPane>
                    <TabPane tab="Thông tin tuyến xe" key="2">
                        <RouteInformationTab />
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
};

export default SchoolInformation;
