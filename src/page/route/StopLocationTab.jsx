import { useEffect, useState } from "react";
import { fetchStopLocationAPI } from "../../services/services.route";
import { Button, Row, Steps } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { Step } from "@tensorflow/tfjs";

export const StopLocationTab = ({ id, routeActive, role }) => {
    const [stopLocations, setStopLocations] = useState([]);

    const fetchStopLocation = async () => {
        try {
            const response = await fetchStopLocationAPI(id);
            setStopLocations(response.data);
        } catch (error) {
            console.error('Error fetching stop location:', error);
        }
    };

    useEffect(() => {
        fetchStopLocation();
    }, [id]);
    return (
        <>
            <Row justify="end" className='mb-3'>
                {!routeActive && role === 'ADMIN' && <Button type="link" icon={<EditOutlined />}>Chỉnh sửa các điểm dừng</Button>}
            </Row>
            <Steps
                direction="horizontal"
                current={stopLocations.length - 1}
                progressDot
            >
                {stopLocations
                    .sort((a, b) => a.stopOrder - b.stopOrder)
                    .map((stop) => (
                        <Step key={stop.id} title={<span style={{ fontSize: '12px' }}>{stop.locationName}</span>} />
                    ))}
            </Steps>
        </>
    );
};