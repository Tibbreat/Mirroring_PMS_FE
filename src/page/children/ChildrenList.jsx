import { Pagination, Spin, Card, Row, Col, Input, Select, Button, Form, notification } from "antd";
import { useCallback, useState, useEffect, useContext } from "react";
import { ChildrenTable } from "../../component/table/ChildrenTable";
import { getChildrenAPI } from "../../services/service.children";
import { AuthContext } from "../../component/context/auth.context";
import NoData from "../../component/no-data-page/NoData";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { getAcademicYearsAPI } from "../../services/services.public";

const { Option } = Select;

const ChildrenList = () => {
    const [loading, setLoading] = useState(true);
    const [childrenList, setChildrenList] = useState([]);
    const [form] = Form.useForm();
    const { user } = useContext(AuthContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAcademicYear, setSelectedAcademicYear] = useState(getDefaultAcademicYear());
    const [academicYears, setAcademicYears] = useState([]);
    const navigate = useNavigate();

    const fetchAcademicYear = useCallback(async () => {
        try {
            const response = await getAcademicYearsAPI();
            setAcademicYears(response.data || []);
        } catch (error) {
            console.error('Error fetching academic years:', error);
        }
    }, []);

    const fetchChildrenList = useCallback(async (page = 1, academicYear, search) => {
        setLoading(true);
        try {
            const response = await getChildrenAPI(page, academicYear, search);
            setChildrenList(response.data.listData || []);
            setTotal(response.data.total || 0);
        } catch (error) {
            console.error('Error fetching children list:', error);
            notification.error({ message: "Failed to load children data" });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAcademicYear();
    }, [fetchAcademicYear]);

    useEffect(() => {
        fetchChildrenList(currentPage, selectedAcademicYear, searchTerm);
    }, [currentPage, selectedAcademicYear, searchTerm, fetchChildrenList]);

    const handleAcademicYearChange = (value) => {
        setSelectedAcademicYear(value || getDefaultAcademicYear());
        setCurrentPage(1);  // Reset to the first page on filter change
    };

    const handleSearch = (value) => {
        setSearchTerm(value.trim());
        setCurrentPage(1);  // Reset to the first page on search
    };

    return (
        <Card style={{ margin: 20 }}>
            <Row gutter={[16, 16]} justify="center" style={{ marginBottom: 20 }}>
                <Col xs={24} sm={8}>
                    <Select
                        placeholder="Năm học"
                        style={{ width: '100%' }}
                        onChange={handleAcademicYearChange}
                        value={selectedAcademicYear}
                        allowClear
                    >
                        {academicYears.map((year) => (
                            <Option key={year} value={year}>
                                {year}
                            </Option>
                        ))}
                    </Select>
                </Col>

                <Col xs={24} sm={16}>
                    <Input.Search
                        placeholder="Nhập tên trẻ cần tìm"
                        enterButton
                        onSearch={handleSearch}
                    />
                </Col>
            </Row>
            <Col span={24} style={{ marginBottom: 20, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" onClick={() => navigate('/pms/manage/children/add-children')} >
                    Thêm học sinh
                </Button>
            </Col>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <Spin size="large" />
                </div>
            ) : childrenList.length > 0 ? (
                <>
                    <ChildrenTable data={childrenList} providerType="transport" />
                    <Pagination
                        current={currentPage}
                        total={total}
                        onChange={(page) => setCurrentPage(page)}
                        style={{ textAlign: 'center', marginTop: 20 }}
                    />
                </>
            ) : (
                <div className="d-flex justify-content-center align-items-center">
                    <NoData
                        title="Không có trẻ nào"
                        subTitle="Danh sách trẻ sẽ xuất hiện khi bạn thêm dữ liệu vào hệ thống"
                    />
                </div>
            )}
        </Card>
    );
};

// Helper function to get the default academic year based on the current date
function getDefaultAcademicYear() {
    const currentYear = moment().year();
    return `${currentYear}-${currentYear + 1}`;
}

export default ChildrenList;