import { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';
import { toast } from 'react-hot-toast'; // Added missing import for toast

const Settings = ({ day: setDay, weather: setWeather }) => {
  const [dayMode, setDayMode] = useState(true);
  const [weatherOn, setWeatherOn] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { user, deleteAcc, changeUsername, changeEmail, changePassword, isLoading } = useAuthStore();
  const toastStyle = {
    style: {
      border: '1px solid #713200',
      padding: '16px',
      color: '#713200',
    },
    iconTheme: {
      primary: '#713200',
      secondary: '#FFFAEE',
    },
  }
  
  const [userInfo, setUserInfo] = useState({
    username: user.username,
    oldPassword: "",
    password: "",
    email: user.email
  });
  const [editMode, setEditMode] = useState({
    username: false,
    email: false,
    password: false
  });

  // Update parent state when local state changes
  useEffect(() => {
    setDay(dayMode);
    setWeather(weatherOn);
  }, [dayMode, setDay, weatherOn, setWeather]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAccountDelete = async () => {
    try {
      const response = await deleteAcc();
      
      if (response.success) {
        toast.success(response.msg, toastStyle);
      } else {
        toast.error(response.msg, toastStyle);
      }
    } catch (error) {
      toast.error("Failed to delete account", toastStyle);
    }
    
    setConfirmDelete(false);
  };

  const handleNewUsername = async (newUsername) => {
    if (newUsername === user.username) return;

    try {
      const response = await changeUsername(newUsername);
      
      if (response.success) {
        toast.success(response.msg, toastStyle);
        setUserInfo(prev => ({ ...prev, username: newUsername }));
      } else {
        toast.error(response.msg, toastStyle);
      }
    } catch (error) {
      toast.error("Failed to update username", toastStyle);
    }
    
    toggleEditMode("username");
  };

  const handleNewEmail = async (newEmail) => {
    if (newEmail === user.email) return;

    try {
      const response = await changeEmail(newEmail);
      
      if (response.success) {
        toast.success(response.msg, toastStyle);
        setUserInfo(prev => ({ ...prev, email: newEmail }));
      } else {
        toast.error(response.msg, toastStyle);
      }
    } catch (error) {
      toast.error("Failed to update email", toastStyle);
    }
    
    toggleEditMode("email");
  };

  const handleNewPassword = async (oldPassword, newPassword) => {
    if (oldPassword === newPassword) return;

    try {
      const response = await changePassword(oldPassword, newPassword);
      
      if (response.success) {
        toast.success(response.msg, toastStyle);
        setUserInfo(prev => ({ ...prev, oldPassword: "", password: "" }));
      } else {
        toast.error(response.msg, toastStyle);
      }
    } catch (error) {
      toast.error("Failed to update password", toastStyle);
    }
    
    toggleEditMode("password");
  };

  // Toggle edit mode for a field
  const toggleEditMode = (field) => {
    setEditMode(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  useEffect(() => {
    document.title = "Settings";
  }, []);

  return (
    <div className="h-screen w-full select-none font-mono overflow-hidden">
      <div className="w-full h-full flex items-center justify-center">
        {/* Main settings container */}
        <div className="flex flex-col w-1/2 h-4/5 bg-[#F1BF7E] text-center p-8 rounded-md shadow-lg overflow-y-auto">
          <h1 className="text-3xl font-bold mb-2 text-amber-800">Settings</h1>
          <hr className="border-amber-600 my-4" />

          {/* Settings sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Display preferences section */}
            <div className="bg-amber-50 rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-semibold text-amber-800 mb-4">Display Preferences</h2>
              
              {/* Day/Night mode toggle - simplified */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-amber-900 font-medium">Day/Night Mode</span>
                <button 
                  onClick={() => setDayMode(prev => !prev)}
                  className={`relative inline-flex items-center cursor-pointer h-6 rounded-full w-12 transition-colors ${dayMode ? 'bg-amber-400' : 'bg-blue-900'}`}
                >
                  <span 
                    className={`inline-block w-5 h-5 cursor-pointer transform rounded-full transition-transform bg-white ${dayMode ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>
              
              {/* Weather toggle - simplified */}
              <div className="flex items-center justify-between">
                <span className="text-amber-900 font-medium">Show Weather Effects</span>
                <button 
                  onClick={() => setWeatherOn(prev => !prev)}
                  className={`relative inline-flex items-center cursor-pointer h-6 rounded-full w-12 transition-colors  ${weatherOn ? 'bg-amber-400' : 'bg-gray-400'}`}
                >
                  <span 
                    className={`inline-block w-5 h-5 cursor-pointer transform rounded-full transition-transform bg-white ${weatherOn ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>
            </div>

            {/* User profile section */}
            <div className="bg-amber-50 rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-semibold text-amber-800 mb-4">Profile Information</h2>
              
              {/* Username field */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-amber-900 font-medium">Username</label>
                  <button
                    onClick={() => {
                      toggleEditMode('username')
                      setUserInfo({...userInfo, username: user.username})
                    }}
                    className="text-xs text-amber-600 hover:text-amber-800 cursor-pointer"
                  >
                    {editMode.username ? 'Cancel' : 'Edit'}
                  </button>
                </div>
                {editMode.username ? (
                  <div className="flex">
                    <input
                      type="text"
                      value={userInfo.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="w-full px-3 py-2 border border-amber-300 rounded-l focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      onClick={() => handleNewUsername(userInfo.username)}
                      className="bg-amber-400 text-white px-3 py-2 rounded-r hover:bg-amber-500 cursor-pointer"
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Save"}
                    </button>
                  </div>
                ) : (
                  <div className="bg-white px-3 py-2 rounded border border-amber-200">
                    {userInfo.username}
                  </div>
                )}
              </div>
              
              {/* Email field */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-amber-900 font-medium">Email</label>
                  <button
                    onClick={() => {
                      toggleEditMode('email')
                      setUserInfo({...userInfo, email: user.email})
                    }}
                    className="text-xs text-amber-600 hover:text-amber-800 cursor-pointer"
                  >
                    {editMode.email ? 'Cancel' : 'Edit'}
                  </button>
                </div>
                {editMode.email ? (
                  <div className="flex">
                    <input
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-amber-300 rounded-l focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      onClick={() => handleNewEmail(userInfo.email)}
                      className="bg-amber-400 text-white px-3 py-2 rounded-r hover:bg-amber-500 cursor-pointer"
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Save"}
                    </button>
                  </div>
                ) : (
                  <div className="bg-white px-3 py-2 rounded border border-amber-200">
                    {userInfo.email}
                  </div>
                )}
              </div>
              
              {/* Password field */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-amber-900 font-medium">Password</label>
                  <button
                    onClick={() => {
                      toggleEditMode('password')
                      setUserInfo({...userInfo, oldPassword: "", password: ""})
                    }}
                    className="text-xs text-amber-600 hover:text-amber-800 cursor-pointer"
                  >
                    {editMode.password ? 'Cancel' : 'Edit'}
                  </button>
                </div>
                {editMode.password ? (
                  <div className="flex flex-col space-y-2">
                    <input
                      type="password"
                      placeholder="Current Password"
                      value={userInfo.oldPassword}
                      onChange={(e) => handleInputChange('oldPassword', e.target.value)}
                      className="w-full px-3 py-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <div className="flex">
                      <input
                        type="password"
                        placeholder="New Password"
                        value={userInfo.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="w-full px-3 py-2 border border-amber-300 rounded-l focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        onClick={() => handleNewPassword(userInfo.oldPassword, userInfo.password)}
                        className="bg-amber-400 text-white px-3 py-2 rounded-r hover:bg-amber-500 cursor-pointer"
                        disabled={isLoading}
                      >
                        {isLoading ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white px-3 py-2 rounded border border-amber-200">
                    ••••••••
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Danger zone */}
          <div className="mt-8 bg-red-50 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold text-red-800 mb-4">Danger Zone</h2>
            
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all hover:scale-110 cursor-pointer"
              >
                Delete Account
              </button>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-red-700 mb-4">Are you sure you want to delete your account? This action cannot be undone.</p>
                <div className="flex space-x-4">
                  <button
                    onClick={handleAccountDelete}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-all hover:scale-110 cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading ? "Deleting..." : "Yes, Delete My Account"}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition-all hover:scale-110 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;