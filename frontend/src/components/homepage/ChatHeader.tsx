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

  if (!selectedChat) {
    return (
      <section className="landing-banner flex-col" style={{height: '100vh'}}>
      </section>
    )
  }

  return (
    <section className="profile-banner w-full flex-row" style={{paddingLeft: '1rem'}}>
      <div className="flex-row" style={{gap: '1rem', alignItems: 'center', padding: 0}}>
        {/* How can i fix this error? */}
    <img className="profile-picture-bubble " src={activeChat?.chat_picture || "https://www.shutterstock.com/image-vector/gray-avatar-icon-design-photo-600nw-1274338147.jpg"} alt="User's Picture" />
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