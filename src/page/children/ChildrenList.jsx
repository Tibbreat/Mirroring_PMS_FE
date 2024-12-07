import { Pagination, Card, Row, Col, Input, Select, Button, notification, Modal } from "antd";
import { useCallback, useState, useEffect, useContext } from "react";
import { ChildrenTable } from "../../component/table/ChildrenTable";
import { getChildrenAPI, exportChildrenToExcelByAcademicYear } from "../../services/service.children";
import { AuthContext } from "../../component/context/auth.context";
import NoData from "../../component/no-data-page/NoData";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { getAcademicYearsAPI } from "../../services/services.public";
import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import Loading from "../common/Loading";

const { Option } = Select;
const { Search } = Input;

const ChildrenList = () => {
    const [loading, setLoading] = useState(true);
    const [childrenList, setChildrenList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAcademicYear, setSelectedAcademicYear] = useState(getDefaultAcademicYear());
    const [academicYears, setAcademicYears] = useState([]);
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddChildModalVisible, setIsAddChildModalVisible] = useState(false);
    const [downloadAcademicYear, setDownloadAcademicYear] = useState(getDefaultAcademicYear());

    const { user } = useContext(AuthContext);

    const fetchAcademicYears = useCallback(async () => {
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
        fetchAcademicYears();
    }, [fetchAcademicYears]);

    useEffect(() => {
        fetchChildrenList(currentPage, selectedAcademicYear, searchTerm);
    }, [currentPage, selectedAcademicYear, searchTerm, fetchChildrenList]);

    const handleAcademicYearChange = (year) => {
        setSelectedAcademicYear(year);
        setCurrentPage(1);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
        fetchChildrenList(1, selectedAcademicYear, value);
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const showAddChildModal = () => {
        setIsAddChildModalVisible(true);
    };

    const handleAddChildModalCancel = () => {
        setIsAddChildModalVisible(false);
    };

    const handleDownloadOk = async () => {
        try {
            const response = await exportChildrenToExcelByAcademicYear(downloadAcademicYear);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `danh_sach_tre_nam_hoc_${downloadAcademicYear}.xls`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("Error downloading file:", error);
            notification.error({ message: "Failed to download file" });
        } finally {
            setIsModalVisible(false);
        }
    };

    return (
        <Card className="m-2">
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
                    <Search
                        placeholder="Nhập tên trẻ cần tìm"
                        onSearch={handleSearch}
                        allowClear
                    />
                </Col>
            </Row>

            <Col span={24} style={{ marginBottom: 20, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={showModal}
                    style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50', color: '#fff', transition: 'none' }}
                >
                    Xuất Excel
                </Button>
                {user?.role === 'CLASS_MANAGER' && (
                    <Button
                        type="primary"
                        onClick={showAddChildModal}
                        icon={<PlusOutlined />}
                        className="ms-2"
                    >
                        Thêm trẻ
                    </Button>
                )}
            </Col>

            {loading ? (
                <Loading />
            ) : childrenList.length > 0 ? (
                <>
                    <ChildrenTable data={childrenList} />
                    <Pagination
                        current={currentPage}
                        total={total}
                        onChange={(page) => setCurrentPage(page)}
                        showSizeChanger={false}
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

            <Modal
                title="Chọn năm học "
                open={isModalVisible}
                onOk={handleDownloadOk}
                onCancel={handleCancel}
                okText="Tải về"
                cancelText="Đóng"
            >
                <Select
                    placeholder="Chọn năm học"
                    style={{ width: '100%' }}
                    onChange={(value) => setDownloadAcademicYear(value)}
                    value={downloadAcademicYear}
                >
                    {academicYears.map((year) => (
                        <Option key={year} value={year}>
                            {year}
                        </Option>
                    ))}
                </Select>
            </Modal>

            {/* Add Child Modal */}
            <Modal
                title="Thêm trẻ"
                open={isAddChildModalVisible}
                onCancel={handleAddChildModalCancel}
                footer={null}
            >
                <Row justify="center" gutter={16}>
                    <Col>
                        <Button
                            type="primary"
                            onClick={() => navigate('/pms/manage/children/import-children')}
                            style={{ marginBottom: 16 }}
                        >
                            Nhập bằng file Excel
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            onClick={() => {
                                setIsAddChildModalVisible(false);
                                navigate('/pms/manage/children/add-children');
                            }}
                            style={{ marginBottom: 16 }}
                        >
                            Nhập thủ công
                        </Button>
                    </Col>
                </Row>
            </Modal>
        </Card>
    );
};

// Helper function to get the default academic year based on the current date
function getDefaultAcademicYear() {
    const currentYear = moment().year();
    return `${currentYear}-${currentYear + 1}`;
}

export default ChildrenList;