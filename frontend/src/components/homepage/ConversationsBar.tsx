import { Search } from 'lucide-react';
import useFetchChats from '../../hooks/useFetchChats';

const ConversationsBar = () => {
	const { isLoading, chats } = useFetchChats();
  return (
    <div className='w-full'>
        <section className='search-bar w-full'>
            <input placeholder='Search' className='w-full'/>
            <Search style={{position: 'absolute', left: '1rem', paddingTop: '0.55rem'}} size={20} />
        </section>
        <ul className='chats-list w-full'>
            {chats.map(item => {
                const lastMessageDate = new Date(item.last_message_timestamp.replace(' ', 'T'));
                const today = new Date();
                let isToday = false;

                if (lastMessageDate.getDate() === today.getDate() && lastMessageDate.getMonth() === today.getMonth() && lastMessageDate.getFullYear() === today.getFullYear()) {
                    isToday = true;
                }
                //TODO: Render hour or day depending if its today or no
                return (
                    <li>
                        <div className='flex-row' style={{alignItems: 'center', gap: '0.5rem'}}>
                            <img  className="profile-picture-bubble " src={item.participants[1]?.profile_picture || "https://xsgames.co/randomusers/assets/avatars/male/36.jpg"} alt="User's Picture" />
                            <div className='flex-col' style={{gap: '0.5rem'}}>
                                <p className='user-name'>{item.participants[1].username}</p>
                                <p className='message-preview'>{item.last_message_text}</p>
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