import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { Drawer, List, Avatar, Input, Typography, Button, Modal, Select, message, Divider } from 'antd';
import { database, ref, onValue, set } from '../../services/firebaseConfig';
import { AuthContext } from '../context/auth.context';
import { getUserAPI } from '../../services/services.user';
import { v4 as uuidv4 } from 'uuid';
import { SendOutlined, PlusOutlined } from '@ant-design/icons';
import { getChildrenByTeacherIdAPI } from '../../services/service.children';

const { TextArea } = Input;
const { Text } = Typography;

const ChatDrawer = ({ isVisible, onClose }) => {
  const [chatDetails, setChatDetails] = useState([]); // Lưu thông tin chi tiết các đoạn chat
  const { user } = useContext(AuthContext); // Lấy thông tin user từ AuthContext
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeChat, setActiveChat] = useState(null); // Trạng thái cho đoạn chat hiện tại
  const [newMessage, setNewMessage] = useState(''); // Trạng thái tin nhắn mới
  const chatEndRef = useRef(null); // To auto-scroll

  const [isChatOpen, setIsChatOpen] = useState(false); // Điều khiển giao diện chat

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Lấy danh sách các đoạn chat từ Firebase và người đối thoại
  useEffect(() => {
    const chatsRef = ref(database, 'chats');
    onValue(chatsRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const chatPromises = [];
        Object.keys(data).forEach((chatId) => {
          const chat = data[chatId];
          if (chat.sender1?.id === user.id || chat.sender2?.id === user.id) {
            const otherUserId = chat.sender1?.id === user.id ? chat.sender2.id : chat.sender1.id;
            let lastMessage = 'Chưa có tin nhắn';
            let lastMessageTime = '';
            const allMessages = [...Object.values(chat.sender1?.contents || {}), ...Object.values(chat.sender2?.contents || {})];
            if (allMessages.length > 0) {
              allMessages.sort((a, b) => a.time - b.time);
              lastMessage = allMessages[allMessages.length - 1].content;
              lastMessageTime = new Date(allMessages[allMessages.length - 1].time).toLocaleString();
            }
            console.log(otherUserId);
            chatPromises.push(
              getUserAPI(otherUserId).then((response) => ({
                chatId,
                fullName: response.data.fullName,
                avatar: response.data.avatar,
                lastMessage,
                lastActive: lastMessageTime,
                messages: allMessages,
              }))
            );
          }
        });
        const resolvedChats = await Promise.all(chatPromises);
        setChatDetails(resolvedChats);
      }
    });
  }, [user.id]);

  const showCreateChatModal = async (id) => {
    setIsModalVisible(true);
    try {
      const response = await getChildrenByTeacherIdAPI(user.id);
      setUsers(response.data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách người dùng.');
    }
  };

  const handleChatSelect = (chat) => {
    const chatRef = ref(database, `chats/${chat.chatId}`);
    onValue(chatRef, (snapshot) => {
      const chatData = snapshot.val();
      if (chatData) {
        // Gộp tin nhắn từ sender1 và sender2
        const messages = [
          ...Object.entries(chatData.sender1?.contents || {}).map(([id, msg]) => ({ ...msg, messageId: id })),
          ...Object.entries(chatData.sender2?.contents || {}).map(([id, msg]) => ({ ...msg, messageId: id })),
        ];
  
        messages.sort((a, b) => a.time - b.time); // Sắp xếp tin nhắn theo thời gian
        setActiveChat({
          ...chat,
          sender1: chatData.sender1,
          sender2: chatData.sender2,
          messages,
        });
      }
    });
    setIsChatOpen(true);
  };
  

  const handleCreateChat = () => {
    if (!selectedUser) {
      message.error('Vui lòng chọn một người để tạo đoạn chat.');
      return;
    }

    const chatId = uuidv4();
    const newChatRef = ref(database, `chats/${chatId}`);
    set(newChatRef, {
      sender1: {
        id: user.id,
        contents: {},
      },
      sender2: {
        id: selectedUser,
        contents: {},
      },
      
    }).then(() => {
      console.log(selectedUser);
      message.success('Đoạn chat mới đã được tạo.');
      setIsModalVisible(false);
      setSelectedUser(null);
    });
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
  
    // Kiểm tra xem người dùng hiện tại là sender1 hay sender2
    const senderKey = user.id === activeChat.sender1?.id ? 'sender1' : 'sender2';
    const messageId = uuidv4();
    const messageRef = ref(database, `chats/${activeChat.chatId}/${senderKey}/contents/${messageId}`);
    
    // Thêm tin nhắn vào Firebase
    set(messageRef, {
      content: newMessage,
      time: Date.now(),
    }).then(() => {
      setNewMessage('');
      // Cập nhật lại tin nhắn sau khi gửi
      const chatRef = ref(database, `chats/${activeChat.chatId}`);
      onValue(chatRef, (snapshot) => {
        const updatedChatData = snapshot.val();
        const updatedMessages = [
          ...Object.entries(updatedChatData.sender1?.contents || {}).map(([id, msg]) => ({ ...msg, messageId: id })),
          ...Object.entries(updatedChatData.sender2?.contents || {}).map(([id, msg]) => ({ ...msg, messageId: id })),
        ];
        updatedMessages.sort((a, b) => a.time - b.time);
        setActiveChat((prevChat) => ({
          ...prevChat,
          messages: updatedMessages,
        }));
        scrollToBottom(); // Cuộn xuống cuối tin nhắn
      });
    });
  };
  


  // Styling for messages based on who sent them


  return (
    <Drawer
      title={isChatOpen ? `Đang trò chuyện với ${activeChat?.fullName}` : 'Đoạn chat'}
      placement="right"
      onClose={() => {
        onClose();
        setIsChatOpen(false);
      }}
      open={isVisible}
      width={500}

    >
      {!isChatOpen && (
        <>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showCreateChatModal}
            className='create-chat-button mb-3 d-block mx-auto btn-success'
          // style={{  display: 'block', margin: '0 auto' }}
          >
            Tạo đoạn chat mới
          </Button>

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
                   <Select.Option 
                   key={userOption.parentId} 
                   value={userOption.parentId} 
                   label={`${userOption.parentName} - phụ huynh cháu ${userOption.fullName}`}
                 >
                  {userOption.parentName} - phụ huynh cháu {userOption.fullName}
                </Select.Option>
              ))}
            </Select>
          </Modal>

          <List
            itemLayout="horizontal"
            dataSource={chatDetails}
            renderItem={(chat) => (
              <List.Item
                key={chat.chatId}
                style={{ padding: '10px 20px', cursor: 'pointer' }}
                onClick={() => handleChatSelect(chat)}
              >
                <List.Item.Meta
                  avatar={<Avatar src={chat.avatar} />}
                  title={<Text strong>{chat.fullName}</Text>}
                  description={
                    <>
                      <Text type="secondary" ellipsis>
                        {chat.lastMessage}
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {chat.lastActive}
                      </Text>
                    </>
                  }
                />
              </List.Item>
            )}
            style={{ maxHeight: '40vh', overflowY: 'auto' }}
          />
        </>
      )}

      {isChatOpen && activeChat && (
        <div className={`messages`} style={{ height: 'calc(100vh - 160px)', overflow: 'auto', padding: '10px' }}>
          <div className="chat-messages">
            {activeChat.messages.map((msg, index) => {
              const isSender1 = Object.keys(activeChat.sender1?.contents || {}).includes(msg.messageId);
              const sender = isSender1 ? activeChat.sender1 : activeChat.sender2;
              const isCurrentUserSender = sender.id === user.id;

              return (
                <div key={index} className={`message-container ${isCurrentUserSender ? 'message-right' : 'message-left'}`}>
                  <div className="message-bubble">
                    <Text>{msg.content}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {new Date(msg.time).toLocaleTimeString()}
                    </Text>
                  </div>
                </div>
              );
            })}

          </div>
          <div ref={chatEndRef} />
        </div>
      )}

      {isChatOpen && activeChat && (
        <div style={{ padding: '10px', borderTop: '1px solid #f0f0f0', backgroundColor: '#fafafa' }}>
          <TextArea
            rows={2}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            autoSize={{ minRows: 2, maxRows: 6 }}
            style={{ borderRadius: '10px' }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={sendMessage}
            style={{ marginTop: 8, width: '100%', borderRadius: '10px' }}
          >
            Gửi tin nhắn
          </Button>
        </div>
      )}
    </Drawer>
  );
};

export default ChatDrawer;