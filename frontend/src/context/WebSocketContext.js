import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // Импортируем PropTypes

let ws;

const WebSocketContext = createContext(null);
const WS_URL = process.env.REACT_APP_WS_URL || "ws://localhost:8080/"; // Убедитесь, что URL правильный

export const WebSocketProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    ws = new WebSocket(WS_URL, [
      "protocolOne",
      "protocolTwo",
    ]); // Исправляем URL
  
   

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
  children: PropTypes.node.isRequired, // Добавляем валидацию PropTypes
};

export const useWebSocket = () => {
  return React.useContext(WebSocketContext);
};
