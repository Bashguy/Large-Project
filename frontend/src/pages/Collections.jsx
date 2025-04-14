import { useEffect, useState } from "react"
import Card from "../components/Card"
import { typeColors } from "../constant/home"

const Collections = () => {
  const [activeType, setActiveType] = useState("breakfast");
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.title = "Collections";
  }, [])

  const exampleCards = {
    breakfast: [
      { id: 1, name: "Pancakes", stars: 3, description: "Fluffy pancakes with maple syrup", count: 10 },
      { id: 2, name: "Eggs Benedict", stars: 4, description: "With hollandaise sauce", count: 0 },
      { id: 5, name: "Avocado Toast", stars: 2, description: "Fresh avocado on toast", count: 18 },
      { id: 8, name: "Breakfast Burrito", stars: 3, description: "Eggs, cheese and bacon", count: 23 },
      { id: 9, name: "Oatmeal", stars: 1, description: "With berries and honey", count: 0 },
      { id: 11, name: "French Toast", stars: 3, description: "With cinnamon and syrup", count: 7 }
    ],
    dinner: [
      { id: 1, name: "Steak", stars: 5, description: "Juicy ribeye with herbs", count: 9 },
      { id: 2, name: "Pasta", stars: 4, description: "Creamy pasta carbonara", count: 0 },
      { id: 3, name: "Roast Chicken", stars: 3, description: "Herb-roasted with vegetables", count: 2 },
      { id: 4, name: "Salmon", stars: 4, description: "With lemon and dill", count: 0 },
      { id: 5, name: "Burger", stars: 3, description: "Classic beef burger", count: 20 }
    ],
    dessert: [
      { id: 2, name: "Chocolate Cake", stars: 4, description: "Rich chocolate cake", count: 0 },
      { id: 4, name: "Cheesecake", stars: 5, description: "Classic New York style", count: 3 },
      { id: 6, name: "Ice Cream", stars: 3, description: "Vanilla with hot fudge", count: 12 },
      { id: 8, name: "Apple Pie", stars: 4, description: "With cinnamon and sugar", count: 1 }
    ]
  };

  return (
    <div className="h-screen select-none font-mono overflow-hidden">
      <div className="h-full w-full flex items-center justify-center">

        <div className="relative border-1 h-full w-4/5 md:w-3/5 shadow-[8px_6px_6px_4px_rgba(0,0,0,0.3)]">
          <div className="absolute top-0 w-full h-1/8 bg-linear-to-b from-white to-gray-300 border-b-25 border-green-800 z-5 flex items-start justify-center lg:items-end lg:justify-between max-lg:flex-col-reverse px-6 pb-4">
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" className="h-7 w-50 border-1 rounded-full px-4 py-2" />
            
            <div className="flex items-center justify-center max-lg:my-2">
              <div className="h-5 w-50 border-1 rounded-full">
              <div 
                className={`h-full bg-black transition-all rounded-full 
                  ${activeType === "breakfast" ? `${typeColors.breakfast}` : 
                  activeType === "dinner" ? `${typeColors.dinner}` : 
                  `${typeColors.dessert}`}
                `}
                style={{ width: `${Math.min(exampleCards[activeType].length/12) * 100}%` }} 
              />
              </div>
              <div className="ml-4">
                {`${exampleCards[activeType].length}/12`}
              </div>
            </div>

          </div>

          <div className="absolute bottom-0 h-7/8 w-full bg-orange-300 text-xl flex justify-center overflow-hidden">
    
            {/* Type Selection header */}
              <div className="fixed h-1/12 w-[90%] md:w-[50%] bg-amber-500 mt-5 rounded-full overflow-hidden shadow-[6px_6px_10px_2px_rgba(0,0,0,0.3)]  z-5">

                {/* Animated slider */}
                <div 
                  className={`absolute h-full w-1/3 transition-all duration-250 ease-in-out rounded-full 
                    ${activeType === "breakfast" ? `left-0 ${typeColors.breakfast}` : 
                      activeType === "dinner" ? `left-1/3 ${typeColors.dinner}` : 
                      `left-2/3 ${typeColors.dessert}`
                    }`
                  }
                />

              <div className="absolute h-full w-full flex justify-around items-center z-10">
                <button 
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-all cursor-pointer
                    ${activeType === "breakfast" ? "text-white font-bold" : "text-amber-100 hover:text-white hover:scale-120"}`}
                    onClick={() => {
                      setActiveType("breakfast")
                      setSearch("")
                    }}
                >
                  Breakfast
                </button>
                
                <button 
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-all cursor-pointer
                    ${activeType === "dinner" ? "text-white font-bold" : "text-amber-100 hover:text-white hover:scale-120"}`}
                  onClick={() => {
                    setActiveType("dinner")
                    setSearch("")
                  }}
                >
                  Dinner
                </button>
                
                <button 
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-all cursor-pointer
                    ${activeType === "dessert" ? "text-white font-bold" : "text-amber-100 hover:text-white hover:scale-120"}`}
                    onClick={() => {
                      setActiveType("dessert")
                      setSearch("")
                    }}
                >
                  Dessert
                </button>
              </div>
            </div>

            <div className="h-full w-full overflow-y-auto pt-[10%]">  
              <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 p-12 gap-15">
                {(search.length === 0) ? [...Array(12)].map((_, i) => {
                  // Find a card with ID matching the position (i+1)
                  const card = exampleCards[activeType].find(card => card.id === i+1);
      
                  return card ? (
                    <Card
                      key={card.id}
                      title={card.name}
                      type={activeType}
                      stars={card.stars}
                      image={""}
                      description={card.description}
                      power={Math.floor(Math.random() * 20) + 10}
                      count={card.count}
                      shrink={1}
                      locked={card.count === 0}
                    />
                  ) : (
                    <div className="flex items-center justify-center">
                      <div key={`empty-${i}`} className="w-50 h-80 bg-amber-600 rounded-xl"></div>
                    </div>
                  );
                }) : 
                  exampleCards[activeType].map((card) => {
                    if (card.name.toLowerCase().startsWith(search))
                    return (
                      <Card
                        key={card.id}
                        title={card.name}
                        type={activeType}
                        stars={card.stars}
                        image={""}
                        description={card.description}
                        power={Math.floor(Math.random() * 20) + 10}
                        count={card.count}
                        shrink={1}
                        locked={card.count === 0}
                      />
                    );
                  })
                }
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default Collections
