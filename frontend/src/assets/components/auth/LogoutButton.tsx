import useLogout from '../../../hooks/useLogout'

const LogoutButton = () => {

    const {loading, logout} = useLogout();

  return (
    //TODO: Add a spinner when it is loading
    <button onClick={logout} disabled={loading}>Log out</button>
  )
}

export default LogoutButton