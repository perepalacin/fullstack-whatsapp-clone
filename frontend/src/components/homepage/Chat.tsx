import { SendHorizonal, Smile } from 'lucide-react'
import { useChatsContext } from '../../context/ChatsContext';
import { useEffect, useState } from 'react';
import { ChatMessages } from '../../types';
import { notifyError } from '../Toasts';
import { useAuthContext } from '../../context/AuthContext';

const Chat = () => {
  const {selectedChat} = useChatsContext();
  const {authUser} = useAuthContext();
  const [chatMessages, setChatMessages] = useState<ChatMessages[]>([]);

  if (!authUser) {
    //TODO: Send to home page!
    return null;
  }

  useEffect(() => {
    if (!selectedChat) {
      // Skip fetching if no chat is selected
      return;
    }

    const fetchChatMessages = async () => {
      try {
        const res = await fetch(`/api/msg/chat/${selectedChat.chat_id}`);
        const data = await res.json();

        console.log(data);
        if (data.error) {
          throw new Error(data.error.message);
        }

        setChatMessages(data);
      } catch (error) {
        if (error instanceof Error) {
          notifyError(error.message);
        }
      }
    };

    fetchChatMessages();
  }, [selectedChat]); // Dependency array ensures this runs only when selectedChat changes

  if (!selectedChat || !chatMessages) {
    // TODO: ADD the landing banner here!
    return <p>Landing Banner</p>;
  }

  //TOOD: FIX BACKGROUND OPACITY ISSUE!
  return (
    <section className='flex-col w-full chat-section' >
        <div  className= "flex-col w-full" style={{padding: "0rem 4rem"}}>
          {chatMessages.map((item) => {
            let isOwnMsg = false;
            if (item.sender_id === authUser.id) {
              isOwnMsg = true;
            } 
            return (
              <div className='flex-row w-full' style={{justifyContent: isOwnMsg ? "end" : "start"}}>
                <div className='chat-bubble'>
                  <p>{item.text}</p>
                </div>
              </div>
            )
          })}
        </div>
        {/* INPUT SECTION */}
        <div className='message-bar w-full flex-row'>
          <Smile size={24} />
            <input placeholder='Type a message' className='w-full' style={{padding: "0.75rem 0.75rem"}}/>
          <SendHorizonal size={24}/>
        </div>

        
    </section>
  )
}

export default Chat