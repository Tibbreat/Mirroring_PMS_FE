import React, { useState, useEffect, useContext } from 'react';
import { Drawer, List, Button, Modal, Select, message, Tag } from 'antd';
import { database, ref, onValue } from '../../services/firebaseConfig';
import { AuthContext } from '../context/auth.context';  // Import AuthContext để lấy thông tin user
import { v4 as uuidv4 } from 'uuid';  // Sử dụng để tạo ID duy nhất cho đoạn chat
import { getUserAPI, getUserOpnionWithUserNameAPI } from '../../services/services.user';  // API để lấy thông tin người dùng

const { Option } = Select;

const ChatDrawer = ({ isVisible, onClose }) => {
  const [chatDetails, setChatDetails] = useState([]);  // Lưu thông tin chi tiết các đoạn chat
  const [users, setUsers] = useState([]);  // Lưu trữ danh sách người dùng (PARENT)
  const [selectedUser, setSelectedUser] = useState(null);  // Lưu người dùng được chọn để tạo đoạn chat
  const [isModalVisible, setIsModalVisible] = useState(false);  // Quản lý hiển thị Modal
  const { user } = useContext(AuthContext);  // Lấy thông tin user từ AuthContext

  // Lấy danh sách các đoạn chat từ Firebase và người đối thoại
  useEffect(() => {
    const chatsRef = ref(database, 'chats');

    onValue(chatsRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const chatPromises = [];

        Object.keys(data).forEach((chatId) => {
          const chat = data[chatId];

          // Kiểm tra nếu người dùng hiện tại là sender1 hoặc sender2
          if (chat.sender1?.id === user.id || chat.sender2?.id === user.id) {
            const otherUserId = chat.sender1?.id === user.id ? chat.sender2.id : chat.sender1.id;
            console.log(otherUserId);
            // Lấy thông tin của otherUser từ API
            chatPromises.push(
              getUserAPI(otherUserId).then((response) => ({
                chatId,
                fullName: response.data.fullName
              }))
            );
          }
        });

        // Đợi tất cả các API được hoàn tất
        const resolvedChats = await Promise.all(chatPromises);
        setChatDetails(resolvedChats);
        console.log(chatDetails);  // Lưu chi tiết các đoạn chat
      }
    });
  }, [user.id]);

  // Hiển thị Modal và lấy danh sách người dùng (PARENT)
  const showCreateChatModal = async () => {
    setIsModalVisible(true);
    try {
      const response = await getUserOpnionWithUserNameAPI('PARENT');
      setUsers(response.data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách người dùng.');
    }
  };

  // Tạo đoạn chat mới
  const handleCreateChat = () => {
    if (!selectedUser) {
      message.error('Vui lòng chọn một người để tạo đoạn chat.');
      return;
    }

    const chatId = uuidv4();
    const newChatRef = ref(database, `chats/${chatId}`);

    // Tạo đoạn chat mới với thông tin người gửi và người nhận
    set(newChatRef, {
      sender1: {
        id: user.id,
        contents: {},
      },
      sender2: {
        id: selectedUser,
        contents: {},
      }
    }).then(() => {
      message.success('Đoạn chat mới đã được tạo.');
      setIsModalVisible(false);
      setSelectedUser(null);
    });
  };

  return (
    <Drawer
      title="Chat"
      placement="right"
      onClose={onClose}
      open={isVisible}
      width={350}
    >
      <Button
        type="primary"
        onClick={showCreateChatModal}
        style={{
          marginBottom: 16,
          display: 'block',
          margin: '0 auto'
        }}
      >
        Tạo đoạn chat mới
      </Button>

      {/* Modal để tạo đoạn chat mới */}
      <Modal
        title="Tạo đoạn chat mới"
        visible={isModalVisible}
        onOk={handleCreateChat}
        onCancel={() => setIsModalVisible(false)}
        okText="Tạo đoạn chat"
        cancelText="Hủy"
      >
        <p>Chọn người dùng để tạo đoạn chat:</p>
        <Select
          style={{ width: '100%' }}
          placeholder="Chọn người dùng"
          value={selectedUser}
          onChange={(value) => setSelectedUser(value)}
        >
          {users.map((userOption) => (
            <Option key={userOption.id} value={userOption.id}>
              {userOption.username}
            </Option>
          ))}
        </Select>
      </Modal>

      {/* Danh sách các đoạn chat với tên đầy đủ của người đối thoại */}
      <List
        size="small"
        dataSource={chatDetails}
        renderItem={(chat) => (
          <div key={chat.chatId} style={{ marginBottom: 8 }}>
            <Tag color="blue" style={{ fontSize: '16px' }}>
              Đoạn chat với: {chat.fullName}
            </Tag>
          </div>
        )}
        style={{ marginBottom: 16 }}
      />
    </Drawer>
  );
};

export default ChatDrawer;
