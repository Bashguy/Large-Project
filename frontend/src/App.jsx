import { useState } from 'react'
import Background from './components/Background'
import Register from './pages/Register'
import Home from './pages/Home'

function App() {
  const [ auth, setAuth ] = useState(true)

  return (
    <div>
      <Background />

      {!auth && <Register />}
      {auth && <Home />}
    </div>
  )
}

export default App
