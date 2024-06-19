import { LoaderCircle, LogOut } from 'lucide-react';
import useLogout from '../../hooks/useLogout'
import HoverBox from '../extras/HoverBox';

const LogoutButton = () => {

    const {loading, logout} = useLogout();

  return (
    //TODO: Add a spinner when it is loading
      <button className='logout-button' onClick={logout} disabled={loading}>
        {loading ? <LoaderCircle className='spin' /> : <LogOut />}
        <HoverBox prompt={"Log out"}/>
      </button>
  )
}

export default LogoutButton