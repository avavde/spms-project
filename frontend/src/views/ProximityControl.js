// src/views/ProximityControl.js
import React, { useState, useEffect } from 'react';
import {
  CToaster,
  CContainer,
  CRow,
  CCol,
} from '@coreui/react';
import MapProximity from 'src/components/MapProximity';

const ProximityControl = () => {
  const [tags, setTags] = useState([]);
  const [dangerZones, setDangerZones] = useState([]);
  const [toasts, setToasts] = useState([]);

  const wsUrl = 'ws://194.164.52.193:3000';

  useEffect(() => {
    const wss = new WebSocket(wsUrl);

    wss.onopen = () => {
      console.log('WebSocket connection established');
    };

    wss.onmessage = (event) => {
      console.log('Received message:', event.data);
      const data = JSON.parse(event.data);
      if (data.type === 'tag_update') {
        setTags((prevTags) => {
          const tagIndex = prevTags.findIndex((tag) => tag.id === data.id);
          if (tagIndex !== -1) {
            const updatedTags = [...prevTags];
            updatedTags[tagIndex] = data;
            console.log('Updated tags:', updatedTags);
            return updatedTags;
          }
          const newTags = [...prevTags, data];
          console.log('New tags:', newTags);
          return newTags;
        });
      } else if (data.type === 'danger_zones') {
        console.log('Received danger zones:', data.zones);
        setDangerZones(data.zones);
      } else if (data.type === 'stop') {
        console.log('Received stop message:', data.message);
        const newToast = {
          autohide: false,
          closeButton: true,
          color: 'danger',
          header: 'Опасность',
          body: data.message,
        };
        // Заменяем текущий массив уведомлений новым уведомлением
        setToasts([newToast]);
      }
    };

    wss.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wss.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      wss.close();
    };
  }, []);

  return (
    <CContainer>
      <CRow>
        <CCol>
          <MapProximity tags={tags} dangerZones={dangerZones} />
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CToaster toasts={toasts} placement="top-end" />
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default ProximityControl;
