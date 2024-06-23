import { useEffect } from 'react'
import { useSocketContext } from '../context/SocketContext'
import { useChatsContext } from '../context/ChatsContext';
import { ChatMessages, OnGoingChatsProps } from '../types';


const useListenToNewMsgs = () => {
  const {socket} = useSocketContext();
  const {onGoingChats, setOnGoingChats} = useChatsContext();

  useEffect(() => {

    socket?.on("newMsg", (newMessage: ChatMessages[]) => {
        if (onGoingChats) {
            const newChatArray = [...onGoingChats];
            //Turn this into a for, break when found the chat id, shift the index to the front! 
            for (let i = 0; i < newChatArray.length; i++) {
                if (newChatArray[i].chat_id === newMessage[0].chat_id) {
                    newChatArray[i].messages.push(newMessage[0]);
                    newChatArray.unshift(newChatArray.splice(i, 1)[0]);
                    break;
                }
            }

            setOnGoingChats(newChatArray);
            const notification = new Audio("/whatsapp_notification.mp3");
            notification.play();
        }
    })

    //Listen if a new chat is started! Meaning if the user gets a dm from someone for the firs time.
    socket?.on("newChat", (chatData: OnGoingChatsProps) => {
        if (onGoingChats) {
            const newChatArray = [...onGoingChats];
            newChatArray.unshift(chatData);
            setOnGoingChats(newChatArray);
        } else {
            setOnGoingChats([chatData]);
        }
        const notification = new Audio("/whatsapp_notification.mp3");
        notification.play();
    });
    //Remove this event once it executes so it doesnt trigger twice
    return () => {
        socket?.off("newChat");
        socket?.off("newMsg");
    }
  }, [socket, onGoingChats, setOnGoingChats]);
}

export default useListenToNewMsgs