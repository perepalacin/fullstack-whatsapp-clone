import LogoutButton from '../auth/LogoutButton';
import ConversationsBar from './ConversationsBar';
import ProfileBanner from './ProfileBanner';
import ChatHeader from './ChatHeader';
import { ChatsContextProvider } from '../../context/ChatsContext';
import Chat from './Chat';
import { useState } from 'react';
import ContactList from './ContactList';

const Home = () => {
  const [tab, setTab] = useState(true); //True == OnGoingChats tab; False == Contacts list! STATE THAT HANDLES WHICH SIDEBAR IS REDNERED -> ONGOING CHATS OR CONTACT LIST

  const handleTabChange = () => {
    setTab(prevTab => !prevTab); // FUNCTION THAT CHANGES THE STATE UPDATE!
  }

  return (
    <ChatsContextProvider>
      <div className='main-root'>
        <nav className='nav-bar'>
          {tab ?
            <div className='w-full'>
              <ProfileBanner handleTabChange={handleTabChange} />
              <ConversationsBar />
              <LogoutButton />
            </div>
            :
            <div className='w-full'>
              <ContactList handleTabChange={handleTabChange}/>
            </div>
          }
        </nav>
        {/* TODO: If no chat is selected, render something else! like a welcome page */}
        <div className='w-full flex-col h-full'>
          <ChatHeader />
          <Chat />
        </div>
      </div>
    </ChatsContextProvider>
  )
}

export default Home