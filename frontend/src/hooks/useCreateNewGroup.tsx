import { useState } from "react";
import { notifyError } from "../components/Toasts";
import { useChatsContext } from "../context/ChatsContext";
import { publicUserDetailsProps } from "../types";

const useCreateNewGroup = () => {
  const { setSelectedChat, onGoingChats, setOnGoingChats } = useChatsContext();

  const [isSending, setIsSending] = useState(false);

  const createNewGroup = async (
    name: string,
    participants: publicUserDetailsProps[]
  ) => {
    setIsSending(true);

    try {
      if (!name) {
        notifyError("Missing group name");
        return 
      }

      if (participants.length === 0) {
        notifyError("Missing group participants");
        return null;
      }

      const res = await fetch('/api/users/new-group', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({name: name, participants: participants }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (onGoingChats) {
        const newChatArray = [...onGoingChats];
        //Turn this into a for, break when found the chat id, shift the index to the front!
        newChatArray.unshift(data);
        setOnGoingChats(newChatArray);
      } else {
        setOnGoingChats(data);
      }
      setSelectedChat(data.chat_id)
    } catch (error) {
      if (error instanceof Error) {
        notifyError(error.message);
      } else {
      }
    } finally {
      setIsSending(false);
    }
  };

  return { createNewGroup, isSending };
};

export default useCreateNewGroup;
