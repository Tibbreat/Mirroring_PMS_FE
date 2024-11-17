import { Card, Statistic, Row, Col, Tag } from "antd";

export const RouteReportCard = ({ route, onCardClick, isSelected }) => {
    const { routeName, totalRegister, countRegistered, countApproved, routeId } = route;

    const cardStyle = {
        width: "100%",
        cursor: "pointer",
        maxHeight: '250px',
        overflowY: 'auto',
        border: isSelected ? "1px solid #1890ff" : "1px solid #d9d9d9",
        boxShadow: isSelected ? "0 4px 4px rgba(24, 144, 255, 0.6)" : "none",
    };

    const renderStatisticTag = (color, title, value) => (
        <Tag color={color} style={{ width: '100%', textAlign: 'center' }}>
            <Statistic title={title} value={value} />
        </Tag>
    );

    return (
        <Card
            className="m-2"
            title={routeName}
            style={cardStyle}
            onClick={() => onCardClick(routeId)}
            bordered
            hoverable
        >
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8}>
                    {renderStatisticTag("blue", "Tổng đăng ký", totalRegister)}
                </Col>
                <Col xs={24} sm={12} md={8}>
                    {renderStatisticTag("orange", "Chờ xếp xe", countRegistered)}
                </Col>
                <Col xs={24} sm={12} md={8}>
                    {renderStatisticTag("green", "Đã xếp xe", countApproved)}
                </Col>
            </Row>
        </Card>
    );
};