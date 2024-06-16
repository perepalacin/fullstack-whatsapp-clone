import LogoutButton from '../auth/LogoutButton';
import ConversationsBar from './ConversationsBar';
import ProfileBanner from './ProfileBanner';
import ChatHeader from './ChatHeader';
import { ChatsContextProvider } from '../../context/ChatsContext';
import Chat from './Chat';

const Home = () => {
  return (
    <ChatsContextProvider>
      <div className='main-root'>
        <nav className='nav-bar'>
          <ProfileBanner />
          <ConversationsBar />
          <LogoutButton />
        </nav>
        {/* TODO: If no chat is selected, render something else! like a wellcome page */}
      <div className='w-full flex-col h-full'>
        <ChatHeader />
        <Chat />
      </div>
      </div>
    </ChatsContextProvider>
  )
}

export default Home