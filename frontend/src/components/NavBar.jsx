import { useState } from 'react';
import picnicImage from '../assets/picnick.svg';
import acornImage from '../assets/donguri.svg';
import { Link } from 'react-router-dom';
import useAuthStore from "../store/authStore"
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();

    const result = await logout();
    if (result.success) {
      navigate('/register');
      toast.success(result.msg, {
        style: {
          border: '1px solid #713200',
          padding: '16px',
          color: '#713200',
        },
        iconTheme: {
          primary: '#713200',
          secondary: '#FFFAEE',
        },
      });
    }
  };

  return (
    <div className='font-mono select-none'>
      {/* Trigger */}
      <div className='absolute top-0 w-full h-1/20 z-10 peer'></div>

      <div className="peer-hover:translate-y-0 hover:translate-y-0 -translate-y-full transition duration-250 ease-in border-b-1 fixed top-0 z-50 w-full h-1/10 flex">
        {/* Blur backdrop */}
        <div className='w-full h-full flex items-center justify-around backdrop-blur-xs pointer-events-none'>
          
          {/* Logout */}
          <div 
            className={`${user ? "" : "hidden"} hover:scale-110 transition duration-250 cursor-pointer w-fit text-[3vw] xl:text-[2vw] pointer-events-auto`}
            onClick={handleLogout}
          >
            &lt; Logout
          </div>

          {/* Homepage */}
          <Link to="/">
            <div className="hover:scale-110 transition duration-250 cursor-pointer w-fit text-[3vw] xl:text-[2vw] flex items-center gap-4 pointer-events-auto">
              Picnic
              <img src={picnicImage} alt="Home" className='size-[4vw] xl:size-[3vw] mb-2' />
              Pickup
            </div>
          </Link>

          <div className={`flex items-center justify-center space-x-5 ${user ? "" : "hidden"}`}>
            <div className='flex flex-row items-center justify-center mr-10'>
              <img src={acornImage} alt="Acorn" className='size-[4vw] xl:size-[3vw]' />
              <div className='font-bold text-2xl text-amber-900'>{user?.acorns}</div>
            </div>

            {/* Settings */}
            <Link to="/settings">
              <img 
                src="https://preview.redd.it/spheal-pokemon-v0-dz3owudho96e1.gif?width=330&auto=webp&s=0ce440de858ee75dcf7d23e7c05be6530176032c" 
                alt="Profile" 
                className="hover:scale-110 transition duration-250 cursor-pointer size-[4vw] xl:size-[3vw] rounded-full bg-sky-500 object-cover pointer-events-auto" 
              />
            </Link>
          </div>

        </div>
      </div>

    </div>
  )
}

export default NavBar
