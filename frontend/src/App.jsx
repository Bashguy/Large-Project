import { useState } from 'react'
import Background from './components/Background'
import Register from './pages/Register'
import Home from './pages/Home'
import { Routes, Route, Link } from "react-router-dom"
import Collection from './pages/Collection'

function App() {
  const [ auth, setAuth ] = useState(true)

  return (
    <div>
      <Background />

      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/home' element={<Home />} />
        <Route path='/' element={<Collection />} />
      </Routes>

    </div>
  )
}

export default App
