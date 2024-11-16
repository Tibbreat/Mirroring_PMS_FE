import { useParams } from "react-router-dom";
import { changeStatusRouteAPI, fetchRouteAPI, fetchStopLocationAPI } from "../../services/services.route";
import { useEffect, useState } from "react";
import { Button, Card, Col, Descriptions, Divider, Row, Switch, Tabs, Steps, Modal, message } from "antd";
import Title from "antd/es/typography/Title";
import { EditOutlined } from '@ant-design/icons';
import { VehicleTab } from "./VehicleTab";
import { ChildrenTab } from "./ChildrenTab";
import { StopLocationTab } from "./StopLocationTab";
const { TabPane } = Tabs;
const { Step } = Steps;

const RouteInformation = () => {
    const { id } = useParams();
    const [route, setRoute] = useState();

    // Fetch data
    const fetchRoute = async () => {
        try {
            const response = await fetchRouteAPI(id);
            setRoute(response.data);
        } catch (error) {
            console.error('Error fetching route:', error);
        }
    };





    useEffect(() => {
        fetchRoute();
    }, [id]);



    const handleSwitchChange = async () => {
        Modal.confirm({
            title: 'Xác nhận thay đổi trạng thái',
            content: 'Bạn có chắc chắn muốn thay đổi trạng thái của tuyến?',
            onOk: async () => {
                try {
                    await changeStatusRouteAPI(id);
                    message.success('Thay đổi trạng thái thành công');
                    fetchRoute();
                    fetchChildrenData();
                } catch (error) {
                    console.error('Error changing route status:', error);
                    message.error('Có lỗi xảy ra. Vui lòng thử lại sau');
                }
            },
        });
    };

    return (
        <div className='container'>
            <Card style={{ marginTop: 20 }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24}>
                        <Row justify="space-between" className='mb-3'>
                            <Col><Title level={5}>Thông tin tuyến</Title></Col>
                            <Col><Button type="link" icon={<EditOutlined />}>Chỉnh sửa thông tin</Button></Col>
                        </Row>
                        <Descriptions bordered column={6}>
                            <Descriptions.Item label="Tên tuyến" span={4}>{route?.routeName}</Descriptions.Item>
                            <Descriptions.Item label="Trạng thái" span={2}> <Switch checked={route?.isActive} onClick={handleSwitchChange} /> </Descriptions.Item>
                            <Descriptions.Item label="Điểm bắt đầu" span={4}>{route?.startLocation}</Descriptions.Item>
                            <Descriptions.Item label="Thời gian đón" span={2}>{route?.pickupTime}</Descriptions.Item>
                            <Descriptions.Item label="Điểm kết thúc" span={4}>{route?.endLocation}</Descriptions.Item>
                            <Descriptions.Item label="Thời gian trả" span={2}>{route?.dropOffTime}</Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
                <Divider />
                <Col xs={24} sm={16} className="container">
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Danh sách phương tiện" key="1">
                            <VehicleTab
                                id={id}
                                routeActive={route?.isActive} />
                        </TabPane>
                        <TabPane tab="Danh sách các chặng" key="2">
                            <StopLocationTab
                                id={id}
                                routeActive={route?.isActive}
                            />
                        </TabPane>
                        <TabPane tab="Danh sách trẻ đăng ký" key="3">
                            <ChildrenTab
                                ìd={id}
                                routeActive={route?.isActive}
                            />
                        </TabPane>
                    </Tabs>
                </Col>
            </Card>
        </div>
    );
};

export default RouteInformation;