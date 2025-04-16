import React from 'react'
import { useState } from 'react'
import pencil from '../../assets/pencil.png'


function InputField({ field, sendTo, placeholder }) {
    const [disabled, setDisabled] = useState(true)
    const [input, setInput] = useState("")

    const changeDisabled = () => setDisabled(d => !d)
    
    const changeField = () => {
      if(input !== ""){
        alert(`Changed to ${input}`)
      }
    }


  return (
    <div className="flex w-full justify-between items-center">
        <label className='' for="name" >{field}</label>
        <img className='w-10 h-10'
        src={'/pencil.png'} 
        onClick={() => {
          if(!disabled) {
            changeField()
          } 
          changeDisabled()
        }}
        />
        <input disabled={disabled} 
        onChange={(e) => setInput(e.target.value)}
        type="text" placeholder={placeholder} 
        className="w-3/5 p-2 disabled:text-[#000000] disabled:bg-[#F1BF7E] bg-white"
        />

    </div>
  )
}

export default InputField