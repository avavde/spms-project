import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // Импортируем PropTypes

let ws;

const WebSocketContext = createContext(null);
const WS_URL = 'ws//194.164.52.193:8080';

export const WebSocketProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [data, ...prevMessages]);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={messages}>
      {children}
    </WebSocketContext.Provider>
  );
};

WebSocketProvider.propTypes = {
  children: PropTypes.node.isRequired, 
};

export const useWebSocket = () => {
  return React.useContext(WebSocketContext);
};
