import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './components/auth/SignUp'
import { useAuthContext } from './context/AuthContext'
import Home from './components/homepage/Home';
import Login from './components/auth/Login';

function App() {
  
  const {authUser} = useAuthContext();

  return (
    <Routes>
      <Route path= '/' element= {authUser ? <Home /> : <Navigate to={"/login"} />} />
      <Route path = '/login' element = {authUser ? <Navigate to = "/" /> : <Login />} />
      <Route path='/signup' element={authUser ? <Navigate to = "/"/> : <SignUp />} />
    </Routes>
  )
}

export default App
