const Card = (props) => {
  // Color mapping based on type
  const typeColors = {
    breakfast: "bg-red-100 border-red-400",
    dinner: "bg-green-100 border-green-400",
    dessert: "bg-purple-100 border-purple-400"
  };

  // Get background color class based on type
  const cardColorClass = typeColors[props.type] || "bg-gray-100 border-gray-400";

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
    <>
      <div className={`w-64 h-96 rounded-xl ${cardColorClass} border-2 flex flex-col overflow-hidden shadow-lg`}>
        {/* Title */}
        <div className="flex justify-center items-center p-3 border-b border-opacity-30 bg-white bg-opacity-30">
          <div className="font-bold text-xl">{props.title}</div>
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
            src={props.image || ""}
            alt={props.title}
            className="w-full h-40 border-1 object-cover rounded-md"
          />
        </div>

        {/* Description */}
        <div className="p-3 text-sm flex-grow italic">
          {props.description}
        </div>

        {/* Attack */}
        <div className="p-3 flex justify-center items-center border-t border-opacity-30">
          <span className="font-bold text-lg">{props.power}</span>
        </div>
      </div>
    </>
  )
}

export default Card
