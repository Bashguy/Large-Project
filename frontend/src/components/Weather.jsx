import { useEffect, useState } from "react"
import cloudImg from "../assets/cloud.png"

const Weather = ({ day, weather }) => {
  const [clouds, setClouds] = useState([]);

  const generateCloud = () => {
    const plusOrMinus = Math.random() < 0.5 ? -1 : 1; // Positive or negative
    const imageFit = Math.random() < 0.5 ? 'contain' : 'initial' // Scale or distort

    const size = Math.random() * 50 + 50; // Size between 100-200
    const yPosition = plusOrMinus * (Math.random() * 50); // Position between -50-50%
    const duration = Math.random() * 20000 + 60000; // Random duration between 80-100s

    const newCloud = {
      id: Date.now() + Math.random(),
      size: size,
      top: yPosition,
      duration: duration,
      fit: imageFit
    };

    setClouds((prevClouds) => [...prevClouds, newCloud]);

    // Remove cloud after animation completes
    setTimeout(() => {
      setClouds((prevClouds) => prevClouds.filter((cloud) => cloud.id !== newCloud.id));
    }, duration + 500); // buffer
    
    // Schedule next cloud with random interval
    setTimeout(() => {
      generateCloud();
    }, Math.random() * 15000 + 10000); // Random interval between 15-25 seconds
  };

  useEffect(() => {
    generateCloud();
  }, []);

  return (
    <div className={`${weather ? "opacity-100" : "opacity-0"} transition-all h-screen w-full fixed overflow-hidden pointer-events-none z-25`}>
      {clouds.map((cloud) => (
        <div 
          key={cloud.id} 
          className="absolute top-0 h-full w-full" 
          style={{
            animation: `moveCloud ${cloud.duration}ms linear forwards`
          }}
        >
          <img 
            src={cloudImg} 
            alt="cloud" 
            className="absolute right-0 brightness-0 opacity-40 blur-md" 
            style={{
              top: `${cloud.top}%`, 
              width: `${cloud.size}%`,
              height: `${cloud.size}%`,
              objectFit: `${cloud.fit}`
            }}
          />
        </div>
      ))}
      <div className={`h-full w-full transition-all z-10 ${day ? "bg-amber-200 opacity-10" : "bg-blue-900 opacity-30"}`}></div>
    </div>
  )
}

export default Weather
