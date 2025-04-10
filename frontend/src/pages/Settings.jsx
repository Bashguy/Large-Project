import { useState } from 'react';
import Card from '../components/Card';

const Settings = () => {
  // Sample data for the simplified card
  const [cardData] = useState({
    title: "Potato",
    type: "dessert",
    rating: 4, // Rating out of 5
    image: "",
    description: "A MIGHTy POTATO",
    attack: 20
  });

  return (
    <div className="h-screen w-full select-none font-mono overflow-hidden">
      <div className="w-full h-full flex items-center justify-center">
        <Card 
          title={cardData.title} 
          type={cardData.type} 
          stars={cardData.rating} 
          image={cardData.image} 
          description={cardData.description} 
          power={cardData.attack} 
        />
      </div>
    </div>
  );
};

export default Settings