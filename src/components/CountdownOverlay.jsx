import React, { useState, useEffect } from 'react';

function CountdownOverlay({ initialCount = 10, onComplete, darkMode }) {
  const [count, setCount] = useState(initialCount);
  const [showExplosion, setShowExplosion] = useState(false);

  useEffect(() => {
    if (count <= 0) {
      // Show explosion effect when countdown reaches zero
      setShowExplosion(true);
      
      // Hide the explosion effect after animation completes
      const explosionTimer = setTimeout(() => {
        setShowExplosion(false);
        if (onComplete) onComplete();
      }, 1500);
      
      return () => clearTimeout(explosionTimer);
    }
    
    // Decrement the counter every second
    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [count, onComplete]);

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
