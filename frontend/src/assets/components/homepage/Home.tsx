import { useAuthContext } from '../../../context/AuthContext';
import LogoutButton from '../auth/LogoutButton';
import ConversationsBar from './ConversationsBar';

const Home = () => {

    const {authUser} = useAuthContext();

  return (
    <div>
        Welcome {authUser?.fullname}
        <ConversationsBar />
        <LogoutButton />
    </div>
  )
}

export default Home