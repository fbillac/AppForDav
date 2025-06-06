import React, { useState, useEffect } from 'react';

const CountdownOverlay = ({ onComplete, darkMode }) => {
  const [count, setCount] = useState(10);
  
  useEffect(() => {
    if (count <= 0) {
      if (onComplete) {
        onComplete();
      }
      return;
    }
    
    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [count, onComplete]);
  
  return (
    <div className={`countdown-overlay ${darkMode ? 'dark-mode' : ''}`}>
      <div className="countdown-number">{count}</div>
    </div>
  );
};

export default CountdownOverlay;
