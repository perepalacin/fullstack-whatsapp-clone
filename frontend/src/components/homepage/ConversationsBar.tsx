import { Search } from 'lucide-react';
import { useChatsContext } from '../../context/ChatsContext';
import { OnGoingChatsProps } from '../../types';
import useFetchOnGoingChats from '../../hooks/useFetchOnGoingChats';

const ConversationsBar = () => {
	
    const { isLoading } = useFetchOnGoingChats();

    const {selectedChat, setSelectedChat, onGoingChats} = useChatsContext();

    const handleSelectChat = (item: OnGoingChatsProps) => {
        setSelectedChat(item.chat_id);
    };

    if (!onGoingChats) {
        // TODO: Style this return
        return (
            <p>
                No active conversations
            </p>
        )
    }

  return (
    <div className='w-full'>
        <section className='search-bar w-full'>
            <input placeholder='Search' className='w-full'/>
            <Search style={{position: 'absolute', left: '1rem', paddingTop: '0.55rem'}} size={20} />
        </section>
        <ul className='chats-list w-full'>
            {onGoingChats.map((item, index) => {
                //We need to convert the timestamp format from postgres to date in javascript
                const lastMessageDate = new Date(item.messages[item.messages.length-1].created_at.replace(' ', 'T'));
                //If the last msg is from today, we just print the hour, else we print the date
                const today = new Date();
                let isToday = false;
                if (lastMessageDate.getDate() === today.getDate() && lastMessageDate.getMonth() === today.getMonth() && lastMessageDate.getFullYear() === today.getFullYear()) {
                    isToday = true;
                }
                //TODO: Render hour or day depending if its today or no
                return (
                    <li key={index} onClick={()=> {handleSelectChat(item)}} style={{backgroundColor: selectedChat === item.chat_id ? '#2A3942' : ''}}>
                        <div className='flex-row' style={{alignItems: 'center', gap: '0.5rem'}}>
                            <img  className="profile-picture-bubble " src={item.participants[0]?.profile_picture || "https://xsgames.co/randomusers/assets/avatars/male/36.jpg"} alt="User's Picture" />
                            <div className='flex-col' style={{gap: '0.5rem'}}>
                                <p className='user-name'>{item.participants[0].username}</p>
                                <p className='message-preview'>{item.messages[item.messages.length-1].text}</p>
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