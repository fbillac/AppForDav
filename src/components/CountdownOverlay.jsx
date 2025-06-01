import React, { useState, useEffect } from 'react';

function CountdownOverlay({ onComplete, darkMode }) {
  const [count, setCount] = useState(10);
  const [showExplosion, setShowExplosion] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    // Reset state when component mounts
    setCount(10);
    setShowExplosion(false);
    setIsActive(true);
    
    let countdownTimer;
    
    if (isActive) {
      countdownTimer = setInterval(() => {
        setCount(prevCount => {
          if (prevCount <= 1) {
            clearInterval(countdownTimer);
            setShowExplosion(true);
            
            // Hide explosion and complete after animation
            setTimeout(() => {
              setShowExplosion(false);
              if (onComplete) onComplete();
            }, 1500);
            
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
    }
    
    // Cleanup function
    return () => {
      if (countdownTimer) {
        clearInterval(countdownTimer);
      }
    };
  }, [onComplete, isActive]);

  return (
    <div className={`countdown-overlay ${darkMode ? 'dark-mode' : ''}`}>
      <div className="countdown-container">
        {!showExplosion ? (
          <div className={`countdown-number ${count <= 3 ? 'critical' : ''}`}>
            {count}
          </div>
        ) : (
          <div className="explosion-effect">
            <div className="explosion-circle"></div>
            <div className="explosion-text">TIME'S UP!</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CountdownOverlay;
