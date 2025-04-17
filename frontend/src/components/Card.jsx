import starImage from "../assets/star.svg"
import { typeColors } from "../constant/home"
import Tilt from 'react-parallax-tilt'

const Card = (props) => {

  return (
    <Tilt 
      key={1} 
      tiltEnable={props.tilt}
      tiltReverse={true} 
      glareEnable={true} 
      glareMaxOpacity={0.5} 
      glareColor="white" 
      glarePosition="all" 
      glareBorderRadius="10px" 
      scale={1.15} 
      tiltMaxAngleX={10}
      tiltMaxAngleY={10}
      transitionSpeed={1000} 
      perspective={500} 
      className={`ml-2 w-fit h-full rounded-xl transition duration-250 hover:shadow-[6px_6px_12px_2px_rgba(0,0,0,0.3)]`}
    >
      <div className="relative flex items-center justify-center">
        <div className={`w-50 h-80 rounded-xl ${typeColors[props.type]} ${props.locked && "grayscale-100"} border-2 flex flex-col overflow-hidden shadow-lg transition duration-100 cursor-pointer 
          ${props.shrink && ""}`}
        >
          {/* Title */}
          <div className="flex justify-center items-center p-2 border-b bg-white">
            <div className="font-bold text-lg">{props.title}</div>
          </div>

          {/* Rating */}
          <div className="flex justify-center items-center py-2">
            <div className="flex flex-row">
              {[...Array(props.stars ? props.stars : 0)].map((_, index) => (
                <img key={index} src={starImage} alt="★" className="size-5 mx-0.5" onDragStart={(e) => e.preventDefault()} />
              ))} 
            </div>
          </div>

          {/* Image */}
          <div className="w-full px-2">
            <img
              src={props.image || ""}
              alt={props.title}
              className="w-full h-30 border-1 object-cover rounded-md"
            />
          </div>

          {/* Description */}
          <div className="p-3 text-sm flex-grow italic">
            {props.description}
          </div>

          {/* Attack */}
          <div className="p-2 flex justify-center items-center border-t">
            <span className="font-bold text-lg">{props.power}</span>
          </div>
        </div>
        {props.count !== 0 && 
          <div className="absolute -bottom-10 w-fit h-10 flex items-center justify-center z-5">
            {props.count}
          </div>
        }
      </div>
    </Tilt>
  )
}

export default Card
