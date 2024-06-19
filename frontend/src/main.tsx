import ReactDOM from 'react-dom/client'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import App from './App.tsx'

import './index.css'
import { AuthContextProvider } from './context/AuthContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
   		<BrowserRouter>
		<AuthContextProvider>
					<App />
		</AuthContextProvider>
		</BrowserRouter> 
  </React.StrictMode>,
)
