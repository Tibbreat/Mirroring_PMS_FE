import { useCallback, useState, useEffect } from "react";
import { Pagination, Spin, Card, Row, Col, Input, Select, Button } from "antd";
import NoData from "../../../component/no-data-page/NoData";
import { ProviderTable } from "../../../component/table/ProviderTable";


const { Option } = Select;

const ListFoodProvider = () => {
    const [provider, setProvider] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchProvider = useCallback(async (page) => {
        setLoading(true);
        try {

            setProvider(response.data.listData);
            setTotal(response.data.total);
        } catch (error) {
            console.error('Error fetching provider:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProvider(currentPage);
    }, [currentPage, fetchProvider]);

    return (
        <Card style={{ margin: 20 }}>
            <Row gutter={[16, 16]} justify="center" style={{ marginBottom: 20 }}>
                <Col xs={24} sm={16}>
                    <Input.Search
                        placeholder="Nhập tên nhà cung cấp cần tìm"
                        enterButton
                        onSearch={(value) => console.log(value)}
                    />
                </Col>
            </Row>
            <Col span={24} style={{ marginBottom: 20, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" >Thêm đối tác</Button>
            </Col>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <Spin size="large" />
                </div>
            ) : provider.length > 0 ? (
                <>

                    <ProviderTable data={provider} />
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
                        title={"Không có nhà cung cấp vận chuyển nào nào"}
                        subTitle={"Danh sách nhà cung cấp sẽ xuất hiện khi bạn thêm dữ liệu vào hệ thống"}
                    />
                </div>

            )}
        </Card>
    );
};

export default ListFoodProvider;