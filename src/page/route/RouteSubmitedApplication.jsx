import { Button, Card, Col, message, Modal, Row, Select, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { getAcademicYearsAPI } from "../../services/services.public";
import { approveApplicationAPI, fetchRouteApplications, fetchRouteReportByAcademicYear } from "../../services/services.route";
import { RouteReportCard } from "./RouteReportCard";
import dayjs from "dayjs";
import Loading from "../common/Loading";

const { Option } = Select;

export const RouteSubmitedApplication = () => {
    const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
    const [selectedRouteId, setSelectedRouteId] = useState(null);
    const [academicYears, setAcademicYears] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const currentYear = dayjs().year();
    const nextYear = currentYear + 1;
    const defaultAcademicYear = `${currentYear}-${nextYear}`;

    useEffect(() => {
        const fetchAcademicYears = async () => {
            try {
                const response = await getAcademicYearsAPI();
                setAcademicYears(response.data);
            } catch (error) {
                console.error("Error fetching academic years:", error);
            }
        };

        fetchAcademicYears();
        setSelectedAcademicYear(defaultAcademicYear);
        fetchRoutes(defaultAcademicYear);
    }, []);

    const fetchRoutes = async (academicYear) => {
        try {
            setLoading(true);
            const response = await fetchRouteReportByAcademicYear(academicYear);
            setRoutes(response.data);
        } catch (error) {
            console.error("Error fetching routes:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchApplications = async (academicYear, routeId) => {
        try {
            setLoading(true);
            const response = await fetchRouteApplications(academicYear, routeId);
            setData(response.data);
        } catch (error) {
            console.error("Error fetching route applications:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAcademicYearChange = (value) => {
        setSelectedAcademicYear(value);
        fetchRoutes(value);
    };

    const handleCardClick = (routeId) => {
        setSelectedRouteId(routeId);
        fetchApplications(selectedAcademicYear, routeId);
    };

    const columns = [
        { title: "Tên trẻ", dataIndex: "childrenName", key: "childrenName" },
        { title: "Điểm đón", dataIndex: "stopLocationName", key: "stopLocationName" },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                switch (status) {
                    case "PENDING":
                        return <Tag color="orange">Đang chờ xếp xe</Tag>;
                    case "APPROVED":
                        return <Tag color="green">Đã xếp xe</Tag>;
                    case "REJECTED":
                        return <Tag color="red">Đã bị từ chối</Tag>;
                    default:
                        return <Tag>Không xác định</Tag>;
                }
            },
        },
        {
            title: "Xe",
            dataIndex: "vehicleName",
            key: "vehicleName",
            render: (vehicleName) => {
                return vehicleName ? vehicleName : <Tag color="red">Không có</Tag>;
            },
        },
        {
            title: "Hành động",
            key: "action",
            align: "center",
            render: (record) => {
                return (
                    (record.status === "PENDING") &&
                    <Button type="link" size="small" onClick={() => onClick(record)}>
                        Xếp xe
                    </Button>
                );
            },
        },
    ];

    const onClick = (record) => {
        console.log("record", record);
        Modal.confirm({
            title: "Xác nhận xếp xe",
            content: `Bạn có chắc chắn muốn hệ thống tự động xếp xe cho ${record.childrenName} không?`,
            onOk: async () => {
                const payload = {
                    applicationId: record.applicationId,
                    routeId: record.routeId,
                    childrenId: record.childrenId,
                    stopLocationId: record.stopLocationId,
                };
                try {
                    console.log("payload", payload);
                    await approveApplicationAPI(payload);
                    message.success("Đã xếp xe thành công");
                    fetchApplications(selectedAcademicYear, selectedRouteId);
                    fetchRoutes(selectedAcademicYear);
                    Modal.destroyAll();
                } catch (error) {
                    console.error("Error approving application:", error);
                    message.error("Xếp xe thất bại: " + error.data.data);
                }
            },
            onCancel() {
                console.log("Cancel");
            },
        });
    };


    return (
        <Card className="m-2">
            <Row gutter={[16, 16]} className="m-2">
                <Col xs={24} sm={12} md={8}>
                    <Select
                        placeholder="Năm học"
                        style={{ width: "100%" }}
                        onChange={handleAcademicYearChange}
                        defaultValue={defaultAcademicYear}
                    >
                        {academicYears.map((year) => (
                            <Option key={year} value={year}>
                                {year}
                            </Option>
                        ))}
                    </Select>
                </Col>
            </Row>

            {loading ? (
                <Loading />
            ) : (
                <Row gutter={[16, 16]} className="m-2">
                    <Col xs={24} md={8} className="route-report-card-container">
                        {routes.map((route) => (
                            <RouteReportCard
                                key={route.routeId}
                                route={route}
                                onCardClick={handleCardClick}
                                isSelected={selectedRouteId === route.routeId}
                            />
                        ))}
                    </Col>
                    <Col xs={24} md={16}>
                        <Table
                            columns={columns}
                            dataSource={data}
                            rowKey="applicationId"
                            bordered
                            size="small"
                            className="m-2"
                            pagination={{ defaultPageSize: 10 }} />
                    </Col>
                </Row>
            )}
        </Card>
    );
};