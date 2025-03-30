import { useState } from "react"

const Friends = () => {
  const [show, setShow] = useState(true);

  return (
    <div className="h-screen select-none font-mono overflow-hidden">
      <div className="h-full w-full flex items-center justify-center">
        <div className="relative border-1 h-full w-3/4 shadow-[8px_6px_6px_4px_rgba(0,0,0,0.3)]">
          <div className="absolute top-0 w-full h-1/8 bg-linear-to-b from-white to-gray-300 border-b-25 border-green-800 z-5"></div>

          <div className="h-full w-full bg-orange-300 pt-30 text-xl overflow-y-auto">

              <div className="sticky flex items-center m-5 z-1">
                <hr className="grow border-3 border-amber-700" />
                <span className="mx-4 text-center text-4xl cursor-pointer" onClick={() => setShow(!show)}>Trade</span>
                <hr className="grow border-3 border-amber-700" />
              </div>

              <div className={`w-full ${show ? "h-1/3 -mt-7" : "h-0"} transition-all duration-250 flex flex-col lg:flex-row items-center justify-center`}>
                
                <div className="h-full w-1/2 mx-[2%] flex flex-col items-center justify-center">
                  <div className="w-full border-b-1 text-center ">Sent</div>
                  <div className="w-full h-full  border-black m-4 px-4 space-y-2 overflow-y-auto">
                    <div className="w-full h-2/5 border-5">Amogus</div>
                    <div className="w-full h-2/5 border-5">Amogus</div>
                    <div className="w-full h-2/5 border-5">Amogus</div>
                  </div>
                </div>

                <div className="h-full w-1/2 mx-[2%] flex flex-col items-center justify-center">
                  <div className="w-full border-b-1 text-center ">Received</div>
                  <div className="w-full h-full  border-black m-4 px-4 space-y-2 overflow-y-auto">
                    <div className="w-full h-2/5 border-5">Amogus</div>
                    <div className="w-full h-2/5 border-5">Amogus</div>
                    <div className="w-full h-2/5 border-5">Amogus</div>
                  </div>
                </div>
              </div>

            <div className="sticky flex items-center m-5">
              <hr className="grow border-3 border-amber-700" />
              <span className="mx-4 text-center text-4xl">Friends</span>
              <hr className="grow border-3 border-amber-700" />
            </div>

            <div className="w-full h-1/4 border-10 flex flex-row ">
              <div className="h-full w-2/3 border-5 mx-[2%]"></div>
              <div className="h-full w-1/3 border-5 mx-[2%]"></div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Friends
