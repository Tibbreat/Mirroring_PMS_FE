import { useCallback, useState, useEffect } from "react";
import { Pagination, Spin, Card, Row, Col, Input, Select, Button, Form, Modal, notification } from "antd";
import NoData from "../../../component/no-data-page/NoData";
import { ProviderTable } from "../../../component/table/ProviderTable";
import { gettransportProvidersAPI } from "../../../services/service.transportprovider";
import { useNavigate } from "react-router-dom";
import Loading from "../../common/Loading";



const ListTransportProvider = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [provider, setProvider] = useState([]);

    const navigate = useNavigate();

    const fetchProvider = useCallback(async (page) => {
        setLoading(true);
        try {
            const response = await gettransportProvidersAPI(page, null);
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
                <Button type="primary" onClick={() => navigate('/pms/manage/transport/provider/new-provider')} >Thêm đối tác</Button>
            </Col>
            {loading ? (
                <Loading />
            ) : provider.length > 0 ? (
                <>

                    <ProviderTable data={provider} providerType="transport" />
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
                        title={"Không có nhà cung cấp vận chuyển nào"}
                        subTitle={"Danh sách nhà cung cấp sẽ xuất hiện khi bạn thêm dữ liệu vào hệ thống"}
                    />
                </div>

            )}
        </Card>
    );
};

export default ListTransportProvider;