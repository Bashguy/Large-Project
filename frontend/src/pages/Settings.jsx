import { useEffect, useState } from 'react';
import Card from '../components/Card';

const Settings = () => {
  
  useEffect(() => {
    document.title = "Settings"
  }, [])

  return (
    <div className="h-screen w-full select-none font-mono overflow-hidden">
      <div className="w-full h-full flex items-center justify-center">

      </div>
    </div>
  );
};

export default Settings