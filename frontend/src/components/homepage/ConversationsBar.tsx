import { Search } from 'lucide-react';
import { useChatsContext } from '../../context/ChatsContext';
import { OnGoingChatsProps } from '../../types';
import useFetchOnGoingChats from '../../hooks/useFetchOnGoingChats';
import { useEffect, useState } from 'react';

const ConversationsBar = () => {
	
    const { isLoading } = useFetchOnGoingChats();

    const {selectedChat, setSelectedChat, onGoingChats} = useChatsContext();

    const [filteredChats, setFilteredChats] = useState(onGoingChats);
    const [searchInput, setSearchInput] = useState("");
  
    //USE EFFECT THAT HANDLES THE UPDATE OF THE SEARCH INPUT
    useEffect(() => {
      if (searchInput === "") {
        setFilteredChats(onGoingChats);
      } else {
        if (onGoingChats) {
            const filteredItems = onGoingChats.filter((chat) => chat.chat_name.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase()));
            setFilteredChats(filteredItems);
        }
      }
    }, [searchInput, onGoingChats]);

    const handleSelectChat = (item: OnGoingChatsProps) => {
        setSelectedChat(item.chat_id);
    };

    if (!filteredChats) {
        // TODO: Style this return
        if (isLoading) {
            return (
                //TODO: How to do skeletons!?
                <p>Loading!</p>
            )
        } else {
            return (
                <p>
                No active conversations
            </p>
        )
    }
    }


  return (
    <div className='w-full'>
        <section className='search-bar w-full'>
            <input placeholder='Search' className='w-full' value={searchInput} onChange={(e) => {setSearchInput(e.target.value)}}/>
            <Search style={{position: 'absolute', left: '1rem', paddingTop: '0.55rem'}} size={20} />
        </section>
        {filteredChats.length === 0 ?
        <p className='w-full no-results'>No search results for: {searchInput}</p>
      :
      <></>}
        <ul className='chats-list w-full h-full'>
            {filteredChats.map((item) => {
                if (item.messages.length === 0) {
                    return null;
                }
                //We need to convert the timestamp format from postgres to date in javascript
                const lastMessageDate = new Date(item.messages[item.messages.length-1].created_at.replace(' ', 'T'));
                //If the last msg is from today, we just print the hour, else we print the date
                const today = new Date();
                let isToday = false;
                if (lastMessageDate.getDate() === today.getDate() && lastMessageDate.getMonth() === today.getMonth() && lastMessageDate.getFullYear() === today.getFullYear()) {
                    isToday = true;
                }

                let lastSender = "You";

                // The participants array is missing the auth user! So if it doesnt find any, it is hardcoded to be the user!
                item.participants.forEach((user) => {
                    if (user.id === item.messages[item.messages.length -1].sender_id) {
                        lastSender = user.fullname;
                    }
                });
                //TODO: Render hour or day depending if its today or no
                return (
                    <li key={item.chat_id} onClick={()=> {handleSelectChat(item)}} style={{backgroundColor: selectedChat === item.chat_id ? '#2A3942' : ''}}>
                        <div className='flex-row' style={{alignItems: 'center', gap: '0.5rem'}}>
                            <img  className="profile-picture-bubble " src={item.chat_picture || "https://www.shutterstock.com/image-vector/gray-avatar-icon-design-photo-600nw-1274338147.jpg"} alt="User's Picture" />
                            <div className='flex-col' style={{gap: '0.5rem'}}>
                                <p className='user-name'>{item.chat_name}</p>
                                <p className='message-preview'>{lastSender +": " + item.messages[item.messages.length-1].text}</p>
                            </div>
                        </div>
                        <p className='msg-date-preview'>
                            { 
                            isToday ? 
                            lastMessageDate.getHours() + ":" + lastMessageDate.getMinutes() : 
                            lastMessageDate.toLocaleDateString()
                            }
                        </p>
                    </li>
                )
            })}
        </ul>
     </div>
)
}

export default ConversationsBar