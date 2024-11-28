import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, Typography, Row, Col, Button, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { getSchoolInformationAPI, updateSchoolInformation } from '../../services/service.school';
import { AuthContext } from '../../component/context/auth.context';

const { Title } = Typography;

const SchoolInformationTab = () => {
  const [isEdit, setIsEdit] = useState(true);
  const [initialValues, setInitialValues] = useState({});
  const [form] = Form.useForm();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDataSchool = async () => {
      try {
        const response = await getSchoolInformationAPI(user.schoolId);
        const data = response.data;
        setInitialValues(data);
        form.setFieldsValue(data);
      } catch (error) {
        console.error('Failed to fetch school:', error);
      }
    };

    fetchDataSchool();
  }, [form, user.schoolId]);

  const handleEditClick = () => {
    setIsEdit(!isEdit);
  };

  const handleCancelClick = () => {
    setIsEdit(true);
    form.setFieldsValue(initialValues);
  };

  const handleSaveClick = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      if (JSON.stringify(values) === JSON.stringify(initialValues)) {
        message.info('Không có gì thay đổi');
        setIsEdit(true);
        setLoading(false);
        return;
      }
      try {
        await updateSchoolInformation(values);
        message.success('Cập nhật thông tin thành công');
        setInitialValues(values);
        setIsEdit(true);
        setLoading(false);
      } catch (error) {
        message.error('Có lỗi xảy ra trong quá trình cập nhật thông tin');
        console.error('Failed to update:', error);
        setLoading(false);
      }

    } catch (error) {
      console.error('Failed to save:', error);
      setLoading(false);
    }
  };

  return (
    <>
      <Row justify="end" className='mb-3'>
        <Col>
          <Button type="link" icon={<EditOutlined />} onClick={handleEditClick} hidden={!isEdit}>
            Chỉnh sửa thông tin
          </Button>
        </Col>
      </Row>
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Tên trường" name="schoolName"
              rules={[{ required: true, message: 'Vui lòng nhập tên trường' },
              { pattern: /^(?!\s*$).+$/, message: 'Tên trường không được chứa toàn khoảng trắng.' }
              ]}>
              <Input disabled={isEdit} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Số điện thoại liên hệ" name="phoneContact"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: /^(?!\s*$).+$/, message: 'Tên trường không được chứa toàn khoảng trắng.' }
              ]}>
              <Input disabled={isEdit} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Email liên hệ" name="emailContact"
              rules={[{ required: true, message: 'Vui lòng nhập email' },
              { pattern: /^(?!\s*$).+$/, message: 'Tên trường không được chứa toàn khoảng trắng.' }
              ]}>
              <Input disabled={isEdit} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Địa chỉ trường" name="schoolAddress"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' },
              { pattern: /^(?!\s*$).+$/, message: 'Tên trường không được chứa toàn khoảng trắng.' }
              ]}>
              <Input disabled={isEdit} />
            </Form.Item>
          </Col>
        </Row>
        <Title level={4}>Thông tin hiệu trưởng</Title>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Tên hiệu trưởng" name={['principal', 'fullName']}
              rules={[{ required: true, message: 'Vui lòng nhập tên hiệu trưởng' },
              { pattern: /^(?!\s*$).+$/, message: 'Tên trường không được chứa toàn khoảng trắng.' }
              ]}>
              <Input disabled={isEdit} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Số điện thoại" name={['principal', 'phone']}
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: /^(?!\s*$).+$/, message: 'Tên trường không được chứa toàn khoảng trắng.' }
              ]}>
              <Input disabled={isEdit} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center">
          <Button type="primary" htmlType="submit" hidden={isEdit} onClick={handleSaveClick} loading={loading} className='me-5'>
            Lưu
          </Button>
          <Button type="default" htmlType="button" hidden={isEdit} onClick={handleCancelClick}>
            Hủy
          </Button>
        </Row>
      </Form>
    </>
  );
};

export default SchoolInformationTab;