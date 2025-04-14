import { useEffect } from "react"

const Battle = () => {

  useEffect(() => {
    document.title = "Battle";
  }, [])

  return (
    <div className="h-screen select-none font-mono overflow-hidden">
      <div className="h-full w-full flex items-center justify-center">
        
        <div className="border-1 h-9/10 w-3/4 bg-white">
          <div className="flex flex-col lg:flex-row h-full w-full">
            {/* Timer */}
            <div className="max-lg:h-[10%] max-lg:w-full lg:h-full lg:w-[10%] border-2">

            </div>
            {/* Battle */}
            <div className="relative max-lg:h-[90%] max-lg:w-full lg:h-full lg:w-[90%] border-4">
              {/* Top-Player (rotate-180) */}
              <div className="absolute top-5 h-[45%] w-full border-10 border-amber-800">
                ballss
              </div>
              
              {/* Bottom-Player */}
              <div className="absolute bottom-5 h-[45%] w-full border-10">
                
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Battle
