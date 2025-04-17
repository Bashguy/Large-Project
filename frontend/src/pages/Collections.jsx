import { useEffect, useState } from "react"
import Card from "../components/Card"
import { typeColors } from "../constant/home"
import { useUserCards } from "../hooks/useQueries"
import { cardApi } from "../services/api"

const Collections = () => {
  const [activeType, setActiveType] = useState("");
  const { data: userCards, isLoading } = useUserCards(activeType);
  const [search, setSearch] = useState("");
  const [ countCards, setCountCards ] = useState({
    breakfast_count: 0,
    dinner_count: 0,
    dessert_count: 0,
    total_count: 0
  });
  
  const types = ["breakfast", "dinner", "dessert"];

  const getTypeCount = async () => {
    const response = await cardApi.getCardTotal();
    setCountCards({
      breakfast_count: parseInt(response.breakfast_count),
      dinner_count: parseInt(response.dinner_count),
      dessert_count: parseInt(response.dessert_count),
      total_count: parseInt(response.breakfast_count) + parseInt(response.dinner_count) + parseInt(response.dessert_count)
    })
  };

  useEffect(() => {
    getTypeCount();
    document.title = "Collections";
  }, [])

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-black opacity-50 z-100 text-8xl text-white">Loading...</div>;
  }

  // Organize fetched cards by type
  const organizedCards = {
    breakfast: [],
    dinner: [],
    dessert: []
  };
  console.log(organizedCards)

  // If we have cards, organize them by type
  if (userCards && Array.isArray(userCards)) {
    userCards.forEach(card => {
      if (card.type && organizedCards[card.type]) {
        organizedCards[card.type].push(card);
      }
    });
  } 

  const renderCards = () => {
    // If search is active
    if (search.length > 0) {
      // If no type is selected but search is active, search through all types
      if (activeType === "") {
        return types.flatMap(type => organizedCards[type]
          .filter(card => card.name.toLowerCase().includes(search.toLowerCase()))
          .map(card => (
            <Card
              key={`${type}-${card._id}`}
              title={card.name}
              type={type}
              stars={card.stars}
              image={card.image}
              description={card.description}
              power={card.power}
              count={card.count}
              shrink={1}
              locked={card.count === 0}
              tilt={true}
            />
          ))
        );
      } else {
        // Search within the selected type
        return organizedCards[activeType]
          .filter(card => card.name.toLowerCase().includes(search.toLowerCase()))
          .map(card => (
            <Card
              key={`${activeType}-${card._id}`}
              title={card.name}
              type={activeType}
              stars={card.stars}
              image={card.image}
              description={card.description}
              power={card.power}
              count={card.count}
              shrink={1}
              locked={card.count === 0}
              tilt={true}
            />
          ));
      }
    }
    
    // If no search and no type filter (All is selected)
    if (activeType === "") {
      return types.flatMap((type) => {
        return [...Array(countCards.total_count)].map((_, i) => {
          // Find a card with ID matching the position (i+1)
          const card = organizedCards[type].find(card => card.grid_id === i + 1);
          
          return card ? (
            <Card
              key={`${type}-${card._id}`}
              title={card.name}
              type={type}
              stars={card.stars}
              image={card.image}
              description={card.description}
              power={card.power}
              count={card.count}
              shrink={1}
              locked={card.count === 0}
              tilt={true}
            />
          ) : (
            <div key={`empty-${type}-${i}`} className="flex items-center justify-center">
              <div className="w-50 h-80 bg-amber-600 rounded-xl"></div>
            </div>
          );
        });
      });
    }
    
    // If a specific type is selected
    return [...Array(countCards[`${activeType}_count`])].map((_, i) => {
      // Find a card with ID matching the position (i+1)
      const card = organizedCards[activeType].find(card => card.grid_id === i + 1);
      
      return card ? (
        <Card
          key={`${activeType}-${card._id}`}
          title={card.name}
          type={activeType}
          stars={card.stars}
          image={card.image}
          description={card.description}
          power={card.power}
          count={card.count}
          shrink={1}
          locked={card.count === 0}
          tilt={true}
        />
      ) : (
        <div key={`empty-${activeType}-${i}`} className="flex items-center justify-center">
          <div className="w-50 h-80 bg-amber-600 rounded-xl"></div>
        </div>
      );
    });
  };

  // Calculate total count of all cards for the progress bar (including locked ones)
  const totalCount = activeType === "" 
    ? Object.values(organizedCards).flatMap(cards => cards).length
    : organizedCards[activeType].length;

  const maxCards = activeType === "" ? countCards.total_count : countCards[`${activeType}_count`]

  return (
    <div className="h-screen select-none font-mono overflow-hidden">
      <div className="h-full w-full flex items-center justify-center">

        <div className="relative border-1 h-full w-4/5 md:w-3/5 shadow-[8px_6px_6px_4px_rgba(0,0,0,0.3)]">
          <div className="absolute top-0 w-full h-1/8 bg-linear-to-b from-white to-gray-300 border-b-25 border-green-800 z-5 flex items-start justify-center lg:items-end lg:justify-between max-lg:flex-col-reverse px-6 pb-4">
            <input 
              type="text" 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Search" 
              className="h-7 w-50 border-1 rounded-full px-4 py-2" 
            />
            
            <div className="flex items-center justify-center max-lg:my-2">
              <div className="h-5 w-50 border-1 rounded-full">
                <div 
                  className={`h-full bg-black transition-all rounded-full 
                    ${activeType === "breakfast" ? `${typeColors.breakfast}` : 
                    activeType === "dinner" ? `${typeColors.dinner}` : 
                    activeType === "dessert" ? `${typeColors.dessert}` :
                    `${typeColors.all}`}
                  `}
                  style={{ width: `${Math.min((totalCount / maxCards) * 100)}%` }} 
                />
              </div>
              <div className="ml-4">
                {`${totalCount}/${maxCards}`}
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 h-7/8 w-full bg-orange-300 text-xl flex justify-center overflow-hidden">
    
            {/* Type Selection header */}
            <div className="fixed h-1/12 w-[90%] md:w-[50%] text-[2vw] lg:text-[1.25vw] bg-amber-500 mt-5 rounded-full overflow-hidden shadow-[6px_6px_10px_2px_rgba(0,0,0,0.3)] z-10">

              {/* Animated slider */}
              <div 
                className={`absolute h-full w-1/4 transition-all duration-250 ease-in-out rounded-full 
                  ${activeType === "breakfast" ? `left-1/4 ${typeColors.breakfast}` : 
                    activeType === "dinner" ? `left-2/4 ${typeColors.dinner}` : 
                    activeType === "dessert" ? `left-3/4 ${typeColors.dessert}` : 
                    `left-0 ${typeColors.all}`
                  }`
                }
              />

              <div className="absolute h-full w-full flex justify-around z-10">
                <button 
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-all cursor-pointer
                    ${activeType === "" ? "text-white font-bold" : "text-amber-100 hover:text-white hover:scale-120"}`}
                  onClick={() => {
                    setActiveType("")
                    setSearch("")
                  }}
                >
                  All
                </button>
                <button 
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-all cursor-pointer
                    ${activeType === "breakfast" ? "text-black font-bold" : "text-zinc-800 hover:text-black hover:scale-120"}`}
                  onClick={() => {
                    setActiveType("breakfast")
                    setSearch("")
                  }}
                >
                  Breakfast
                </button>
                
                <button 
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-all cursor-pointer
                    ${activeType === "dinner" ? "text-black font-bold" : "text-zinc-800 hover:text-black hover:scale-120"}`}
                  onClick={() => {
                    setActiveType("dinner")
                    setSearch("")
                  }}
                >
                  Dinner
                </button>
                
                <button 
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-all cursor-pointer
                    ${activeType === "dessert" ? "text-black font-bold" : "text-zinc-800 hover:text-black  hover:scale-120"}`}
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
                {renderCards()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Collections