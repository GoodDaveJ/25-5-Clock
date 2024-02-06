/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [breakLength, setBreakLength] = useState(5);
  const [sessionsLength, setSessionLength] = useState(25);
  const [breakTimer, setBreakTimer] = useState(25 * 60);
  const [sessionTimer, setSessionTimer] = useState(25 * 60);
  const [started, setStarted] = useState(false);
  const [showBreakTimer, setShowBreakTimer] = useState(false);

  const handleBreakLength = (increase: boolean) => {
    if (increase) {
      if (breakLength < 60) {
        setBreakLength(breakLength + 1);
        if (!started) setBreakTimer((breakLength + 1) * 60); // Update timer if not started
      }
    } else {
      if (breakLength > 0) {
        setBreakLength(breakLength - 1);
        if (!started) setBreakTimer((breakLength - 1) * 60); // Update timer if not started
      }
    }
  };
  
  const handleSessionLength = (increase: boolean) => {
    if (increase) {
      if (sessionsLength < 60) {
        setSessionLength(sessionsLength + 1);
        if (!started) setSessionTimer((sessionsLength + 1) * 60); // Update timer if not started
      }
    } else {
      if (sessionsLength > 0) {
        setSessionLength(sessionsLength - 1);
        if (!started) setSessionTimer((sessionsLength - 1) * 60); // Update timer if not started
      }
    }
  };

  const handleReset = () => {
    setBreakLength(5);
    setSessionLength(25);
    setSessionTimer(25 * 60);
  }

  const handlePlayPause = () => {
    if (started) {
      setStarted(false)
    } else {
      setStarted(true)
    }
  }

  const playAlarm = () => {
    const audioElement = document.getElementById("beep") as HTMLAudioElement | null;
    
    if (audioElement) {
      audioElement.currentTime = 0; // Reset playback position to the beginning
      audioElement.play().catch((error) => console.error('Error playing audio:', error));
    } else {
      console.error(`Beep Beep`);
    }
  };

  useEffect(() => {
    let intervalId: any;
  
    if (started) {
      intervalId = setInterval(() => {
        if (showBreakTimer) {
          setBreakTimer((prevTimer) => {
            if (prevTimer === 0) {
              clearInterval(intervalId);
              return 0;
            }
            return prevTimer - 1;
          });
        } else {
          setSessionTimer((prevTimer) => {
            if (prevTimer === 0) {
              clearInterval(intervalId);
              return 0;
            }
            return prevTimer - 1;
          });
        }
      }, 1000);
    }
  
    return () => clearInterval(intervalId); // Cleanup function to clear interval
  
  }, [started, showBreakTimer]);

  useEffect(() => {
    if (sessionTimer === 0) {
      playAlarm()
      setShowBreakTimer(true);
      setSessionTimer(sessionsLength * 60); // Reset session timer to new session length
    }
  
    if (breakTimer === 0) {
      playAlarm()
      setShowBreakTimer(false);
      setBreakTimer(breakLength * 60); // Reset break timer to new break length
    }
  }, [sessionTimer, breakTimer]);
  
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>25 + 5 Clock</h1>
      </header>
      <div className="controls-wrapper">
        <div className="controls">
          <h3  id="break-label">Break Length</h3>
          <button disabled={started} className='increase' id="break-increment" onClick={() => { 
            handleBreakLength(true)    
          }}>+</button>
          <p id="break-length">{breakLength}</p>
          <button disabled={started} className='decrease' id="break-decrement" onClick={() => { 
            handleBreakLength(false)
          }}>-</button>
        </div>
        <div className="controls">
          <h3 id="session-label">Session Length</h3>
          <button disabled={started} className='increase' id="session-increment" onClick={() => { 
            handleSessionLength(true)
          }}>+</button>
          <p id="session-length">{sessionsLength}</p>
          <button disabled={started} className='decrease' id="session-decrement" onClick={() => { 
            handleSessionLength(false)
          }}>-</button>
        </div>
      </div>
      {showBreakTimer? (
      <div className='timer'>
      <h3 id="timer-label">Break</h3>
        <p id="time-left">
        {Math.floor(breakTimer / 60).toString().padStart(2, '0')}:
        {(breakTimer % 60).toString().padStart(2, '0')}
          </p>
          </div>
      ) : (
        <div className='timer'>
        <h3 id="timer-label">Session</h3>
        <p id="time-left">
    {Math.floor(sessionTimer / 60).toString().padStart(2, '0')}:
    {(sessionTimer % 60).toString().padStart(2, '0')}
      </p>
      </div>
      )}

      <div className='start-reset-wrapper'>
        <div id="start_stop" onClick={handlePlayPause}>Start/Pause</div>
        <div id="reset" onClick={handleReset}>Reset</div>
        <audio id="beep" controls>
    <source src="https://www.w3schools.com/html/horse.mp3" type="audio/mpeg" />
  </audio>
      </div>
    </div>
  );
}

export default App;
