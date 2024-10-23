import React, { useState, useEffect, useContext, useRef } from 'react';
import { Drawer, List, Avatar, Input, Typography, Button, Modal, Select, message } from 'antd';
import { database, ref, onValue, set } from '../../services/firebaseConfig';
import { AuthContext } from '../context/auth.context';
import { getUserAPI, getUserOpnionWithUserNameAPI } from '../../services/services.user';
import { v4 as uuidv4 } from 'uuid';

const { Search, TextArea } = Input;
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

  const showCreateChatModal = async () => {
    setIsModalVisible(true);
    try {
      const response = await getUserOpnionWithUserNameAPI('PARENT');
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
        setActiveChat({
          ...chat,
          sender1: chatData.sender1,
          sender2: chatData.sender2,
          messages: [...Object.values(chatData.sender1?.contents || {}), ...Object.values(chatData.sender2?.contents || {})],
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
      message.success('Đoạn chat mới đã được tạo.');
      setIsModalVisible(false);
      setSelectedUser(null);
    });
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const senderKey = user.id === activeChat.sender1?.id ? 'sender1' : 'sender2';
    const messageId = uuidv4();
    const messageRef = ref(database, `chats/${activeChat.chatId}/${senderKey}/contents/${messageId}`);
    set(messageRef, {
      content: newMessage,
      time: Date.now(),
    }).then(() => {
      setNewMessage('');
      const chatRef = ref(database, `chats/${activeChat.chatId}`);
      onValue(chatRef, (snapshot) => {
        const updatedChatData = snapshot.val();
        const updatedMessages = [...Object.values(updatedChatData.sender1?.contents || {}), ...Object.values(updatedChatData.sender2?.contents || {})];
        updatedMessages.sort((a, b) => a.time - b.time);
        setActiveChat((prevChat) => ({
          ...prevChat,
          messages: updatedMessages,
        }));
        scrollToBottom(); // Ensure scroll to bottom
      });
    });
  };

  // Styling for messages based on who sent them
  const getMessageBubbleStyle = (messageSender) => ({
    justifyContent: messageSender === user.id ? 'flex-end' : 'flex-start', // Align right for user, left for others
    marginBottom: '10px',
  });

  const getMessageStyle = (messageSender) => ({
    backgroundColor: messageSender === user.id ? '#DCF8C6' : '#FFFFFF', // Green for the logged-in user, white for others
    color: '#000',
    padding: '10px 20px',
    borderRadius: messageSender === user.id ? '20px 20px 0px 20px' : '20px 20px 20px 0px', // Different border radii based on sender
    maxWidth: '50%', // Restrict width
    wordWrap: 'break-word',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)',
  });


  return (
    <Drawer
      title={isChatOpen ? `Đang trò chuyện với ${activeChat?.fullName}` : 'Đoạn chat'}
      placement="right"
      onClose={() => {
        onClose();
        setIsChatOpen(false);
      }}
      open={isVisible}
      width={500} // Moderate drawer width
      bodyStyle={{ padding: 0 }} // Remove any additional padding on the drawer to prevent unnecessary scrollbars
    >
      {!isChatOpen && (
        <>
          <Button type="primary" onClick={showCreateChatModal} style={{ marginBottom: 16, display: 'block', margin: '0 auto' }}>
            Tạo đoạn chat mới
          </Button>

          <Modal title="Tạo đoạn chat mới" visible={isModalVisible} onOk={handleCreateChat} onCancel={() => setIsModalVisible(false)} okText="Tạo đoạn chat" cancelText="Hủy">
            <p>Chọn người dùng để tạo đoạn chat:</p>
            <Select style={{ width: '100%' }} placeholder="Chọn người dùng" value={selectedUser} onChange={(value) => setSelectedUser(value)}>
              {users.map((userOption) => (
                <Select.Option key={userOption.id} value={userOption.id}>
                  {userOption.username}
                </Select.Option>
              ))}
            </Select>
          </Modal>

          <List
            itemLayout="horizontal"
            dataSource={chatDetails}
            renderItem={(chat) => (
              <List.Item key={chat.chatId} style={{ padding: '10px 0' }} onClick={() => handleChatSelect(chat)}>
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
        <div style={{ height: 'calc(100vh - 160px)', overflow: 'auto', padding: '10px'}}>
          {activeChat.messages.map((msg, index) => (
            <div key={index} style={getMessageBubbleStyle(msg.senderId)}> {/* Determine alignment */}
              <div style={getMessageStyle(msg.senderId)}> {/* Apply styles */}
                <Text>{msg.content}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {new Date(msg.time).toLocaleTimeString()}
                </Text>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

      )}

      {isChatOpen && activeChat && (
        <div style={{ padding: '10px', borderTop: '1px solid #f0f0f0' }}>
          <TextArea
            rows={2}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
          />
          <Button
            type="primary"
            onClick={sendMessage}
            style={{ marginTop: 8, width: '100%' }}
          >
            Gửi tin nhắn
          </Button>
        </div>
      )}
    </Drawer>
  );
};

export default ChatDrawer;
