import React, { useEffect, useState } from 'react';
import { CListGroup, CListGroupItem } from '@coreui/react';
import { initWebSocket, closeWebSocket } from 'src/services/webSocketService';

const Realtime = () => {
  const [realTimeData, setRealTimeData] = useState([]);

  useEffect(() => {
    initWebSocket((data) => {
      setRealTimeData((prevData) => {
        const existingIndex = prevData.findIndex((item) => item.device_id === data.device_id);
        if (existingIndex !== -1) {
          const updatedData = [...prevData];
          updatedData[existingIndex] = data;
          return updatedData;
        }
        return [...prevData, data];
      });
    });

    return () => {
      closeWebSocket();
    };
  }, []);

  return (
    <CListGroup>
      {realTimeData.map((item) => (
        <CListGroupItem key={item.device_id}>
          Устройство {item.device_id}: {item.rssi}
        </CListGroupItem>
      ))}
    </CListGroup>
  );
};

export default Realtime;
