import React from 'react'
import { useState } from 'react'

function DeleteUser({setConfirmDelete}) {
    const [canDelete, setCanDelete] = useState("")
    
    const deleteData = () => {
        console.log(canDelete)
        if(canDelete === "hallo") {
            alert("Deleted aaaaaaaaaall your data SUCKAA");
        }
    }

  return (
    <div className='w-screen h-screen fixed top-0 right-0 flex justify-center items-center'>
      <div className='bg-white p-10 rounded-md shadow-md'>
            <h1 className='font-bold text-center text-lg p-5 align-text-top'>Are you sure?</h1>
        <p>Confirm your decision by typing in your password:</p>
        <input 
            type="text"
            className="w-full mt-1 bg-white text-[#aa6445] rounded-sm my-3 p-1 ring focus:outline-none"
            placeholder="Type in your password" 
            value={canDelete}   
            onChange={(e) => {setCanDelete(e.target.value)}}
        />
        <div className='flex justify-between mt-5'>
          <button className='outline-1 outline-[#101f20] bg-[#101f20] text-white py-2 px-4 hover:bg-transparent hover:text-black rounded-lg'
          onClick={() => setConfirmDelete(false)}
          >Cancel</button>
          <button className='outline-1 outline-[#101f20] hover:bg-[#101f20] hover:text-white py-2 px-4 enabled:bg-red-500 text-black rounded-lg 
                            disabled:cursor-default disabled:bg-transparent disabled:text-[#101f20]'
           disabled={canDelete !== "hallo"}
           onClick={() => deleteData()}
          >Delete</button>
        </div>
      </div>
    </div>
  )
}
export default DeleteUser
