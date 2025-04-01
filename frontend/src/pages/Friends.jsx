import { useState } from "react"

const Friends = () => {
  const [show, setShow] = useState(true);

  return (
    <div className="h-screen select-none font-mono overflow-hidden">
      <div className="h-full w-full flex items-center justify-center">
        <div className="relative border-1 h-full w-3/4 shadow-[8px_6px_6px_4px_rgba(0,0,0,0.3)]">
          <div className="absolute top-0 w-full h-1/8 bg-linear-to-b from-white to-gray-300 border-b-25 border-green-800 z-5"></div>

          <div className="absolute bottom-0 h-7/8 w-full bg-orange-300 text-xl overflow-y-auto">

              <div className="sticky flex items-center mx-10 my-5 z-1">
                <hr className="grow border-3 border-amber-700" />
                <span className="mx-4 text-center text-4xl cursor-pointer" onClick={() => setShow(!show)}>Trade</span>
                <hr className="grow border-3 border-amber-700" />
              </div>

              <div className={`w-full ${show ? "h-full lg:h-1/3 lg:mb-10" : "h-[10%]"} overflow-clip transition-all duration-250 flex flex-col lg:flex-row items-center justify-center`}>
                
                <div className="max-lg:h-1/2 lg:h-full w-full">
                  <div className="text-center border-b-1 max-lg:mx-24 lg:mx-8">Sent</div>
                  
                  <div className={`w-full ${show ? "h-[90%]" : "h-0"} justify-items-center transition-all duration-250 overflow-y-scroll`}>

                    <div className="w-4/5 h-20 flex items-center justify-center border-2 m-4 rounded-full">Amogus</div>
                    <div className="w-4/5 h-20 flex items-center justify-center border-2 m-4 rounded-full">Amogus</div>
                    <div className="w-4/5 h-20 flex items-center justify-center border-2 m-4 rounded-full">Amogus</div>
                    <div className="w-4/5 h-20 flex items-center justify-center border-2 m-4 rounded-full">Amogus</div>
                    <div className="w-4/5 h-20 flex items-center justify-center border-2 m-4 rounded-full">Amogus</div>
                    <div className="w-4/5 h-20 flex items-center justify-center border-2 m-4 rounded-full">Amogus</div>

                  </div>
                </div>
                
                <div className="max-lg:h-1/2 lg:h-full w-full">
                  <div className="text-center border-b-1 max-lg:mx-24 lg:mx-8">Received</div>
                  
                  <div className={`w-full ${show ? "h-[90%]" : "h-0"} justify-items-center transition-all duration-250 overflow-y-scroll`}>

                    <div className="w-4/5 h-20 flex items-center justify-center border-2 m-4 rounded-full">Amogus</div>
                    <div className="w-4/5 h-20 flex items-center justify-center border-2 m-4 rounded-full">Amogus</div>
                    <div className="w-4/5 h-20 flex items-center justify-center border-2 m-4 rounded-full">Amogus</div>
                    <div className="w-4/5 h-20 flex items-center justify-center border-2 m-4 rounded-full">Amogus</div>
                    <div className="w-4/5 h-20 flex items-center justify-center border-2 m-4 rounded-full">Amogus</div>
                    <div className="w-4/5 h-20 flex items-center justify-center border-2 m-4 rounded-full">Amogus</div>

                  </div>
                </div>

              </div>

            <div className="sticky flex items-center mx-10 my-5 z-1">
              <hr className="grow border-3 border-amber-700" />
              <span className="mx-4 text-center text-4xl">Friends</span>
              <hr className="grow border-3 border-amber-700" />
            </div>

            <div className="w-full h-full mb-10 flex flex-col lg:flex-row">

              <div className="h-full w-full lg:w-2/3 border-2">
                <div className="text-center border-b-1 max-lg:mx-24 lg:mx-8">List</div>

                <div className={`w-full h-[95%] justify-items-center overflow-y-scroll`}>
                  <div className="w-4/5 h-20 flex items-center justify-center border-2 m-4 rounded-full">Amogus</div>
                  <div className="w-4/5 h-20 flex items-center justify-center border-2 m-4 rounded-full">Amogus</div>
                  <div className="w-4/5 h-20 flex items-center justify-center border-2 m-4 rounded-full">Amogus</div>
                  <div className="w-4/5 h-20 flex items-center justify-center border-2 m-4 rounded-full">Amogus</div>
                  <div className="w-4/5 h-20 flex items-center justify-center border-2 m-4 rounded-full">Amogus</div>
                  <div className="w-4/5 h-20 flex items-center justify-center border-2 m-4 rounded-full">Amogus</div>
                  <div className="w-4/5 h-20 flex items-center justify-center border-2 m-4 rounded-full">Amogus</div>
                  <div className="w-4/5 h-20 flex items-center justify-center border-2 m-4 rounded-full">Amogus</div>
                  <div className="w-4/5 h-20 flex items-center justify-center border-2 m-4 rounded-full">Amogus</div>
                  <div className="w-4/5 h-20 flex items-center justify-center border-2 m-4 rounded-full">Amogus</div>
                </div>

              </div>

              <div className="h-full w-full lg:w-1/3 border-2 flex flex-col">
                <div className="text-center border-b-1 max-lg:mx-24 lg:mx-8">Sent</div>
                <div className="text-center border-b-1 max-lg:mx-24 lg:mx-8">Received</div>

              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Friends
