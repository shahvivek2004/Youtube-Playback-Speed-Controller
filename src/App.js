import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [speed, setSpeed] = useState(1.0); // Default speed is 1.0

  useEffect(() => {
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: getCurrentSpeed,
        },
        (results) => {
          if (results && results[0] && results[0].result) {
            setSpeed(results[0].result);
          }
        }
      );
    });
  }, []);

  const sendMessage = (action) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: action === "increase" ? increaseSpeed : decreaseSpeed,
        },
        (results) => {
          if (results && results[0] && results[0].result) {
            setSpeed(results[0].result);
          }
        }
      );
    });
  };

  const increaseSpeed = () => {
    const video = document.querySelector("video");
    if (video) {
      video.playbackRate += 0.25;
      return video.playbackRate;
    }
  };

  const decreaseSpeed = () => {
    const video = document.querySelector("video");
    if (video) {
      video.playbackRate -= 0.25;
      return video.playbackRate;
    }
  };

  const getCurrentSpeed = () => {
    const video = document.querySelector("video");
    return video ? video.playbackRate : 1.0;
  };

  return (
    <div className="App">
      <h1>YouTube Speed Controller</h1>
      <p className="speed-display">Current Speed: {speed.toFixed(2)}x</p>
      <button className="speed-btn" onClick={() => sendMessage("increase")}>
        Increase Speed
      </button>
      <button className="speed-btn" onClick={() => sendMessage("decrease")}>
        Decrease Speed
      </button>
    </div>
  );
}

export default App;
