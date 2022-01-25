import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from "react";

import RecordingAPI from './components/RecordingApi';

import io from "socket.io-client";
import { ReactMic } from 'react-mic';
const ENDPOINT = "http://127.0.0.1:5000";
 

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(`${ENDPOINT}`);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);
  
  return (
   <RecordingAPI socket={socket}/>
   
  );
}

export default App;
