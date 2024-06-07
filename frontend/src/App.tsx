import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import SignUp from './assets/components/auth/SignUp'
import { useAuthContext } from './context/AuthContext'
import Home from './assets/components/homepage/Home';
import Login from './assets/components/auth/Login';

function App() {
  
  const {authUser} = useAuthContext();

  return (
    <div className='p-4 h-screen flex items-center justify-center'>
    <Routes>
      <Route path= '/' element= {authUser ? <Home /> : <Navigate to={"/login"} />} />
      <Route path = '/login' element = {authUser ? <Navigate to = "/" /> : <Login />} />
      <Route path='/signup' element={authUser ? <Navigate to = "/"/> : <SignUp />} />
    </Routes>
  </div>
  )
}

export default App
