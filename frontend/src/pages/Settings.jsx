import { useState } from 'react';

const Settings = () => {
  // Sample data for the simplified card
  const [cardData] = useState({
    title: "Potato",
    type: "fire", // Options: fire, water, grass, electric, psychic
    rating: 4, // Rating out of 5
    image: "/api/placeholder/300/200",
    description: "A MIGHTy POTATO",
    attack: 20
  });

  // Color mapping based on type
  const typeColors = {
    fire: "bg-red-100 border-red-400",
    water: "bg-blue-100 border-blue-400",
    grass: "bg-green-100 border-green-400",
    electric: "bg-yellow-100 border-yellow-400",
    psychic: "bg-purple-100 border-purple-400"
  };

  // Get background color class based on type
  const cardColorClass = typeColors[cardData.type] || "bg-gray-100 border-gray-400";

  // Render stars based on rating
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <div className='size-2 border-1 mx-1'></div>
      );
    }
    return stars;
  };

  return (
    <div className="h-screen w-full">
      <div className="w-full h-full flex items-center justify-center">
        <div className={`w-64 h-96 rounded-xl ${cardColorClass} border-2 flex flex-col overflow-hidden shadow-lg`}>
          {/* Title */}
          <div className="flex justify-center items-center p-3 border-b border-opacity-30 bg-white bg-opacity-30">
            <div className="font-bold text-xl">{cardData.title}</div>
          </div>
          
          {/* Rating */}
          <div className="flex justify-center items-center py-2">
            <div className="flex">
              {renderStars()}
            </div>
          </div>
          
          {/* Image */}
          <div className="w-full px-2">
            <img 
              src={cardData.image}
              alt={cardData.title}
              className="w-full h-40 border-1 object-cover rounded-md"
            />
          </div>
          
          {/* Description */}
          <div className="p-3 text-sm flex-grow italic">
            {cardData.description}
          </div>
          
          {/* Attack */}
          <div className="p-3 flex justify-center items-center border-t border-opacity-30">
            <span className="font-bold text-lg">{cardData.attack}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings