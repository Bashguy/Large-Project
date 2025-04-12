import React, {createContext, useContext, useState } from 'react'


const WeatherContext = createContext()

export const useWeather = () => useContext(WeatherContext)

export const WeatherProvider = ({children}) => {
    const [weather, setWeather] = useState(false)

    const toggleWeather = () => setWeather(w => !w)
    

    return (
        <WeatherContext.Provider value={{weather, toggleWeather}}>
            {children}
        </WeatherContext.Provider>
    )
}