let ws;

export const initWebSocket = (onMessage) => {
  const wsUrl = 'ws://194.164.52.193:8080';
  console.log(`Attempting to connect to WebSocket at ${wsUrl}`);

  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log(`WebSocket connected to ${wsUrl}`);
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('Received message:', data);
      onMessage(data);
    } catch (error) {
      console.error('Error parsing message:', event.data, error);
    }
  };

  ws.onclose = (event) => {
    if (event.wasClean) {
      console.log(`WebSocket closed cleanly, code=${event.code}, reason=${event.reason}`);
    } else {
      console.error('WebSocket connection closed unexpectedly');
    }
    console.log('WebSocket disconnected');
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  // Log the readyState changes
  ws.addEventListener('open', () => console.log('WebSocket readyState is OPEN'));
  ws.addEventListener('close', () => console.log('WebSocket readyState is CLOSED'));
  ws.addEventListener('error', () => console.log('WebSocket readyState is ERROR'));
  ws.addEventListener('message', () => console.log('WebSocket readyState is MESSAGE'));
};

export const closeWebSocket = () => {
  if (ws) {
    console.log('Closing WebSocket connection');
    ws.close();
  } else {
    console.log('WebSocket is not initialized');
  }
};
