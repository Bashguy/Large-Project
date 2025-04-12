import { useState, createContext, useContext } from "react"
import DeleteUser from "../components/settingsComponents/DeleteUser"
import { useWeather } from "../context/WeatherContext"
import InputField from "../components/settingsComponents/InputField"

const Settings = () => {
  const [confirmDelete, setConfirmDelete] = useState(false)  
  const {weather, toggleWeather} = useWeather()

  const changeName = (name) => {
    alert("Change Name")
  }
  const changeUserName = (name) => {
    alert("Change Username")
  }
  const changeEmail = (name) => {
    alert("Change Email")
  }
  const changePassword = (name) => {
    alert("Change Password")
  }
  
  // Get data here
  var name = "hai"
  var username = "hullo"
  var password = "hallo"
  var email = "hey"

  return (
    <div>
      {/* The entire fuckin thing ig */}
      <div className="flex w-screen h-screen justify-center items-center">
        {/* The box itself */}
        <div className="flex flex-col justify-center  w-4/5 h-4/5 bg-[#F1BF7E] text-center p-5 rounded-md">
          <h1>Settings</h1>
          <hr className="my-3"></hr>
          {/* The, er, actual settings */}
          
          <div className="flex flex-col justify-around items-center m-5 h-3/4">
          <div className="flex w-full justify-between items-center">
              <label className=''>Toggle Weather</label>
              <button className='rounded-lg px-5 p-2 hover:cursor-pointer hover:text-blue-200'
              onClick={toggleWeather}> {weather ? 'Turn Off' : 'Turn On'} </button>
            </div>

            <InputField field={"Name"} placeholder={name} />
            <InputField field={"Username"} placeholder={username} />
            <InputField field={"Password"} placeholder={password} />
            <InputField field={"Email"} placeholder={email} />

            <button className=" h-10 w-40 cursor-pointer border-3 bg-red-400 rounded-md"
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
