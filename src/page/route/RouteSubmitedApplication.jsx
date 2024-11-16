import { Card, Col, Row, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { getAcademicYearsAPI } from "../../services/services.public";
import { fetchAvailableRoutesAPI, fetchRouteApplications } from "../../services/services.route";
import { RouteSubmittedApplicationTable } from "../../component/table/RouteRegisterApplicationTable";
import dayjs from "dayjs";
import Loading from "../common/Loading";
import { RouteReportCard } from "./RouteReportCard";

const { Option } = Select;

export const RouteSubmitedApplication = () => {
    const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [academicYears, setAcademicYears] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const currentYear = dayjs().year();
    const nextYear = currentYear + 1;
    const defaultAcademicYear = `${currentYear}-${nextYear}`;

    // Fetch academic years
    const fetchAcademicYears = async () => {
        try {
            const response = await getAcademicYearsAPI();
            setAcademicYears(response.data);
        } catch (error) {
            console.error("Error fetching academic years:", error);
        }
    };

    // Fetch route applications
    const fetchApplications = async (academicYear) => {
        try {
            setLoading(true);
            const response = await fetchRouteApplications(academicYear, selectedRoute);
            setData(response.data);
        } catch (error) {
            console.error("Error fetching route applications:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableRoutes = async () => {
        try {
            const response = await fetchAvailableRoutesAPI();
            setRoutes(response.data);
        } catch (error) {
            console.error("Error fetching available routes:", error);
        }
    };
    // Handle academic year change
    const handleAcademicYearChange = (value) => {
        setSelectedAcademicYear(value);
        fetchApplications(value);
    };

    const handleRouteChange = (value) => {
        setSelectedRoute(value);
    }

    useEffect(() => {
        fetchAcademicYears();
        fetchAvailableRoutes()
        setSelectedAcademicYear(defaultAcademicYear);
    }, []);

    useEffect(() => {
        fetchApplications(defaultAcademicYear, selectedRoute);
    }, [selectedAcademicYear, selectedRoute]);

    return (
        <Card className="m-2">
            <Row gutter={[16, 16]} className="m-2">
                <Col span={12}>
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
                <Col span={12}>
                    <Select
                        placeholder="Tuyến đường"
                        style={{ width: "100%" }}
                        onChange={handleRouteChange}
                        allowClear
                    >
                        {routes.map((r) => (
                            <Option key={r.id} value={r.id}>
                                {r.routeName}
                            </Option>
                        ))}
                    </Select>
                </Col>
            </Row>

            <Row gutter={[16, 16]} justify="space-around" className="m-2">
                <RouteReportCard />
            </Row>

            {loading ? (
                <Loading />
            ) : (
                <RouteSubmittedApplicationTable data={data} />
            )}
        </Card>
    );
};