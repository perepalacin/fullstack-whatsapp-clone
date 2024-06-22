import { useEffect, useState } from "react";
import { notifyError } from "../components/Toasts";
import { useChatsContext } from "../context/ChatsContext";

const useFetchChatMsgs = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { selectedChat, onGoingChats, setOnGoingChats } = useChatsContext();

  useEffect(() => {
    const fetchChatMessages = async () => {
      if (!selectedChat || !onGoingChats) {
        // do not fetch if no chat is selected or if we havent fetched the ongoing chats of the user
        return;
      }

      // Do not fetch already fetched chats or newly created chats that do not exist
      for (let i = 0; i < onGoingChats.length; i++) {
        if (
          (onGoingChats[i].chat_id === selectedChat &&
            onGoingChats[i].messages.length > 1) ||
          onGoingChats[i].chat_id.startsWith("new-")
        ) {
          return;
        }
      }

      //even better,send the actual length of the array in the params of the api, fetch from the length + 50.
      setIsLoading(true);
      try {
        const res = await fetch(`/api/msg/chat/${selectedChat}/0`);
        const data = await res.json();

        if (data.error) {
          throw new Error(data.error.message);
        }

        const newChatArray = [...onGoingChats];
        newChatArray.forEach((item) => {
          if (item.chat_id === selectedChat) {
            item.messages = data;
          }
        });
        setOnGoingChats(newChatArray);
      } catch (error) {
        if (error instanceof Error) {
          notifyError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatMessages();
  }, [selectedChat]); // Dependency array ensures this runs only when selectedChat changes

  const fetchMoreMessages = async () => {
    if (!selectedChat || !onGoingChats) {
      // do not fetch if no chat is selected or if we havent fetched the ongoing chats of the user
      return;
    }

    let offset = 0;
    // Do not fetch already fetched chats or newly created chats that do not exist
    
    for (let i = 0; i < onGoingChats.length; i++) {
      if (
        onGoingChats[i].chat_id === selectedChat &&
        onGoingChats[i].messages.length % 20 !== 0
      ) {
        //No more msgs to fetch
        return;
      } else if (onGoingChats[i].chat_id === selectedChat) {
        offset = onGoingChats[i].messages.length;
      }
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/msg/chat/${selectedChat}/${offset}`);
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error.message);
      }


      const newChatArray = [...onGoingChats];
      newChatArray.forEach((item) => {
          if (item.chat_id === selectedChat) {
            for (let i = data.length -1 ; i >= 0; i--) {
                item.messages.unshift(data[i]);
            }
          }
      });
      setOnGoingChats(newChatArray);
    } catch (error) {
      if (error instanceof Error) {
        notifyError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, fetchMoreMessages };
};

export default useFetchChatMsgs;
