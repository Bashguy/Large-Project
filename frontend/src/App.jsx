import { useState, createContext, useContext } from 'react'
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
import Weather from './components/Weather'
//import { useWeather } from './context/WeatherContext'

//const WeatherContext = createContext()

function App() {
  const [weather, setWeather] = useState(true)
  const [ auth, setAuth ] = useState(true)

  const toggleWeather = () => {
    setWeather(!weather)
  }
  
  return (
    <div>
      <Background />
      
      { weather && <Weather />}

      <NavBar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/gacha' element={<Gacha />} />
        <Route path='/code' element={<Code />} />
        <Route path='/collection' element={<Collections />} />
        <Route path='/friends' element={<Friends />} />
        <Route path='/battle' element={<Battle />} />
        <Route path='/settings' element={<Settings curWeather={weather} toggleWeather={toggleWeather} />}/>
      </Routes>
    </div>
  )
}

export default App
