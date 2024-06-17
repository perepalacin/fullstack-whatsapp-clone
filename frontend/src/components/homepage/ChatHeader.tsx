import { EllipsisVertical, Search } from "lucide-react"
import { useChatsContext } from "../../context/ChatsContext"
import HoverBox from "../extras/HoverBox";
import { OnGoingChatsProps } from "../../types";
import { useEffect, useState } from "react";

const ChatHeader = () => {

  const {selectedChat, onGoingChats} = useChatsContext();

  const [activeChat, setActiveChat] = useState<OnGoingChatsProps>();

  useEffect(() => {
    if (onGoingChats) {
      const chatObject = onGoingChats.find((item) => item.chat_id === selectedChat);
      setActiveChat(chatObject);
    }
  }, [selectedChat])


  return (
    <section className="profile-banner w-full flex-row">
      <div className="flex-row" style={{gap: '1rem', alignItems: 'center', padding: 0}}>
    <img className="profile-picture-bubble " src={"https://xsgames.co/randomusers/assets/avatars/male/36.jpg"} alt="User's Picture" />
    <p>{activeChat?.chat_name}</p>
      </div>
    <div className="flex-row">
        <button className ="icon-button" onClick={() => {}}> 
          <Search />
          <HoverBox prompt={"Search..."} />
         </button>
        {/* TODO: Open dialog to create new group */}
        <button className ="icon-button" onClick={() => {}}>
          <EllipsisVertical />
          <HoverBox prompt={"Menu"} />
        </button>

    </div>
</section>  
  )
}

export default ChatHeader