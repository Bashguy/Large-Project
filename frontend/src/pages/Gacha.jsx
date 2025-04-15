import { useEffect, useState } from "react"
import { typeColors } from "../constant/home"
import backBox from "../assets/box_back.svg"
import frontBox from "../assets/box_front.svg"
import boxLid from "../assets/box_lid_full.svg"
import Card from "../components/Card"

const Gacha = () => {
  const [selectBox, setSelectBox] = useState(false);
  const [open, setOpen] = useState(false);
  const [visibleCards, setVisibleCards] = useState([]);
  const [showContinueButton, setShowContinueButton] = useState(false);

  useEffect(() => {
    document.title = "Gacha"
  }, [])

  const exampleCards = [
    { id: 1, name: "Pancakes", stars: 3, description: "Fluffy pancakes with maple syrup", count: 10 },
    { id: 5, name: "Avocado Toast", stars: 2, description: "Fresh avocado on toast", count: 18 },
    { id: 8, name: "Breakfast Burrito", stars: 3, description: "Eggs, cheese and bacon", count: 23 },
    { id: 11, name: "French Toast", stars: 3, description: "With cinnamon and syrup", count: 7 }
  ];

  const openBox = () => {
    setOpen(true)
    let i = 0

    const showCards = setInterval(() => {
      i++;
      setVisibleCards((prevCards) => [...prevCards, exampleCards[i-1]])
      
      if (i === 4) {
        clearInterval(showCards)
        setShowContinueButton(true)
      }
    }, 1000)
  }
  
  const handleContinue = () => {
    // Reset all states to go back to box selection
    setOpen(false)
    setSelectBox(false)
    setVisibleCards([])
    setShowContinueButton(false)
  }
  
  return (
    <>
      <div className="h-screen select-none font-mono overflow-hidden">
        <div className="h-full w-full flex items-center justify-center">
          {/* Opening */}
          <div className={`h-full flex flex-col justify-center transition-all duration-300 ${selectBox && "-translate-y-[100%]"}`}>
            <div className="mb-10 text-6xl text-center">Choose your box!</div>
            <div className="flex flex-row space-x-10">
              <div className={`relative w-64 h-96 border-1 rounded-2xl flex items-center justify-center group ${typeColors.breakfast} cursor-pointer`} onClick={() => setSelectBox(true)}>
                <img src="https://gallery.yopriceville.com/downloadfullsize/send/7293" alt="breakfast-box" className="transition-all group-hover:scale-130" />
                <div className="absolute -bottom-12 text-4xl">Breakfast</div>
              </div>
              <div className={`relative w-64 h-96 border-1 rounded-2xl flex items-center justify-center group ${typeColors.dinner} cursor-pointer`} onClick={() => setSelectBox(true)}>
                <img src="https://gallery.yopriceville.com/downloadfullsize/send/7293" alt="breakfast-box" className="transition-all group-hover:scale-130" />
                <div className="absolute -bottom-12 text-4xl">Dinner</div>
              </div>
              <div className={`relative w-64 h-96 border-1 rounded-2xl flex items-center justify-center group ${typeColors.dessert} cursor-pointer`} onClick={() => setSelectBox(true)}>
                <img src="https://gallery.yopriceville.com/downloadfullsize/send/7293" alt="breakfast-box" className="transition-all group-hover:scale-130" />
                <div className="absolute -bottom-12 text-4xl">Dessert</div>
              </div>
            </div>
          </div>

          {/* Grass */}
          <div className={`h-full w-full absolute overflow-hidden transition-all duration-500 ${selectBox ? "translate-y-0" : "translate-y-[100%]"}`}>
            <img src="https://freepng.pictures/get-logo.php?id=8000" alt="grass" className="absolute bottom-0 scale-150" />
            <div className="h-full w-full flex justify-center">
              <img src={backBox} alt="back-box" className="absolute -bottom-[30%] z-5 scale-60" />
              <img src={frontBox} alt="front-box" className="absolute -bottom-[30%] z-10 scale-60" />
              <img src={boxLid} alt="lid-box" onClick={openBox} className={`absolute -bottom-[30%] z-10 scale-60 cursor-pointer transition-all duration-500 ${open && "-translate-y-[100%]"}`} />
              <div className="flex flex-row items-end scale-75 space-x-10 mb-10 z-7">
                {visibleCards.map((card, index) => (
                  <div 
                    key={`${"breakfast"}-${card.id}`}
                    className={`transition-all duration-500 ${open ? `translate-y-[-150px] delay-${index*100}` : "translate-y-0"}`}
                  >
                    <Card
                      title={card.name}
                      type={"breakfast"}
                      stars={card.stars}
                      image={""}
                      description={card.description}
                      power={Math.floor(Math.random() * 20) + 10}
                      count={0}
                      shrink={1}
                      locked={false}
                    />
                  </div>
                ))}
              </div>

              {showContinueButton && (
                <button 
                  onClick={handleContinue}
                  className="absolute bottom-[10%] z-20 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full text-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  Continue
                </button>
              )}

            </div>
          </div>
          
        </div>
      </div>
    </>
  )
}

export default Gacha
