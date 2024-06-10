import { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import LogoutButton from '../auth/LogoutButton';
import ConversationsBar from './ConversationsBar';
import ContactList from './ContactList';
import ProfileBanner from './ProfileBanner';

const Home = () => {

  const [newChat, setNewChat] = useState(false);

  return (
    <div className='main-root'>
      <nav className='nav-bar'>
        <ProfileBanner />
        <ConversationsBar />
        <LogoutButton />
      </nav>
    </div>
  )
}

export default Home