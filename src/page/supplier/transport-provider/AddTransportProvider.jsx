import React, { useCallback, useEffect, useState } from 'react';
import { Card, Row, Col, Button, message, Form, Input, Select, Modal, Descriptions } from 'antd';
import { getBankListAPI } from '../../../services/services.public';
import { addtransportProviderAPI } from '../../../services/service.transportprovider';

const AddTransportProvider = () => {
    const [form] = Form.useForm();
    const [banks, setBanks] = useState([]);
    const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
    const [formValues, setFormValues] = useState({});

    const fetchBankList = useCallback(async () => {
        try {
            const response = await getBankListAPI();
            setBanks(response.data.data);
        } catch (error) {
            console.error("Error fetching banks:", error);
        }
    }, []);

    useEffect(() => {
        fetchBankList();
    }, [fetchBankList]);

    const handleSave = () => {
        form.validateFields().then((values) => {
            setFormValues(values);
            setIsReviewModalVisible(true);
        }).catch((errorInfo) => {
            console.error('Validate Failed:', errorInfo);
        });
    };

    const handleConfirm = async () => {
        console.log('Form Values:', formValues);
        try {
            const response = await addtransportProviderAPI(formValues);
            message.success('Đã xác nhận thông tin nhà cung cấp vận chuyển!');
            setIsReviewModalVisible(false);
        } catch (error) {
            console.error("Error adding transport provider:", error);
            message.error('Có lỗi xảy ra khi thêm nhà cung cấp vận chuyển!');
        }
    };

    const handleCancelReview = () => {
        setIsReviewModalVisible(false);
    };

    return (
        <Card title="Thêm đơn vị vận chuyển" style={{ margin: 20 }}>
            <Form form={form} layout="vertical">
                <Row gutter={16}>
                    <Col span={16}>
                        <Form.Item
                            name="providerName"
                            label="Tên công ty"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên công ty' },
                                { pattern: /^[a-zA-Z0-9À-ỹ\s]{2,100}$/, message: 'Tên công ty phải từ 2 đến 100 ký tự và chỉ bao gồm chữ cái, số, và khoảng trắng.' }
                            ]}
                        >
                            <Input placeholder="Tên công ty" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="providerTaxCode"
                            label="Mã số thuế"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mã số thuế' },
                                { pattern: /^\d{10,13}$/, message: 'Mã số thuế phải từ 10 đến 13 chữ số.' }
                            ]}
                        >
                            <Input placeholder="Mã số thuế" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="providerPhone"
                            label="Điện thoại"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số điện thoại' },
                                { pattern: /^(?:\+84|0)?[3|5|7|8|9]\d{8}$/, message: 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng +84 hoặc 03, 05, 07, 08, 09.' }
                            ]}
                        >
                            <Input placeholder="Số điện thoại" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="providerEmail"
                            label="Email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email' },
                                { type: 'email', message: 'Email không hợp lệ.' }
                            ]}
                        >
                            <Input placeholder="Email" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="providerAddress"
                            label="Địa chỉ"
                            rules={[
                                { required: true, message: 'Vui lòng nhập địa chỉ' },
                                { pattern: /^[a-zA-Z0-9À-ỹ\s,.-]{5,200}$/, message: 'Địa chỉ phải từ 5 đến 200 ký tự và chỉ bao gồm chữ cái, số, và các dấu câu.' }
                            ]}
                        >
                            <Input placeholder="Địa chỉ" />
                        </Form.Item>
                    </Col>
                    <Col span={16}>
                        <Form.Item
                            name="representativeName"
                            label="Người đại diện"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên người đại diện' },
                                { pattern: /^[a-zA-ZÀ-ỹ\s]{2,50}$/, message: 'Tên người đại diện chỉ được chứa chữ cái và khoảng trắng, từ 2 đến 50 ký tự.' }
                            ]}
                        >
                            <Input placeholder="Người đại diện" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="representativePosition"
                            label="Chức vụ"
                            rules={[
                                { required: true, message: 'Vui lòng nhập chức vụ' },
                                { pattern: /^[a-zA-Z0-9À-ỹ\s]{2,50}$/, message: 'Chức vụ chỉ được chứa chữ cái, số và khoảng trắng, từ 2 đến 50 ký tự.' }
                            ]}
                        >
                            <Input placeholder="Chức vụ" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="totalVehicle"
                            label="Số lượng phương tiện"
                            rules={[{ required: true, message: 'Vui lòng nhập số lượng phương tiện' }]}
                        >
                            <Input type='number' min={1} placeholder="Số lượng phương tiện" />
                        </Form.Item>
                    </Col>
                    <Col span={16}>
                        <Form.Item
                            name="bankName"
                            label="Ngân hàng"
                        >
                            <Select placeholder="Chọn ngân hàng">
                                {banks.map((bank) => (
                                    <Select.Option key={bank.code} value={bank.code}>
                                        {bank.shortName} - {bank.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="bankAccountNumber"
                            label="Số tài khoản"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số tài khoản' },
                                { pattern: /^\d{6,20}$/, message: 'Số tài khoản phải từ 6 đến 20 chữ số.' }
                            ]}
                        >
                            <Input placeholder="Số tài khoản" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="beneficiaryName"
                            label="Tên người thụ hưởng"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên người thụ hưởng' },
                                { pattern: /^[a-zA-ZÀ-ỹ\s]{2,50}$/, message: 'Tên người thụ hưởng chỉ được chứa chữ cái và khoảng trắng, từ 2 đến 50 ký tự.' }
                            ]}
                        >
                            <Input placeholder="Tên người thụ hưởng" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify="end" style={{ marginTop: 20 }}>
                    <Button type="primary" onClick={handleSave}>Xác nhận</Button>
                </Row>
            </Form>

            <Modal
                title="Xác nhận thông tin"
                open={isReviewModalVisible}
                onOk={handleConfirm}
                onCancel={handleCancelReview}
            >
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Tên công ty">{formValues.providerName}</Descriptions.Item>
                    <Descriptions.Item label="Mã số thuế">{formValues.providerTaxCode}</Descriptions.Item>
                    <Descriptions.Item label="Điện thoại">{formValues.providerPhone}</Descriptions.Item>
                    <Descriptions.Item label="Email">{formValues.providerEmail}</Descriptions.Item>
                    <Descriptions.Item label="Số lượng phương tiện">{formValues.totalVehicle}</Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ">{formValues.providerAddress}</Descriptions.Item>
                    <Descriptions.Item label="Người đại diện">{formValues.representativeName}</Descriptions.Item>
                    <Descriptions.Item label="Chức vụ">{formValues.representativePosition}</Descriptions.Item>
                    <Descriptions.Item label="Ngân hàng">{banks.find(bank => bank.code === formValues.bankName)?.name}</Descriptions.Item>
                    <Descriptions.Item label="Số tài khoản">{formValues.bankAccountNumber}</Descriptions.Item>
                </Descriptions>
            </Modal>
        </Card>
    );
};

export default AddTransportProvider;
