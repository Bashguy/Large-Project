import { useEffect, useState } from "react"

const Weather = () => {
  const [clouds, setClouds] = useState([]);

  const generateCloud = () => {
    const size = Math.random() * 100 + 50;
    const yPosition = Math.random() * 70 + 10; // Position between 10-80%
    const duration = Math.random() * 10000 + 20000; // Random duration between 20-30s

    const newCloud = {
      id: Date.now() + Math.random(),
      size: size,
      top: yPosition,
      duration: duration,
    };

    setClouds((prevClouds) => [...prevClouds, newCloud]);

    // Remove cloud after animation completes
    setTimeout(() => {
      setClouds((prevClouds) => prevClouds.filter((cloud) => cloud.id !== newCloud.id));
    }, duration + 500); // buffer
    
    // Schedule next cloud with random interval
    setTimeout(() => {
      generateCloud();
    }, Math.random() * 5000 + 5000); // Random interval between 5-10 seconds
  };

  useEffect(() => {
    generateCloud();

  }, []);

  return (
    <div className="h-screen w-full fixed overflow-hidden pointer-events-none z-25">
      {clouds.map((cloud) => (
        <div 
          key={cloud.id} 
          className="absolute w-full" 
          style={{
            top: `${cloud.top}%`,
            animation: `moveCloud ${cloud.duration}ms linear forwards`}}
        >
          <div 
            className="rounded-full blur-sm bg-black opacity-30"
            style={{
              width: `${cloud.size*2}px`,
              height: `${cloud.size}px`
            }}
          />
        </div>
      ))}
      <div className="h-full hidden w-full bg-amber-200 z-10 opacity-10"></div>
      <div className="h-full w-full bg-blue-900 z-10 opacity-30"></div>
    </div>
  )
}

export default Weather
