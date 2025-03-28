import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
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

function App() {
  const [ auth, setAuth ] = useState(true)

  return (
    <div>
      <Background />
      <NavBar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/gacha' element={<Gacha />} />
        <Route path='/code' element={<Code />} />
        <Route path='/collection' element={<Collections />} />
        <Route path='/friends' element={<Friends />} />
        <Route path='/battle' element={<Battle />} />
        <Route path='/settings' element={<Settings />} />
      </Routes>
    </div>
  )
}

export default App
