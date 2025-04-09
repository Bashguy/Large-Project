import { useState } from "react"
import DeleteUser from "../components/DeleteUser"

const Settings = () => {
  const [confirmDelete, setConfirmDelete] = useState(false)

  

  return (
    <div>
      {/* The entire fuckin thing ig */}
      <div className="flex w-screen h-screen justify-center items-center">
        {/* The box itself */}
        <div className="flex flex-col justify-center w-4/5 h-4/5 bg-[#F1BF7E] text-center p-5 rounded-md">
          <h1>Settings</h1>
          <hr className="my-3"></hr>
          {/* The, er, actual settings */}
          <div className="flex flex-col justify-center items-center content-between border-10 my-10 h-3/4">
            <div className="flex content-around px-5 border-3">
              <label className='border-3' for="name">Name</label>
              <input type="text" name="name" id="name" className="bg-white"/>
            </div>
            
            <div className="flex content-between border-3">
              <label className='border-3' for="username">Username</label>
              <input type="text" password="username" id="username" className="bg-white"/>
            </div>

            <div className="flex content-between border-3">
              <label className='border-3' for="password">Password</label>
              <input type="text" password="password" className="bg-white"/>
            </div>

            <div className="flex content-between border-3">
              <label className='border-3' for="email">Email</label>
              <input type="text" password="email" className="bg-white"/>
            </div>

            <button className=" h-10 w-40 cursor-pointer bg-red-400 border-3"
                    onClick={()=>setConfirmDelete(true)}
                    >Delete All Data</button>
                    {confirmDelete && <DeleteUser setConfirmDelete={setConfirmDelete}/>}

          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
