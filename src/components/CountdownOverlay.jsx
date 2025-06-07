import React, { useState, useEffect, useRef } from 'react';

const CountdownOverlay = ({ onComplete, darkMode }) => {
  const [count, setCount] = useState(10);
  const [showFinalAnimation, setShowFinalAnimation] = useState(false);
  const audioRef = useRef(null);
  
  useEffect(() => {
    if (count <= 0) {
      // Play the buzzer sound
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.error("Error playing buzzer sound:", e));
      }
      
      // Show the final animation
      setShowFinalAnimation(true);
      
      // Wait for animation to complete before calling onComplete
      const animationTimer = setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 2000); // Animation duration
      
      return () => clearTimeout(animationTimer);
    }
    
    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [count, onComplete]);
  
  return (
    <div className={`countdown-overlay ${darkMode ? 'dark-mode' : ''}`}>
      {!showFinalAnimation ? (
        <div className={`countdown-number ${count <= 3 ? 'countdown-warning' : ''}`}>
          {count}
        </div>
      ) : (
        <div className="buzzer-animation">
          <div className="buzzer-circle"></div>
          <div className="buzzer-text">TIME'S UP!</div>
        </div>
      )}
      
      {/* NBA horn sound for buzzer */}
      <audio ref={audioRef} preload="auto">
        <source src="/nba-horn-sfx.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default CountdownOverlay;
