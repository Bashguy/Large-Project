import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Background from './components/Background'
import Register from './pages/Register'
import Home from './pages/Home'
import NavBar from './components/NavBar'
import Settings from './pages/Settings'
import Gacha from './pages/Gacha'
import Code from './pages/Code'
import Friends from './pages/Friends'
import Battle from './pages/Battle'
import Collections from './pages/Collections'
import Weather from './components/Weather'
import AuthProtectedRoute from './components/AuthRoute';
import useAuthStore from './store/authStore'
import { Toaster, toast } from 'react-hot-toast'
import Create from './pages/Create'

function App() {
  const { checkAuth, isAuthenticated } = useAuthStore();
  const [ weather, setWeather ] = useState(true)
  const [ day, setDay ] = useState(true)
    
  // Check authentication status when app loads
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
      />

      <Background />
      <Weather day={day} weather={weather} />
      <NavBar />

      <Routes>
      <Route path='/create' element={<Create />} />

        <Route path='/register' element={
          isAuthenticated ? <Navigate to="/" replace /> : <Register />
        } />

        <Route element={<AuthProtectedRoute />}>
          <Route path='/' element={<Home />} />
          <Route path='/gacha' element={<Gacha /  >} />
          <Route path='/code' element={<Code />} />
          <Route path='/collection' element={<Collections />} />
          <Route path='/friends' element={<Friends />} />
          <Route path='/battle' element={<Battle />} />
          <Route path='/settings' element={<Settings day={setDay} weather={setWeather} />} />
        </Route>

        {/* Default route */}
        <Route path='*' element={
          isAuthenticated ? <Navigate to="/" replace /> : <Register />
        } />

      </Routes>
    </div>
  )
}

export default App
