import { useEffect, useState } from "react";
import { fetchStopLocationAPI } from "../../services/services.route";
import { Button, Row, Steps } from "antd";
import { EditOutlined } from "@ant-design/icons";

export const StopLocationTab = ({ id, routeActive, role, startLocation, endLocation }) => {
    const [stopLocations, setStopLocations] = useState([]);

    const fetchStopLocation = async () => {
        try {
            const response = await fetchStopLocationAPI(id);
            const fetchedStops = response?.data || [];

            // Sort stops by stopOrder and prepend startLocation, append endLocation
            const orderedStops = [
                { id: "start", locationName: startLocation || "Vị trí bắt đầu", stopOrder: 0 },
                ...fetchedStops.sort((a, b) => a.stopOrder - b.stopOrder),
                { id: "end", locationName: endLocation || "Vị trí kết thúc", stopOrder: Number.MAX_SAFE_INTEGER },
            ];

            setStopLocations(orderedStops);
        } catch (error) {
            console.error("Error fetching stop locations:", error.message || error);
        }
    };

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
                        onClick={() => console.log("Edit modal open")} // Replace with actual handler
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
                {stopLocations.map((stop, index) => (
                    <Steps.Step
                        key={stop.id}
                        title={
                            <span style={{ fontSize: "12px" }}>
                                {index === 0 ? "Vị trí bắt đầu" : index === stopLocations.length - 1 ? "Vị trí kết thúc" : stop.locationName}
                            </span>
                        }
                    />
                ))}
            </Steps>
        </>
    );
};
