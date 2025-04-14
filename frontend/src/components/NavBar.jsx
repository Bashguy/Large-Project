import { useState } from 'react';
import picnicImage from '../assets/picnick.svg';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [user, setUser] = useState(true)

  return (
    <div className='font-mono select-none'>
      {/* Trigger */}
      <div className='absolute top-0 w-full h-1/20 z-10 peer'></div>

      <div className="peer-hover:translate-y-0 hover:translate-y-0 -translate-y-full transition duration-250 ease-in border-b-1 fixed top-0 z-50 w-full h-1/10 flex">
        {/* Blur backdrop */}
        <div className='w-full h-full flex items-center justify-around backdrop-blur-xs pointer-events-none'>
          
          {/* Logout */}
          <Link to="/register" className={user ? "" : "hidden"}>
            <div className="hover:scale-110 transition duration-250 cursor-pointer w-fit text-[3vw] xl:text-[2vw] pointer-events-auto">
              &lt; Logout
            </div>
          </Link>

          {/* Homepage */}
          <Link to="/" className='mr-[5%]'>
            <div className="hover:scale-110 transition duration-250 cursor-pointer w-fit text-[3vw] xl:text-[2vw] flex items-center gap-4 pointer-events-auto">
              Picnic
              <img src={picnicImage} alt="Home" className='size-[4vw] xl:size-[3vw] mb-2' />
              Pickup
            </div>
          </Link>

          {/* Settings */}
          <Link to="/settings" className={user ? "" : "hidden"}>
            <img 
              src="https://preview.redd.it/spheal-pokemon-v0-dz3owudho96e1.gif?width=330&auto=webp&s=0ce440de858ee75dcf7d23e7c05be6530176032c" 
              alt="Profile" 
              className="hover:scale-110 transition duration-250 cursor-pointer size-[4vw] xl:size-[3vw] rounded-full bg-sky-500 object-cover pointer-events-auto" 
            />
          </Link>

        </div>
      </div>

    </div>
  )
}

export default NavBar
