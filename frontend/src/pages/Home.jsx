import { useState } from 'react'
import Tilt from 'react-parallax-tilt'
import { HomeInfo } from '../constant/home';
import { Link } from 'react-router-dom';

const Home = () => {
  const [flip, setFlip] = useState({});
  const [activeLink, setActiveLink] = useState(true);

  const changeFlip = (state, i) => {
      const updateFlip = {...flip};
      Object.keys(updateFlip).forEach((index) => {
        updateFlip[index] = false;
      });
      updateFlip[i] = state;
      setFlip(updateFlip);
    };

  return (
    <div className="h-screen relative flex items-center justify-center font-mono select-none overflow-hidden">
      {/* Nail */}
      <div className="absolute top-0 mt-8 size-[1.5vw] rounded-full bg-zinc-300"></div>

      {/* Hang */}
      <div className="absolute top-[9vw] size-[2.5vw] rotate-45 border-l-2 border-t-2 rounded-sm border-red-500 scale-500 -z-10"></div>

      {/* Board */}
      <div className="relative w-2/3 h-2/3 border-[2.5vw] rounded-4xl border-[#aa6445] shadow-[8px_6px_6px_4px_rgba(0,0,0,0.3)]">
        {/* Board_Nails */}
        {['A', 'B', 'C', 'D'].map((_, i) => (
          <div key={_} className={`absolute ${(i % 2) ? "-top-[1.5vw]" : "-bottom-[1.5vw]"} ${(i % 3) ? "-left-[1.5vw]" : "-right-[1.5vw]"} size-[1.25vw] rounded-full bg-black z-10`}></div>
        ))}

        {/* Background */}
        <div className="absolute inset-0 bg-white opacity-50 -z-10"></div>
        <div className="h-full flex items-center justify-center m-auto">
          {/* Mapping cards with media queries */}
          <div className="2xl:flex max-lg:flex-col 2xl:w-full 2xl:space-x-10 2xl:px-10 lg:max-2xl:grid lg:max-2xl:grid-cols-2 lg:max-2xl:gap-10 max-2xl:space-y-5">
            {HomeInfo.map((info, i) => (
              <Tilt 
                key={i} 
                tiltReverse={false} 
                scale={1.15} 
                tiltMaxAngleX={5}
                tiltMaxAngleY={5}
                transitionSpeed={1000} 
                perspective={500} 
                className={`transition duration-300 relative w-[12vw] h-[40vh] lg:max-2xl:h-[12vh] ${i === 0 ? "lg:max-2xl:w-[55vw] lg:max-2xl:col-span-2" : "lg:max-2xl:w-full"} max-lg:w-[45vw] max-lg:h-[8vh] rounded-xl transition-all perspective-distant transform-3d hover:shadow-[6px_6px_12px_2px_rgba(0,0,0,0.3)]`}
                onLeave={() => changeFlip(false, i)}
              >
                {/* Front Cover */}
                <Link to={activeLink ? info[4] : "/"} className="w-full h-full block transform-3d">
                  <div className={`group h-full w-full flex items-center justify-center rounded-xl cursor-pointer duration-500 transform-3d transition-transform backface-hidden ${info[2]} ${flip[i] ? "2xl:-rotate-y-180 max-2xl:rotate-x-180" : "2xl:rotate-y-0 max-2xl:rotate-x-0"}`} >
                    {/* Button to turn back */}
                    <div 
                      className="2xl:w-full 2xl:h-1/10 max-2xl:w-1/10 max-2xl:h-full absolute 2xl:top-0 max-2xl:right-0 2xl:rounded-t-xl max-2xl:rounded-r-xl text-2xl text-center transition hover:bg-white opacity-50"
                      onClick={() => changeFlip(true, i)}
                      onMouseOver={() => setActiveLink(false)}
                      onMouseLeave={() => setActiveLink(true)}
                    >
                      &gt;
                    </div>

                    {/* Card info + logo */}
                    <div className="max-2xl:h-full max-2xl:w-fit 2xl:w-full flex items-center justify-center transform-3d backface-hidden">
                      <img className="group-hover:translate-z-8 duration-500 size-[9vw] opacity-75" src={info[1]} alt={info[0]} />
                      <img className="group-hover:translate-x-3 duration-500 absolute size-[9vw] opacity-25" src={info[1]} alt={info[0]} />
                      <div className="group-hover:translate-z-8 duration-500 absolute text-white text-[1.25vw] tracking-widest font-bold">{info[0]}</div>
                    </div>
                  </div>
                </Link>

                {/* Back Cover */}
                <div className={`h-full w-full rounded-xl duration-500 absolute top-0 bg-white backface-hidden ${flip[i] ? "2xl:rotate-y-0 max-2xl:rotate-x-0" : "2xl:rotate-y-180 max-2xl:-rotate-x-180"}`}>
                  <div className="h-full flex items-center justify-center">
                    <img className="size-[9vw] opacity-25 scale-x-[-1]" src={info[1]} alt={info[0]} />
                    <div className="absolute text-black text-[1.25vw] text-center font-bold">{info[3]}</div>
                  </div>
                </div>

              </Tilt>
            ))}
          </div>
          
        </div>

      </div>
    </div>
  )
}

export default Home
