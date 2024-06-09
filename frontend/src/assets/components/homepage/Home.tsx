import { useAuthContext } from '../../../context/AuthContext';
import LogoutButton from '../auth/LogoutButton';

const Home = () => {

    const {authUser} = useAuthContext();

  return (
    <div>
        Welcome {authUser?.fullname}
        <LogoutButton />
    </div>
  )
}

export default Home