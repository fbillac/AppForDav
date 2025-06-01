import React, { useState, useEffect, useRef } from 'react';
import CountdownOverlay from './CountdownOverlay';

function Timer({ darkMode }) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [duration, setDuration] = useState(60); // Default 60 seconds
  const [showCountdown, setShowCountdown] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;
          const timeRemaining = duration - newTime;
          
          // Show countdown overlay when 10 seconds remain
          if (timeRemaining === 10) {
            setShowCountdown(true);
          }
          
          // Play buzzer when timer reaches zero
          if (timeRemaining <= 0) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            if (audioRef.current) {
              audioRef.current.play().catch(e => console.error("Error playing sound:", e));
            }
            return duration;
          }
          return newTime;
        });
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTime(0);
    setShowCountdown(false);
  };

  const handleDurationChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setDuration(value);
      if (time > value) {
        setTime(value);
      }
    }
  };

  const handleCountdownComplete = () => {
    setShowCountdown(false);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const timeRemaining = duration - time;
  const progressPercentage = (time / duration) * 100;
  const isAlmostFinished = timeRemaining <= 10;

  return (
    <div className={`timer-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className={`timer-display ${isAlmostFinished ? 'timer-warning' : ''}`}>
        {formatTime(timeRemaining)}
      </div>
      
      <div className="timer-progress">
        <div 
          className="timer-progress-bar" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="timer-controls">
        <button onClick={startTimer} disabled={isRunning || time >= duration}>
          Start
        </button>
        <button onClick={stopTimer} disabled={!isRunning} className="secondary">
          Stop
        </button>
        <button onClick={resetTimer} disabled={time === 0} className="secondary">
          Reset
        </button>
      </div>
      
      <div className="timer-input">
        <label htmlFor="duration">Timer duration (seconds):</label>
        <input
          id="duration"
          type="number"
          min="1"
          value={duration}
          onChange={handleDurationChange}
          disabled={isRunning}
        />
      </div>

      {/* NBA horn sound for buzzer */}
      <audio ref={audioRef} preload="auto">
        <source src="/nba-horn-sfx.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Countdown overlay */}
      {showCountdown && (
        <CountdownOverlay 
          initialCount={10} 
          onComplete={handleCountdownComplete}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}

export default Timer;
