import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Admin_Login from './pages/Admin_Login'
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

function App() {
  const { checkAuth, isAuthenticated } = useAuthStore();
    
  // Check authentication status when app loads
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div>
      <Background />
      <Weather />
      <NavBar />

      <Routes>
        <Route path='/register' element={
          isAuthenticated ? <Navigate to="/" replace /> : <Register />
        } />

        <Route element={<AuthProtectedRoute />}>
          <Route path='/' element={<Home />} />
          <Route path='/gacha' element={<Gacha />} />
          <Route path='/code' element={<Code />} />
          <Route path='/collection' element={<Collections />} />
          <Route path='/friends' element={<Friends />} />
          <Route path='/battle' element={<Battle />} />
          <Route path='/admin_login' element={<Admin_Login />} />
          <Route path='/settings' element={<Settings />} />
        </Route>

        {/* Default route */}
        <Route path='*' element={
          isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/register" replace />
        } />

      </Routes>
    </div>
  )
}

export default App
