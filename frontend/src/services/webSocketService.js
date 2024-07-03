let ws;

export const initWebSocket = (onMessage) => {
  ws = new WebSocket('ws://localhost:8080'); 

  ws.onopen = () => {
    console.log('WebSocket connected');
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  ws.onclose = () => {
    console.log('WebSocket disconnected');
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
};

export const closeWebSocket = () => {
  if (ws) {
    ws.close();
  }
};
