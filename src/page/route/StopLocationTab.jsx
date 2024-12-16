import { useEffect, useState } from "react";
import { fetchStopLocationAPI } from "../../services/services.route";
import { Button, Row, Steps } from "antd";
import { EditOutlined } from "@ant-design/icons";

export const StopLocationTab = ({ id, routeActive, role }) => {
    const [stopLocations, setStopLocations] = useState([]);

    // Fetch stop location data
    const fetchStopLocation = async () => {
        try {
            const response = await fetchStopLocationAPI(id);
            setStopLocations(response?.data || []);
        } catch (error) {
            console.error("Error fetching stop locations:", error.message || error);
        }
    };

    // Fetch stop locations when 'id' changes
    useEffect(() => {
        if (id) fetchStopLocation();
    }, [id]);

    return (
        <>
            <Row justify="end" className="mb-3">
                {!routeActive && role === "ADMIN" && (
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={openModalEdit}
                    >
                        Chỉnh sửa các điểm dừng
                    </Button>
                )}
            </Row>

            <Steps
                direction="horizontal"
                current={stopLocations.length - 1}
                progressDot
            >
                {stopLocations
                    .sort((a, b) => a.stopOrder - b.stopOrder)
                    .map((stop) => (
                        <Steps.Step
                            key={stop.id}
                            title={<span style={{ fontSize: "12px" }}>{stop.locationName}</span>}
                        />
                    ))}
            </Steps>
        </>
    );
};
