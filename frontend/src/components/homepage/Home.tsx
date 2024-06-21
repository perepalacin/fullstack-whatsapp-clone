import ConversationsBar from './ConversationsBar';
import ProfileBanner from './ProfileBanner';
import ChatHeader from './ChatHeader';
import { ChatsContextProvider } from '../../context/ChatsContext';
import Chat from './Chat';
import { useState } from 'react';
import ContactList from './ContactList';
import Separator from './Separator';

const Home = () => {
  const [tab, setTab] = useState(true); //True == OnGoingChats tab; False == Contacts list! STATE THAT HANDLES WHICH SIDEBAR IS REDNERED -> ONGOING CHATS OR CONTACT LIST
  const handleTabChange = () => {
    setTab(prevTab => !prevTab); // FUNCTION THAT CHANGES THE STATE UPDATE!
  }

  return (
    <ChatsContextProvider>
      <div className='main-root'>
        <Separator />
        <nav className='nav-bar'>
          {tab ?
            <div className='w-full h-full'>
              <ProfileBanner handleTabChange={handleTabChange} />
              <ConversationsBar />
            </div>
            :
            <div className='w-full h-full'>
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