import { useChatsContext } from '../../context/ChatsContext';
import { useAuthContext } from '../../context/AuthContext';
import ChatInput from './ChatInput';
import useFetchChatMsgs from '../../hooks/useFetchChatMsgs';
import { useEffect, useState } from 'react';
import { ChatMessages } from '../../types';

const Chat = () => {
  const { selectedChat } = useChatsContext();
  const { authUser } = useAuthContext();
  const { chatMessages, isLoading } = useFetchChatMsgs();

  const [messages, setMessages] = useState<ChatMessages[]>([]);

  useEffect(() => {
    if (!selectedChat) {
      setMessages([]);
      return;
    }

    const selectedMessages = chatMessages.find((item) => item.chat.chat_id === selectedChat.chat_id);

    if (selectedMessages) {
      setMessages(selectedMessages.chat.messages);
    }
  }, [selectedChat, chatMessages]); // Adding chatMessages as a dependency ensures updates are captured

  if (!authUser) {
    // TODO: Send to home page!
    return null;
  }

  if (!selectedChat) {
    // TODO: ADD the landing banner here!
    return <p>Landing Banner</p>;
  }

  // We create a variable to compare and store the dates of all the messages to render the day they were sent in
  let lastDate = new Date("2000-01-01");

  return (
    <section className='flex-col w-full chat-section'>
      <div className="flex-col w-full" style={{ marginTop: '2rem', padding: "0rem 4rem", gap: '0.15rem' }}>
        {messages.map((item, index) => {
          let isOwnMsg = false;
          const MessageDate = new Date(item.created_at.replace(' ', 'T'));
          let isDateChange = false;

          if (MessageDate.getDate() !== lastDate.getDate()) {
            lastDate = MessageDate;
            isDateChange = true;
          }
          if (item.sender_id === authUser.id) {
            isOwnMsg = true;
          }
          return (
            <div className='w-full flex-col day-bubble' key={index}>
              {isDateChange ? <span>{lastDate.getDate() + "/" + lastDate.getMonth() + "/" + lastDate.getFullYear()}</span> : <></>}
              <div className='flex-row w-full' style={{ justifyContent: isOwnMsg ? "end" : "start" }}>
                <div className='chat-bubble' style={{ backgroundColor: isOwnMsg ? '#005C4B' : '#202C33' }}>
                  <p>{item.text}</p>
                  <p className='msg-time'>{MessageDate.getHours() + ":" + MessageDate.getMinutes()}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {/* INPUT SECTION */}
      <ChatInput />
    </section>
  )
}

export default Chat;
