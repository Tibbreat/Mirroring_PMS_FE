import { EditOutlined } from "@ant-design/icons"
import { Button, Col, Descriptions, Form, Modal, Row } from "antd"
import Title from "antd/es/skeleton/Title"

export const ParentDetail = ({ childrenData }) => {
    const [formUpdateParent] = Form.useForm()

    return (
        <>
            <Row justify="space-between" className='mb-3'>
                <Col><Title level={5}>Thông tin phụ huynh</Title></Col>
                <Col><Button type="link" icon={<EditOutlined />} > Chỉnh sửa thông tin </Button></Col>
            </Row>
            <Descriptions bordered column={6}>
                <Descriptions.Item label="Họ và tên cha" span={3}>{childrenData?.fatherName}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại " span={3}>{childrenData?.fatherPhone}</Descriptions.Item>
                <Descriptions.Item label="Họ và tên mẹ" span={3}>{childrenData?.motherName}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại " span={3}>{childrenData?.motherPhone} </Descriptions.Item>
            </Descriptions>

            <Modal
                title="Cập nhật thông tin phụ huynh"
                okText="Cập nhật"
                cancelText="Đóng"
                width={800}
            >
                <Form form={formUpdateParent} layout="vertical">
                    <Row gutter={16}>
                        <Title level={5}>Câp nhât thông tin phụ huynh</Title>
                    </Row>
                </Form>
            </Modal>
        </>
    )
}