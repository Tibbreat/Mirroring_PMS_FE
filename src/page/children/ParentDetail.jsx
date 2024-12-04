import React, { useEffect, useState } from "react";
import { Button, Col, Descriptions, Form, Input, Modal, Row, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import { updateParentInfo } from "../../services/services.user";

export const ParentDetail = ({ data, role }) => {
    const [formUpdateParent] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [childrenData, setChildrenData] = useState(null);

    useEffect(() => {
        if (data) {
            setChildrenData(data);
        }
    }, [data]);

    const showModalChange = () => {
        if (childrenData) {
            setIsModalVisible(true);
            formUpdateParent.setFieldsValue({
                father: {
                    fullName: childrenData.fatherName,
                    phone: childrenData.fatherPhone,
                },
                mother: {
                    fullName: childrenData.motherName,
                    phone: childrenData.motherPhone,
                },
            });
        }
    };

    const updateParent = async (values) => {
        setLoading(true);
        try {
            const requestPayload = {
                childrenId: childrenData.id,
                father: {
                    fullName: values.father.fullName,
                    phone: values.father.phone,
                },
                mother: {
                    fullName: values.mother.fullName,
                    phone: values.mother.phone,
                },
            };

            await updateParentInfo(requestPayload);
            message.success("Cập nhật thông tin phụ huynh thành công");
            setIsModalVisible(false);
            setChildrenData(prevData => ({
                ...prevData,
                fatherName: values.father.fullName,
                fatherPhone: values.father.phone,
                motherName: values.mother.fullName,
                motherPhone: values.mother.phone,
            }));
        } catch (error) {
            message.error("Cập nhật thông tin phụ huynh thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Row justify="space-between" className="mb-3">
                <Col><Title level={5}>Thông tin phụ huynh</Title></Col>
                <Col>
                    {role === 'CLASS_MANAGER' && (<Button type="link" icon={<EditOutlined />} onClick={showModalChange}>Chỉnh sửa thông tin</Button>)}</Col>
            </Row>
            <Descriptions bordered column={6}>
                <Descriptions.Item label="Họ và tên cha" span={3}>{childrenData?.fatherName}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại" span={3}>{childrenData?.fatherPhone}</Descriptions.Item>
                <Descriptions.Item label="Họ và tên mẹ" span={3}>{childrenData?.motherName}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại" span={3}>{childrenData?.motherPhone}</Descriptions.Item>
            </Descriptions>

            <Modal
                title="Cập nhật thông tin phụ huynh"
                okText="Cập nhật"
                open={isModalVisible}
                onOk={() => {
                    formUpdateParent.validateFields().then((values) => {
                        updateParent(values); // Call the API
                    });
                }}
                onCancel={() => setIsModalVisible(false)}
                cancelText="Đóng"
                width={800}
            >
                <Form form={formUpdateParent} layout="vertical">
                    <Row gutter={16}>
                        <Title level={5}>Thông tin bố</Title>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name={['father', 'fullName']}
                                label="Họ và tên"
                                rules={[{ required: true, message: 'Vui lòng nhập tên bố' }]}>
                                <Input placeholder="Nhập tên bố" disabled={loading} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name={['father', 'phone']}
                                label="Số điện thoại"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại bố' }]}>
                                <Input placeholder="Nhập số điện thoại bố" disabled={loading} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Title level={5}>Thông tin mẹ</Title>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name={['mother', 'fullName']}
                                label="Họ và tên"
                                rules={[{ required: true, message: 'Vui lòng nhập tên mẹ' }]}>
                                <Input placeholder="Nhập tên mẹ" disabled={loading} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name={['mother', 'phone']}
                                label="Số điện thoại"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại mẹ' }]}>
                                <Input placeholder="Nhập số điện thoại mẹ" disabled={loading} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};
