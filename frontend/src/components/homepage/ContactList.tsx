import { useEffect, useState } from 'react'
import useFetchContacts from '../../hooks/useFetchContacts';
import { ArrowLeft, Search } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useChatsContext } from '../../context/ChatsContext';
import { publicUserDetailsProps } from '../../types';

interface ContactListProps {
  handleTabChange: () => void;
}

const ContactList = (props: ContactListProps) => {
  const { isLoading, contacts } = useFetchContacts();

  const {authUser} = useAuthContext();

  const {onGoingChats, setOnGoingChats, setSelectedChat} = useChatsContext();


  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const [searchInput, setSearchInput] = useState("");

  //USE EFFECT THAT HANDLES THE UPDATE OF THE SEARCH INPUT
  useEffect(() => {
    if (searchInput === "") {
      setFilteredContacts(contacts);
    } else {
      const filteredItems = contacts.filter((user) => user.fullname.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase()) || user.username.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase()));
      setFilteredContacts(filteredItems);
    }
  }, [searchInput, contacts]);

  const handleContactClick = (contact: publicUserDetailsProps) => {
    if (onGoingChats) {
      for (let i = 0; i < onGoingChats.length; i++) {
        if (onGoingChats[i].participants.length === 1 && onGoingChats[i].chat_type === "private") {
          if (onGoingChats[i].participants[0].id === contact.id) {
            //The chat exists, we select this chat and we filter any "new chat" the user might have created!
            setSelectedChat(onGoingChats[i].chat_id);
            const newChatsArray = [...onGoingChats];
            newChatsArray.filter((chat) => {chat.chat_id.startsWith("new-")});
            setOnGoingChats(newChatsArray);
            props.handleTabChange();
            return;
          }
        }
      }
      //This chat doesnt exist, but there are other chats already going on then we create a placeholder chat to serve us on the api call and the graphics rendering.
      const placeholderChats = onGoingChats;
      placeholderChats.push({
        chat_id: `new-${contact.id}`,
        chat_name: contact.fullname,
        chat_picture: contact.profile_picture,
        chat_type: "new",
        participants: [contact],
        messages: [],
      });
      setOnGoingChats(placeholderChats);
      setSelectedChat(`new-${contact.id}`);
      return;
    }
    //This chat doesnt exist as there are no other chats whatsoever!
    //TODO: if the chat doesnt exist, render a empty chatroom where we can send the first dm!
    props.handleTabChange();
  }

  return (
    <div className='w-full flex-col'>
      <section className="profile-banner w-full flex-row contact-list-banner">
        <button className="icon-button" onClick={props.handleTabChange}>
          <ArrowLeft />
        </button>
        <p className='font-bold'>New Chat</p>
      </section>
      <section className='search-bar w-full'>
        <input placeholder='Search' className='w-full' value={searchInput} onChange={(e) => setSearchInput(e.target.value)} maxLength={60}/>
        <Search style={{ position: 'absolute', left: '1rem', paddingTop: '0.55rem' }} size={20} />
      </section>
      <ul className='chats-list w-full h-full'>
        {filteredContacts.length === 0 ?
        <p className='w-full no-results'>No search results for: {searchInput}</p>
      :
      <></>}
            {filteredContacts.map((user) => {
                return (
                    <li key={user.id} onClick={()=> {handleContactClick(user)}} >
                        <div className='flex-row' style={{alignItems: 'center', gap: '0.5rem'}}>
                            <img  className="profile-picture-bubble " src={user.profile_picture || "https://www.shutterstock.com/image-vector/gray-avatar-icon-design-photo-600nw-1274338147.jpg"} alt="User's Picture" />
                            <div className='flex-col' style={{gap: '0.5rem'}}>
                                <p className='user-name'>{user.fullname}</p>
                                <p className='message-preview'>{"@" + user.username}</p>
                            </div>
                        </div>
                    </li>
                )
            })}
        </ul>
    </div>
  )
}

export default ContactList