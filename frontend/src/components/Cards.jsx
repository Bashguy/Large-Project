import React from 'react'

export default function Cards(setViewCard, card, setCard) {
  return (
    <div>
      <button className='w-40 h-60 bg-amber-900 rounded-md hover:bg-amber-50'
                      onClick={()=> {
                        setViewCard(true)
                        setCard(
                          {name: card.name, 
                          
                         })
                        alert("Open")
                      }}>

      </button>
      

    </div>
  )
}

