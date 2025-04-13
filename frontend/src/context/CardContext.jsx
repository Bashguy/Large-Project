import React, {createContext, useContext, useState } from 'react'


const CardContext = createContext()

export const useCard = () => useContext(CardContext)

export const CardProvider = ({children}) => {
    const [cardView, setCardView] = useState(false)

    const showCard = () => setCardView(w => !w)
    

    return (
        <CardContext.Provider value={{cardView, setCardView}}>
            {children}
        </CardContext.Provider>
    )
}