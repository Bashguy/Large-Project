const Background = () => {

  return (
    <div 
      className={`fixed h-screen w-full pointer-events-none overflow-hidden -z-50 bg-white`} 
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 99, 71, 0.8) 50%, transparent 50%),
          linear-gradient(to bottom, rgba(255, 99, 71, 0.8) 50%, transparent 50%)
        `,
        backgroundSize: '100px 100px',
        backgroundPosition: '-25px -25px',
      }}
    >
    </div>
  );
}

export default Background
