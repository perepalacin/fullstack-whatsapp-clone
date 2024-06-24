import { useChatsContext } from '../../context/ChatsContext';
import { useAuthContext } from '../../context/AuthContext';
import ChatInput from './ChatInput';
import useFetchChatMsgs from '../../hooks/useFetchChatMsgs';
import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { ChatMessages, publicUserDetailsProps } from '../../types';

const Chat = () => {
  const { systemAdminId, selectedChat, onGoingChats } = useChatsContext();
  const { authUser } = useAuthContext();
  
  const [messages, setMessages] = useState<ChatMessages[]>([]);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  
  const { fetchMoreMessages} = useFetchChatMsgs();

  useEffect(() => {
    if (!selectedChat) {
      setMessages([]);
      return;
    }

    if (onGoingChats) {
      const selectedMessages = onGoingChats.find((item) => item.chat_id === selectedChat);
      if (selectedMessages) {
        console.log(selectedMessages.messages);
        setMessages(selectedMessages.messages);
          if (chatContainerRef.current && selectedMessages.messages.length <= 20) {
              chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
      }
    }

    const handleScroll = () => {
      const container = chatContainerRef.current;
      if (container && container.scrollTop === 0) {
        fetchMoreMessages();
      }
    };

    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      
      // Clean up the event listener on component unmount
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [selectedChat, onGoingChats]);

  useLayoutEffect(() => {
    if (onGoingChats) {
      onGoingChats.forEach((chat) => {
        if (chat.chat_id === selectedChat) {
          if (chat.messages.length <= 20 ) {
            if (chatContainerRef.current) {
              chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
          }
        }
      })
    }
  }, [messages, onGoingChats]);

  if (!authUser) {
    // TODO: Send to home page!
    return null;
  }

  if (!selectedChat) {
    // TODO: ADD the landing banner here!
    return (
      <section className='landing-banner flex-col' style={{height: '100vh'}}>
      </section>
    );
  }

  let lastDate = new Date("2000-01-01");
  let lastSender = "";

  let isGroupChat = false;
  if (onGoingChats) {
    for (let i = 0; i < onGoingChats.length; i++) {
      if (onGoingChats[i].chat_id === selectedChat && onGoingChats[i].chat_type === "group") {
        isGroupChat = true;
        break;
      }
    }
  }

  return (
    <section className='flex-col w-full chat-section'>
      <div 
      ref={chatContainerRef} 
      className="flex-col w-full chat-container"
      style={{ 
        padding: "0rem 4rem", 
        gap: '0.15rem', 
        overflowY: 'auto', 
        maxHeight: '70vh',
        // scrollBehavior: 'smooth' // Enable smooth scrolling
      }}
      >
        {messages.map((item, index) => {
          
          let isFirstBubble = false;
          if (item.sender_id !== lastSender) {
            lastSender = item.sender_id;
            isFirstBubble = true;
          }
          let isOwnMsg = false;
          
          const MessageDate = new Date(item.created_at.replace(' ', 'T'));
          let isDateChange = false;
          let today = new Date();
          
          if (MessageDate.getDate() !== lastDate.getDate()) {
            lastDate = MessageDate;
            isDateChange = true;
          }
          if (item.sender_id === authUser.id) {
            isOwnMsg = true;
          }

          let senderFullname = "";
          if (isGroupChat && onGoingChats && !isOwnMsg) {
            for (let i = 0; i < onGoingChats.length; i++) {
              if (onGoingChats[i].chat_id === selectedChat) {
                onGoingChats[i].participants.forEach((participant: publicUserDetailsProps) => {
                  if (participant.id === item.sender_id) {
                    senderFullname = participant.fullname;
                  }
                })
              }
            }
          }

          if (item.sender_id === systemAdminId) {
            return (
              <div className='w-full flex-col day-bubble' key={index}>
              {isDateChange ? <span>{lastDate.toLocaleDateString() === today.toLocaleDateString() ? "TODAY" : lastDate.toLocaleDateString()}</span> : <></>}
              <div className='w-full flex-col day-bubble' key={index}>
              <span>{item.text}</span> 
              </div>
            </div>
            )
          }
          return (
            <div className='w-full flex-col day-bubble' key={index}>
              {isDateChange ? <span>{lastDate.toLocaleDateString() === today.toLocaleDateString() ? "TODAY" : lastDate.toLocaleDateString()}</span> : <></>}
              <div className='flex-row w-full' style={{ justifyContent: isOwnMsg ? "end" : "start" }}>
                <div className='chat-bubble' style={{ backgroundColor: isOwnMsg ? '#005C4B' : '#202C33' }}>
                  {!isOwnMsg && isGroupChat ? <p>{senderFullname}</p>: <></>}
                  <p>{item.text}</p>
                  <p className='msg-time'>{MessageDate.getHours() + ":" + MessageDate.getMinutes()}</p>
                  <div className={`${isFirstBubble ? 'chat-bubble-origin' : ''} ${isOwnMsg ? 'chat-bubble-own': 'chat-bubble-not-own'}`} >
                  </div>
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
