import React from 'react'
import {useState} from 'react'


export default function Cards() {
  const [showInfo, setShowInfo] = useState(false)


  const cardInfo = ({setShowInfo}) => {
    return (
      <div className='hidden'>

      </div>
    )
  }
  return (
    <div>
      <div className='w-20 h-40 bg-amber-900 rounded-md'
                      onClick={()=> setShowInfo(true)}>
      </div>

    </div>
  )
}

