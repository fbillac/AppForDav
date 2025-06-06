import React, { useState, useEffect, useRef } from 'react';
import CountdownOverlay from './CountdownOverlay';

function Timer({ darkMode }) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [duration, setDuration] = useState(60); // Default 60 seconds
  const [showCountdown, setShowCountdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);
  const countdownTimeoutRef = useRef(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      setShowCountdown(false); // Ensure countdown is hidden when starting
      
      // Clear any existing timeout
      if (countdownTimeoutRef.current) {
        clearTimeout(countdownTimeoutRef.current);
        countdownTimeoutRef.current = null;
      }
      
      // Calculate when to show the countdown (when 10 seconds remain)
      const countdownDelay = (duration - 10 - time) * 1000;
      
      // Only set the countdown timeout if we haven't passed the 10-second mark yet
      if (countdownDelay > 0) {
        countdownTimeoutRef.current = setTimeout(() => {
          setShowCountdown(true);
        }, countdownDelay);
      }
      
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;
          const timeRemaining = duration - newTime;
          
          // Play buzzer when timer reaches 10 seconds (instead of 0)
          if (timeRemaining <= 10) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            if (audioRef.current) {
              audioRef.current.play().catch(e => console.error("Error playing sound:", e));
            }
            // Set time to make the display show exactly 10 seconds remaining
            return duration - 10;
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
      
      // Clear the countdown timeout when stopping
      if (countdownTimeoutRef.current) {
        clearTimeout(countdownTimeoutRef.current);
        countdownTimeoutRef.current = null;
      }
    }
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTime(0);
    setShowCountdown(false);
    
    // Clear the countdown timeout when resetting
    if (countdownTimeoutRef.current) {
      clearTimeout(countdownTimeoutRef.current);
      countdownTimeoutRef.current = null;
    }
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
    resetTimer(); // Reset the main timer when the overlay countdown completes
  };

  // Clean up all timers when component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (countdownTimeoutRef.current) {
        clearTimeout(countdownTimeoutRef.current);
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
        <button onClick={startTimer} disabled={isRunning || timeRemaining <= 10}>
          Start
        </button>
        <button onClick={stopTimer} disabled={!isRunning} className="secondary">
          Stop
        </button>
        <button onClick={resetTimer} disabled={time === 0} className="secondary">
          Reset
        </button>
      </div>
      
      <button 
        className="timer-settings-toggle" 
        onClick={() => setShowSettings(!showSettings)}
      >
        {showSettings ? 'Hide Settings' : 'Settings'}
      </button>
      
      {showSettings && (
        <div className="timer-input">
          <label htmlFor="duration">Duration (seconds):</label>
          <input
            id="duration"
            type="number"
            min="1"
            value={duration}
            onChange={handleDurationChange}
            disabled={isRunning}
          />
        </div>
      )}

      {/* NBA horn sound for buzzer */}
      <audio ref={audioRef} preload="auto">
        <source src="/nba-horn-sfx.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Countdown overlay */}
      {showCountdown && (
        <CountdownOverlay 
          onComplete={handleCountdownComplete}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}

export default Timer;
