import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Row, message } from 'antd';
import Title from 'antd/es/typography/Title';
import { changePasswordAPI } from '../../services/service.auth';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const [form] = Form.useForm();
  const [isFormValid, setIsFormValid] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  // Lấy email từ localStorage khi component được mount
  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);
  // Xử lý thay đổi giá trị của form
  const handleFormChange = () => {
    const { newPassword, reNewPassword } = form.getFieldsValue();
    const isValid = newPassword && reNewPassword && newPassword === reNewPassword;
    setIsFormValid(isValid);
  };


  const onFinish = async (values) => {
    try {
      const response = await changePasswordAPI({
        email: email,
        newPassword: values.newPassword,
        reNewPassword: values.reNewPassword,
      });
      message.success('Đổi mật khẩu thành công!');
      console.log('API Response:', response.data);
      navigate('/pms/auth/login');
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      message.error('Đổi mật khẩu thất bại, vui lòng thử lại.');
    }
  };
  return (
    <div className="login-page d-flex justify-content-center align-items-center vh-100">
      <Card className="forgot-password-card" style={{ width: 500 }}>
        <Row justify="center">
          <Title level={1}>Đổi mật khẩu</Title>
        </Row>
        <Form
          layout="vertical"
          name="change_password"
          form={form}
          onFinish={onFinish}
          onValuesChange={handleFormChange} // Theo dõi thay đổi giá trị của form
        >
          <Row justify="center">
            <Title level={5}>
              Vui lòng nhập mã xác minh đã được gửi về e-mail
            </Title>
          </Row>
          <Row justify="center">
            <Form.Item
              label="Mã xác minh"
              name="otp"
              rules={[
                { required: true, message: 'Vui lòng nhập mã xác minh!' },
                { pattern: /^[0-9]{6}$/, message: 'Mã xác minh phải là 6 chữ số.' },
              ]}
              style={{ width: '80%' }}
            >
              <Input placeholder="Mã xác minh" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu mới"
              name="newPassword"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự.' },
              ]}
              style={{ width: '80%' }}
            >
              <Input.Password placeholder="Mật khẩu mới" />
            </Form.Item>

            <Form.Item
              label="Xác nhận mật khẩu"
              name="reNewPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('Mật khẩu xác nhận không khớp!')
                    );
                  },
                }),
              ]}
              style={{ width: '80%' }}
            >
              <Input.Password placeholder="Xác nhận mật khẩu" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={!isFormValid} // Enable khi tất cả điều kiện hợp lệ
              >
                Đổi mật khẩu
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default ChangePassword;
