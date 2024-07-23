import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton
} from '@coreui/react';

import employeeService from 'src/services/employeeService';
import { MapContainer, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const SpaghettiDiagramModal = ({ visible, onClose, employeeId, startDateTime, endDateTime }) => {
  const [diagramData, setDiagramData] = useState({});

  useEffect(() => {
    const fetchDiagramData = async () => {
      if (employeeId && startDateTime && endDateTime) {
        try {
          const data = await employeeService.getSpaghettiDiagramData(employeeId, startDateTime, endDateTime);
          setDiagramData(data);
        } catch (error) {
          console.error('Ошибка при получении данных для спагетти-диаграммы:', error);
        }
      }
    };

    fetchDiagramData();
  }, [employeeId, startDateTime, endDateTime]);

  useEffect(() => {
    if (Object.keys(diagramData).length > 0) {
      const map = L.map('map', {
        crs: L.CRS.Simple,
        center: [500, 500],
        zoom: 0,
        minZoom: -4,
        maxZoom: 4,
      });

      const bounds = [[0, 0], [1000, 1000]];
      L.imageOverlay('src/assets/brand/plan.jpg', bounds).addTo(map);

      Object.keys(diagramData).forEach((zoneName) => {
        const { coordinates, totalDuration } = diagramData[zoneName];
        const circle = L.circle(coordinates, {
          radius: totalDuration / 10,
          color: 'red',
          fillOpacity: 0.5,
        });
        circle.addTo(map);
      });

      return () => {
        map.remove();
      };
    }
  }, [diagramData]);

  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>Спагетти-диаграмма</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div id="map" style={{ height: '500px', width: '100%' }}></div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>Закрыть</CButton>
      </CModalFooter>
    </CModal>
  );
};

SpaghettiDiagramModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  employeeId: PropTypes.number.isRequired,
  startDateTime: PropTypes.string.isRequired,
  endDateTime: PropTypes.string.isRequired,
};

export default SpaghettiDiagramModal;
