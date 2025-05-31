import React, { useState, useEffect, useRef } from 'react';

function Timer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [duration, setDuration] = useState(60); // Default 60 seconds
  const intervalRef = useRef(null);

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
          if (prevTime >= duration) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            return duration;
          }
          return prevTime + 1;
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

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="timer-container">
      <div className="timer-display">{formatTime(time)}</div>
      
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
    </div>
  );
}

export default Timer;
