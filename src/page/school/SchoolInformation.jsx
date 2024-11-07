import React, { useState, useEffect, useContext } from 'react';
import { Card, Spin, message, Tabs, Form } from 'antd';
import SchoolInformationTab from './SchoolInformationTab';
import AcademicYearInformation from './AcademicYearInformation';


const { TabPane } = Tabs;

export const SchoolInformation = () => {
    return (
        <div className="container">
            <Card className="m-2">
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Thông tin trường" key="1">
                        <SchoolInformationTab />
                    </TabPane>
                    <TabPane tab="Thông tin chi tiết năm học" key="2">
                        <AcademicYearInformation />
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
};

export default SchoolInformation;
