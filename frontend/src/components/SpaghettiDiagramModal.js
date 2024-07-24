
import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormRange,
  CFormText,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHeaderCell,
  CTableHead,
  CTableRow,
} from '@coreui/react';

import employeeService from 'src/services/employeeService';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import plan from 'src/assets/brand/plan.jpg';

const SpaghettiDiagramModal = ({ visible, onClose, employeeId, startDate, endDate }) => {
  const [diagramData, setDiagramData] = useState([]);
  const [sliderValue, setSliderValue] = useState(0);
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const zoneLayerRef = useRef(L.layerGroup());
  const lineLayerRef = useRef(L.layerGroup());
  const [zoneDurations, setZoneDurations] = useState({});
  const [routeFrequencies, setRouteFrequencies] = useState({});
  const [movementTimes, setMovementTimes] = useState({});
  const [totalMovementTime, setTotalMovementTime] = useState(0);
  console.log(totalMovementTime);

  useEffect(() => {
    const fetchDiagramData = async () => {      
      if (employeeId && startDate && endDate) {
        try {
          const data = await employeeService.getEmployeeMovements(employeeId, startDate, endDate);
          console.log('Fetched Diagram Data:', data);
          setDiagramData(data);
          setSliderValue(0);
        } catch (error) {
          console.error('Ошибка при получении данных для спагетти-диаграммы:', error);
        }
      }
    };

    fetchDiagramData();
  }, [employeeId, startDate, endDate]);

  useEffect(() => {
    if (!mapRef.current && diagramData.length > 0 && mapContainerRef.current) {
      const map = L.map(mapContainerRef.current, {
        crs: L.CRS.Simple,
        center: [500, 500],
        zoom: 0,
        minZoom: -4,
        maxZoom: 4,
      });

      const bounds = [[0, 0], [1000, 1000]];
      L.imageOverlay(plan, bounds).addTo(map);
      lineLayerRef.current.addTo(map);
      zoneLayerRef.current.addTo(map);

      mapRef.current = map;
    }

    if (mapRef.current) {
      zoneLayerRef.current.clearLayers();
      lineLayerRef.current.clearLayers();

      const calculateDurationsAndFrequencies = (data, maxIndex) => {
        
        const zoneDurations = {};
        const routeFrequencies = {};
        const movementTimes = {};
        let totalMovementTime = 0;

        data.forEach((zone, index) => {
          if (index > maxIndex) return;

          const { zoneName, duration, timestamp, eventType } = zone;

          // Calculate zone durations
          if (!zoneDurations[zoneName]) {
            zoneDurations[zoneName] = 0;
          }
          if (duration !== null) {
            zoneDurations[zoneName] += duration / 60; // Convert to minutes
          }

          // Calculate route frequencies and movement times
          if (index > 0) {
            const prevZone = data[index - 1];
            const routeKey = `${prevZone.zoneName}-${zone.zoneName}`;

            if (eventType === 'enter' && prevZone.eventType === 'exit') {
              const movementDuration = (new Date(timestamp) - new Date(prevZone.timestamp)) / 60000; // Convert to minutes
              totalMovementTime += movementDuration;

              if (!movementTimes[routeKey]) {
                movementTimes[routeKey] = 0;
              }
              movementTimes[routeKey] += movementDuration;
            }

            if (!routeFrequencies[routeKey]) {
              routeFrequencies[routeKey] = 0;
            }
            routeFrequencies[routeKey] += 1;
          }
        });

        setZoneDurations(zoneDurations);
        setRouteFrequencies(routeFrequencies);
        setMovementTimes(movementTimes);
        setTotalMovementTime(totalMovementTime);
      };

      calculateDurationsAndFrequencies(diagramData, sliderValue);

      const maxDuration = Math.max(...Object.values(zoneDurations));
      const maxFrequency = Math.max(...Object.values(routeFrequencies));

      const getColorByFrequency = (frequency) => {
        const ratio = frequency / maxFrequency;
        const r = Math.round(255 * ratio);
        const g = 0;
        const b = Math.round(255 * (1 - ratio));
        return `rgb(${r},${g},${b})`;
      };

      const getIntensityColor = (duration) => {
        const ratio = duration / maxDuration;
        const r = Math.round(255 * ratio);
        const g = 0;
        const b = Math.round(255 * (1 - ratio));
        return `rgba(${r},${g},${b},${ratio})`;
      };

      const calculateCenter = (coordinates) => {
        const x = coordinates.reduce((sum, coord) => sum + coord[0], 0) / coordinates.length;
        const y = coordinates.reduce((sum, coord) => sum + coord[1], 0) / coordinates.length;
        return [x, y];
      };

      const routeCounts = {};
      const currentZoneDurations = {};
      const currentMovementTimes = {};

      diagramData.forEach((zone, index) => {
        if (index <= sliderValue && zone.duration !== undefined && zone.coordinates !== undefined) {
          const { coordinates, duration, zoneName } = zone;

          if (!currentZoneDurations[zoneName]) {
            currentZoneDurations[zoneName] = 0;
          }
          if (duration !== null) {
            currentZoneDurations[zoneName] += duration / 60; // Convert to minutes
          }

          const accumulatedDuration = currentZoneDurations[zoneName];
          const color = getIntensityColor(accumulatedDuration);
          const polygon = L.polygon(coordinates, {
            color: color,
            fillOpacity: 0.9 - (accumulatedDuration / maxDuration) * 0.8, // min 90% to max 10% opacity
          });
          polygon.addTo(zoneLayerRef.current);

          const zoneCenter = calculateCenter(coordinates);

          if (index > 0) {
            
            const prevZone = diagramData[index - 1];
            if (prevZone.coordinates !== undefined) {
              const prevZoneCenter = calculateCenter(prevZone.coordinates);
              const routeKey = `${prevZone.zoneName}-${zone.zoneName}`;
              if (!routeCounts[routeKey]) {
                routeCounts[routeKey] = 0;
              }
              routeCounts[routeKey] += 1;

              const movementDuration = (new Date(zone.timestamp) - new Date(prevZone.timestamp)) / 60000;
              if (!currentMovementTimes[routeKey]) {
                currentMovementTimes[routeKey] = 0;
              }
              currentMovementTimes[routeKey] += movementDuration;

              const polyline = L.polyline([prevZoneCenter, zoneCenter], {
                color: getColorByFrequency(routeCounts[routeKey]),
                weight: 1 + routeCounts[routeKey] * 0.1, // Weight based on frequency
                opacity: 0.5, // Semi-transparent lines
              });
              polyline.addTo(lineLayerRef.current);
            }
          }
        }
      });

      setZoneDurations(currentZoneDurations);
      setMovementTimes(currentMovementTimes);
    }
  }, [diagramData, sliderValue]);

  const handleSliderChange = (e) => {
    setSliderValue(parseInt(e.target.value, 10));
  };

  const currentZoneData = diagramData[sliderValue] || {};
  const currentTimestamp = currentZoneData.timestamp ? new Date(currentZoneData.timestamp).toLocaleString() : '';


  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>Спагетти-диаграмма</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div id="map" ref={mapContainerRef} style={{ height: '500px', width: '100%' }}></div>
        <CFormText>
          {`Текущий шаг: ${currentTimestamp}`}
        </CFormText>
        <CFormRange 
          min="0" 
          max={diagramData.length - 1} 
          value={sliderValue} 
          onChange={handleSliderChange} 
        />
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Название зоны</CTableHeaderCell>
              <CTableHeaderCell>Накопленное время (мин)</CTableHeaderCell>
                    </CTableRow>
        </CTableHead>
        <CTableBody>
          {Object.entries(zoneDurations).map(([zone, time]) => (
            <CTableRow key={zone}>
              <CTableDataCell>{zone}</CTableDataCell>
              <CTableDataCell>{time.toFixed(2)}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Маршрут</CTableHeaderCell>
            <CTableHeaderCell>Накопленное время (мин)</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {Object.entries(movementTimes).map(([route, time]) => (
            <CTableRow key={route}>
              <CTableDataCell>{route}</CTableDataCell>
              <CTableDataCell>{time.toFixed(2)}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
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
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
};

export default SpaghettiDiagramModal;
