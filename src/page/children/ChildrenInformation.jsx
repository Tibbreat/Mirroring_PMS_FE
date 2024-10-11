import React, { useState, useEffect, useContext } from 'react';
import { Spin, Row, Col, Button, Input, Modal, message, Card, Descriptions, Divider, Switch, List, Collapse, Avatar } from 'antd';
import { useParams } from 'react-router-dom';

import { getChildDetailAPI } from '../../services/service.children';
import { AuthContext } from '../../component/context/auth.context';
import { getUserAPI } from '../../services/services.user';
import { updateBoardingRegistrationAPI } from '../../services/service.children';
import { updateTransportRegistrationAPI } from '../../services/service.children';

const ChildrenInformation = () => {
    const [childrenData, setChildrenData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { id } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const { user } = useContext(AuthContext);
    const [updateType, setUpdateType] = useState('');
    const { Panel } = Collapse;
    const [parentData, setParentData] = useState([]); // Đổi thành mảng
    const [fieldValues, setFieldValues] = useState({
        childName: '',
        childAge: null,
        childBirthDate: '',
        childAddress: '',
        isRegisterForBoarding: false,
        isRegisterForTransport: false,
        lastModifyById: user?.id,
    });
    const showModalForBoarding = () => {
        setIsModalVisible(true);
        setUpdateType('boarding'); // Để biết đang xử lý phần đăng ký nội trú
    };

    const showModalForTransport = () => {
        setIsModalVisible(true);
        setUpdateType('transport'); // Để biết đang xử lý phần đăng ký xe đưa đón
    };
    // Đồng bộ fieldValues với childrenData khi nó thay đổi
    useEffect(() => {
        if (childrenData) {
            setFieldValues({
                childName: childrenData.childName,
                childAge: childrenData.childAge,
                childBirthDate: childrenData.childBirthDate,
                childAddress: childrenData.childAddress,
                isRegisterForBoarding: childrenData.isRegisterForBoarding,
                isRegisterForTransport: childrenData.isRegisterForTransport,
                lastModifyById: user?.id,
            });
        }
    }, [childrenData]);

    const fetchChildrenData = async (id) => {
        setLoading(true);
        try {
            const response = await getChildDetailAPI(id);
            setChildrenData(response.data);
            // Gọi fetchParentData cho từng parentId trong relationships
            response.data.relationships.forEach(rel => {
                fetchParentData(rel.parentId);
            });
        } catch (error) {
            console.error('Error fetching children data:', error);
        } finally {
            setLoading(false);
        }
    };
    const onChange = (key) => {
        console.log(key); // In ra key của panel đang được mở
    };
    const fetchParentData = async (id) => {
        try {
            const response = await getUserAPI(id);
            setParentData(prevData => {
                // Kiểm tra xem phụ huynh đã tồn tại trong danh sách chưa
                const exists = prevData.some(parent => parent.id === response.data.id);
                if (!exists) {
                    return [...prevData, response.data]; // Thêm phụ huynh mới vào mảng
                }
                return prevData; // Nếu đã tồn tại, không thay đổi gì
            });
        } catch (error) {
            console.error('Error fetching parent data:', error);
        }
    };

    useEffect(() => {
        fetchChildrenData(id);
    }, [id]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (field, value) => {
        setFieldValues((prevValues) => ({
            ...prevValues,
            [field]: value,
        }));
    };

    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleOk = async () => {
        try {
            if (updateType === 'boarding') {
                // Đặt newStatus là giá trị ngược lại của trạng thái hiện tại
                const newStatus = !fieldValues.isRegisterForBoarding;
                await updateBoardingRegistrationAPI(id, newStatus);
                message.success('Cập nhật đăng ký nội trú thành công');
            } else if (updateType === 'transport') {
                // Đặt newStatus là giá trị ngược lại của trạng thái hiện tại
                const newStatus = !fieldValues.isRegisterForTransport;
                await updateTransportRegistrationAPI(id, newStatus);
                message.success('Cập nhật đăng ký xe đưa đón thành công');
            }
            // Gọi API để lấy dữ liệu mới sau khi cập nhật
            await fetchChildrenData(id);
        } catch (error) {
            console.error('Error updating registration status:', error);
        } finally {
            setIsModalVisible(false);
        }
    };
    const handleSave = async () => {
        try {
            // Gọi API để cập nhật thông tin trẻ em
            await updateChildren(id, fieldValues);
            message.success('Cập nhật thông tin trẻ em thành công');
            await fetchChildrenData(id); // Refresh lại thông tin
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating Children Information:', error);
        }
    };

    const handleDelete = async () => {
        setIsModalVisible(false);
        try {
            await deleteChildren(id);
            message.success('Xóa thông tin trẻ em thành công');
            // Redirect hoặc thực hiện hành động sau khi xóa
        } catch (error) {
            console.error('Error deleting Children:', error);
        }
    };

    const showDeleteModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    if (loading) {
        return (
            <div className='d-flex justify-content-center align-items-center' style={{ height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="container">
            <Card style={{ marginTop: 20 }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={8} className='d-flex flex-column align-items-center'>
                        <Avatar size={256} src={childrenData?.imageUrl || "/image/5856.jpg"} />
                    </Col>
                    <Col xs={24} sm={16}>
                        <Descriptions title="Thông tin trẻ em" bordered>
                            <Descriptions.Item label="Tên trẻ em" span={3}>
                                {isEditing ? (
                                    <Input
                                        value={fieldValues.childName}
                                        onChange={(e) => handleInputChange('childName', e.target.value)}
                                    />
                                ) : (
                                    <span>{childrenData?.childName}</span>
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tuổi" span={3}>
                                {isEditing ? (
                                    <Input
                                        type="number"
                                        value={fieldValues.childAge}
                                        onChange={(e) => handleInputChange('childAge', e.target.value)}
                                    />
                                ) : (
                                    <span>{childrenData?.childAge}</span>
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày sinh" span={3}>
                                {isEditing ? (
                                    <Input
                                        type="date"
                                        value={fieldValues.childBirthDate}
                                        onChange={(e) => handleInputChange('childBirthDate', e.target.value)}
                                    />
                                ) : (
                                    <span>{childrenData?.childBirthDate}</span>
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ" span={3}>
                                {isEditing ? (
                                    <Input
                                        value={fieldValues.childAddress}
                                        onChange={(e) => handleInputChange('childAddress', e.target.value)}
                                    />
                                ) : (
                                    <span>{childrenData?.childAddress}</span>
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Đăng ký nội trú" span={3}>
                                <Switch
                                    checked={fieldValues.isRegisterForBoarding}
                                    onClick={showModalForBoarding}
                                />
                            </Descriptions.Item>
                            <Descriptions.Item label="Đăng ký xe đưa đón" span={3}>
                                <Switch
                                    checked={fieldValues.isRegisterForTransport}
                                    onClick={showModalForTransport}
                                />
                            </Descriptions.Item>
                            <Descriptions.Item label="Quan hệ" span={3}>
                                {isEditing ? (
                                    <Input
                                        type="text"
                                        value={fieldValues.relationships.map(rel => `${rel.relationship} (ID: ${rel.parentId})`).join(', ')}
                                    />
                                ) : (
                                    <Collapse defaultActiveKey={['1']} onChange={onChange}>
                                        {childrenData?.relationships.map((rel, index) => {
                                            const parentInfo = parentData.find(parent => parent.id === rel.parentId);
                                            return (
                                                <Panel header={`Phụ huynh ${index + 1}`} key={rel.parentId}>
                                                    <p>
                                                        <strong>Quan hệ:</strong> {rel.relationship} <br />
                                                        <strong>Tên phụ huynh:</strong> {parentInfo ? parentInfo.fullName : 'Không tìm thấy tên'} <br />
                                                        <strong>Đại diện:</strong> {rel.isRepresentative ? 'Có' : 'Không'}
                                                    </p>
                                                </Panel>
                                            );
                                        })}
                                    </Collapse>
                                )}
                            </Descriptions.Item>

                        </Descriptions>
                    </Col>
                </Row>
                <Divider />
                <Row justify="space-between">
                    <Button type="primary" onClick={isEditing ? handleSave : handleEditClick}>
                        {isEditing ? 'Lưu' : 'Sửa Thông Tin'}
                    </Button>
                    <Button type="danger" onClick={showDeleteModal}>
                        Xóa
                    </Button>
                </Row>
            </Card>
            <Modal
                title="Thay đổi trạng thái đăng ký"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <p>
                    {updateType === 'boarding'
                        ? fieldValues.isRegisterForBoarding
                            ? 'Bạn có muốn hủy đăng ký nội trú?'
                            : 'Bạn có muốn đăng ký nội trú?'
                        : fieldValues.isRegisterForTransport
                            ? 'Bạn có muốn hủy đăng ký xe đưa đón?'
                            : 'Bạn có muốn đăng ký xe đưa đón?'}
                </p>
            </Modal>
        </div>
    );
};

export default ChildrenInformation;
