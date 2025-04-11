import React from 'react'
import {useState} from 'react'


export default function Cards() {
  


  const cardInfo = ({showInfo}) => {
    return (
      <div className='hidden'>

      </div>
    )
  }
  return (
    <div>
      <button className='w-20 h-40 bg-amber-900 rounded-md hover:bg-amber-50'
                      onClick={()=> setShowInfo(true)}>
      </button>
      

    </div>
  )
}

