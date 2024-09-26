import React, { useEffect, useRef, useState } from 'react';
import { record } from 'rrweb';
import 'rrweb-player/dist/style.css';
import rrwebPlayer from 'rrweb-player';

function App() {
  const [recording, setRecording] = useState([]);
  const playerRef = useRef(null);
  const [isRecording, setIsRecording] = useState(true);
  const formRef = useRef(null); // Ref to the login form

  useEffect(() => {
    let stopFn;

    if (isRecording) {
      stopFn = record({
        emit(event) {
          setRecording((prev) => [...prev, event]);
        },
      });
    }

    return () => {
      if (stopFn) stopFn();
    };
  }, [isRecording]);

  const handleReplay = () => {
    if (playerRef.current && recording.length) {
      new rrwebPlayer({
        target: playerRef.current,
        props: {
          events: recording,
        },
      });
    }
  };

  // Function to extract styles and values from the form elements
  const extractFormStylesAndData = () => {
    const formElements = formRef.current.elements;
    const extractedData = [];

    for (let element of formElements) {
      if (element.tagName === 'INPUT' || element.tagName === 'BUTTON') {
        // Get element's computed styles
        const computedStyles = window.getComputedStyle(element);
        const styles = {
          color: computedStyles.color,
          backgroundColor: computedStyles.backgroundColor,
          border: computedStyles.border,
          fontSize: computedStyles.fontSize,
          padding: computedStyles.padding,
        };

        // Extract value if it's an input, otherwise just button details
        const data = {
          tag: element.tagName.toLowerCase(),
          type: element.type || '',
          value: element.value || '',
          styles: styles,
        };

        extractedData.push(data);
      }
    }

    return extractedData;
  };

  // Function to send extracted form data and styles to the backend
  const handleSendToBackend = async () => {
    const formData = extractFormStylesAndData();

    try {
      const response = await fetch('http://localhost:5000/save-recording', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }),
      });

      if (response.ok) {
        alert('Form data sent to backend successfully!');
      } else {
        alert('Failed to send form data to backend.');
      }
    } catch (error) {
      console.error('Error sending data to backend:', error);
      alert('Error sending data to backend.');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    alert('Login submitted!');
  };

  return (
    <div className="App">
      <h1>Login Form with RRWeb Recording</h1>
      <form onSubmit={handleLogin} ref={formRef}>
        <div>
          <label>Username:</label>
          <input type="text" name="username" placeholder="Enter your username" />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" placeholder="Enter your password" />
        </div>
        <button type="submit">Login</button>
      </form>
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setIsRecording(false)}>Stop Recording</button>
        <button onClick={handleReplay} disabled={isRecording}>
          Replay Recording
        </button>
        <button onClick={handleSendToBackend} disabled={isRecording}>
          Send Form Data to Backend
        </button>
      </div>
      <div
        ref={playerRef}
        style={{ marginTop: '20px', border: '1px solid #ccc', height: '300px' }}
      ></div>
    </div>
  );
}

export default App;
