import { useEffect, useState } from "react"
import { typeColors } from "../constant/home"
import backBox from "../assets/box_back.svg"
import frontBox from "../assets/box_front.svg"
import boxLid from "../assets/box_lid_full.svg"
import boxImage from "../assets/present.svg"
import Card from "../components/Card"
import { useUnlock4Cards } from "../hooks/useQueries"

const Gacha = () => {
  const unlock4CardsMutation = useUnlock4Cards();
  const [selectBox, setSelectBox] = useState(false);
  const [open, setOpen] = useState(false);
  const [visibleCards, setVisibleCards] = useState([]);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [getUnlocked, setGetUnlocked] = useState([]);

  useEffect(() => {
    document.title = "Gacha"
  }, [])
  
  const unlockBoxType = (type) => {
    // Fetch unlocked cards
    unlock4CardsMutation.mutate(type, {
      onSuccess: (data) => {
        if (data.success) {
          setGetUnlocked(data.cards);
          setSelectBox(true);
        } else {
          toast.error(data.msg, {
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
      }
    });
  };

  const openBox = () => {
    setOpen(true)
    let i = 0

    const showCards = setInterval(() => {
      setVisibleCards((prevCards) => [...prevCards, getUnlocked[i-1]])
      i++;
      
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
    setGetUnlocked([])
    setShowContinueButton(false)
  }
  
  return (
    <div className="fixed inset-0 w-full h-full select-none font-mono overflow-hidden">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Opening */}
        <div className={`absolute inset-0 w-full h-full flex flex-col justify-center items-center transition-all duration-300 ${selectBox ? "opacity-0 -translate-y-full pointer-events-none" : "opacity-100 z-20"}`}>
          <div className="mb-10 text-6xl text-center">Choose your box!</div>
          <div className="flex flex-row space-x-10">
            <div 
              className={`relative w-64 h-96 border-1 rounded-2xl flex items-center justify-center group ${typeColors.breakfast} cursor-pointer`} 
              onClick={() => unlockBoxType("breakfast")}
            >
              <img src={boxImage} alt="breakfast-box" className="transition-all group-hover:scale-130 max-h-full max-w-full hue-rotate-90" />
              <div className="absolute -bottom-12 text-4xl">Breakfast</div>
            </div>
            <div 
              className={`relative w-64 h-96 border-1 rounded-2xl flex items-center justify-center group ${typeColors.dinner} cursor-pointer`} 
              onClick={() => unlockBoxType("dinner")}
            >
              <img src={boxImage} alt="dinner-box" className="transition-all group-hover:scale-130 max-h-full max-w-full hue-rotate-210" />
              <div className="absolute -bottom-12 text-4xl">Dinner</div>
            </div>
            <div 
              className={`relative w-64 h-96 border-1 rounded-2xl flex items-center justify-center group ${typeColors.dessert} cursor-pointer`} 
              onClick={() => unlockBoxType("dessert")}
            >
              <img src={boxImage} alt="dessert-box" className="transition-all group-hover:scale-130 max-h-full max-w-full hue-rotate-30" />
              <div className="absolute -bottom-12 text-4xl">Dessert</div>
            </div>
          </div>
        </div>

        {/* Grass */}
        <div className={`absolute inset-0 w-full h-full overflow-hidden transition-all duration-500 ${selectBox ? "translate-y-0" : "translate-y-[100%]"}`}>
          <img src="https://freepng.pictures/get-logo.php?id=8000" alt="grass" className="absolute bottom-0 scale-150" />
          <div className="relative h-full w-full flex justify-center mt-[18%]">
            <img src={backBox} alt="back-box" className="absolute bottom-0 z-5 scale-60" />
            <img src={frontBox} alt="front-box" className="absolute bottom-0 z-10 scale-60" />
            <img 
              src={boxLid} 
              alt="lid-box" 
              onClick={openBox} 
              className={`absolute bottom-0 z-10 scale-60 cursor-pointer transition-all duration-500 ${open && "-translate-y-[100%]"}`} 
            />
            <div className="flex flex-row items-end scale-75 space-x-10 mb-[25%] z-7">
              {visibleCards.map((card, index) => (
                <div 
                  key={`${card.type || 'card'}-${index}`}
                  className={`transition-all duration-500 ${open ? `translate-y-[-150px]` : "translate-y-0"}`}
                >
                  <Card
                    title={card.name}
                    type={card.type}
                    stars={card.stars}
                    image={card.image}
                    description={card.description}
                    power={card.power}
                    count={0}
                    shrink={1}
                    locked={false}
                    tilt={false}
                  />
                </div>
              ))}
            </div>

            {showContinueButton && (
              <button 
                onClick={handleContinue}
                className="fixed animate-pulse inset-0 z-20 h-screen w-screen text-white font-bold text-8xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                Continue
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default Gacha
