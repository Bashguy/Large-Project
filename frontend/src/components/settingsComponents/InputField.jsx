import React from 'react'
import { useState } from 'react'
import pencil from '../../assets/pencil.png'


function InputField({ field, placeholder }) {
    const [disabled, setDisabled] = useState(false)

    const changeDisabled = () => setDisabled(d => !d)
    


  return (
    <div className="flex w-full justify-between items-center">
        <label className='' for="name" >{field}</label>
        <img className='w-10 h-10'
        src={'../../assets/pencil.png'} 
        onClick={changeDisabled}
        />
        <input disabled={disabled} 
        
        type="text" n="name" 
        id="name" placeholder={placeholder} 
        className="w-3/5 p-2 disabled:bg-[#F1BF7E] bg-white"/>
    </div>
  )
}

export default InputField