import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
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
  const [zoneCoordinates, setZoneCoordinates] = useState({});
  const [sliderValue, setSliderValue] = useState(0);
  const [currentMapType, setCurrentMapType] = useState('plan');
  const [stepCounter, setStepCounter] = useState(0);
  const [zoneSteps, setZoneSteps] = useState(0);
  const stepThreshold = 3;
  const planMapRef = useRef(null);
  const gpsMapRef = useRef(null);
  const planMapContainerRef = useRef(null);
  const gpsMapContainerRef = useRef(null);
  const zoneLayerRef = useRef(L.layerGroup());
  const lineLayerRef = useRef(L.layerGroup());
  const gpsLayerRef = useRef(L.layerGroup());
  const [zoneDurations, setZoneDurations] = useState({});
  const [routeFrequencies, setRouteFrequencies] = useState({});
  const [movementTimes, setMovementTimes] = useState({});
  const trackLineRef = useRef(null);
  const currentPointRef = useRef(null);
  const firstCenteringDoneRef = useRef(false);
  const extraSteps = 20;

  const fetchDiagramData = useCallback(async () => {
    if (employeeId && startDate && endDate) {
      try {
        const { movements, zones } = await employeeService.getEmployeeMovements(employeeId, startDate, endDate);
        
        // Добавляем дополнительные шаги
        const extendedMovements = [];
        movements.forEach((movement, index) => {
          extendedMovements.push(movement);
          if (movement.eventType !== 'gnss_position' && index < movements.length - 1) {
            for (let i = 0; i < extraSteps; i++) {
              extendedMovements.push({ ...movement, timestamp: null });
            }
          }
        });
        
        setDiagramData(extendedMovements);
        setZoneCoordinates(zones);
        setSliderValue(0);
      } catch (error) {
        console.error('Ошибка при получении данных для спагетти-диаграммы:', error);
      }
    }
  }, [employeeId, startDate, endDate, extraSteps]);

  useEffect(() => {
    fetchDiagramData();
  }, [fetchDiagramData]);

  const maxDuration = useMemo(() => Math.max(...Object.values(zoneDurations)), [zoneDurations]);
  const maxFrequency = useMemo(() => Math.max(...Object.values(routeFrequencies)), [routeFrequencies]);

  const getColorByFrequency = useCallback((frequency) => {
    const ratio = frequency / maxFrequency;
    const r = Math.round(255 * ratio);
    const g = 0;
    const b = Math.round(255 * (1 - ratio));
    return `rgb(${r},${g},${b})`;
  }, [maxFrequency]);

  const getIntensityColor = useCallback((duration) => {
    const ratio = duration / maxDuration;
    const r = Math.round(255 * ratio);
    const g = 0;
    const b = Math.round(255 * (1 - ratio));
    return `rgba(${r},${g},${b},${ratio})`;
  }, [maxDuration]);

  const calculateCenter = useCallback((coordinates) => {
    if (!Array.isArray(coordinates) || coordinates.length === 0) return [0, 0];
    const x = coordinates.reduce((sum, coord) => sum + coord[0], 0) / coordinates.length;
    const y = coordinates.reduce((sum, coord) => sum + coord[1], 0) / coordinates.length;
    return [x, y];
  }, []);

  useEffect(() => {
    if (!planMapRef.current && diagramData.length > 0 && planMapContainerRef.current) {
      const planMap = L.map(planMapContainerRef.current, {
        crs: L.CRS.Simple,
        center: [500, 500],
        zoom: 0,
        minZoom: -4,
        maxZoom: 4,
        maxBounds: [[0, 0], [1000, 1000]],
        maxBoundsViscosity: 1.0,
      });

      const bounds = [[0, 0], [1000, 1000]];
      L.imageOverlay(plan, bounds).addTo(planMap);
      lineLayerRef.current.addTo(planMap);
      zoneLayerRef.current.addTo(planMap);

      planMapRef.current = planMap;
    }
    if (!gpsMapRef.current && diagramData.length > 0 && gpsMapContainerRef.current) {
      const gpsMap = L.map(gpsMapContainerRef.current, {
        center: [55.347923, 85.999771],
        zoom: 15,
        maxZoom: 19,
      });

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; <a href="https://www.esri.com/en-us/home">Esri</a>',
        maxZoom: 19,
      }).addTo(gpsMap);

      gpsLayerRef.current.addTo(gpsMap);

      gpsMapRef.current = gpsMap;

      // Create track line and current point
      trackLineRef.current = L.polyline([], { color: 'blue', weight: 3 }).addTo(gpsMap);
      currentPointRef.current = L.circleMarker([0, 0], { color: 'red', radius: 5 }).addTo(gpsMap);
    }

    if (planMapRef.current && gpsMapRef.current) {
      zoneLayerRef.current.clearLayers();
      lineLayerRef.current.clearLayers();
      gpsLayerRef.current.clearLayers();

      const routeCounts = {};
      const currentZoneDurations = {};
      const currentMovementTimes = {};
      const trackPoints = [];

      let stepsRemainingInZone = zoneSteps; // Track steps remaining in the current zone
      let lastExitTimestamp = null; // Track the timestamp of the last exit event
      let lastExitZoneName = null; // Track the name of the last exit zone

      diagramData.forEach((zone, index) => {
        if (index <= sliderValue) {
          const { eventType } = zone;

          if (eventType === 'gnss_position') {
            if (stepsRemainingInZone > 0) {
              stepsRemainingInZone--;
            } else {
              setStepCounter((prevCounter) => prevCounter + 1);
            }
            if (stepCounter >= stepThreshold) {
              // Hide plan map and show GPS map
              planMapContainerRef.current.style.display = 'none';
              gpsMapContainerRef.current.style.display = 'block';
              gpsMapRef.current.invalidateSize(); // Ensure the map is properly resized
              if (!firstCenteringDoneRef.current) {
                gpsMapRef.current.setView([zone.latitude, zone.longitude], 15);
                firstCenteringDoneRef.current = true;
              }
              setCurrentMapType('gps');
              setStepCounter(0);
            }
            // Add coordinates to track
            trackPoints.push([zone.latitude, zone.longitude]);
            currentPointRef.current.setLatLng([zone.latitude, zone.longitude]);
            trackLineRef.current.setLatLngs(trackPoints);
          } else {
            if (zone.duration !== undefined) {
              stepsRemainingInZone = Math.ceil(zone.duration);
            }
            setStepCounter((prevCounter) => prevCounter + 1);
            if (stepCounter >= stepThreshold) {
              // Hide GPS map and show plan map
              gpsMapContainerRef.current.style.display = 'none';
              planMapContainerRef.current.style.display = 'block';
              planMapRef.current.invalidateSize(); // Ensure the map is properly resized
              planMapRef.current.setView([500, 500], 0);
              setCurrentMapType('plan');
              setStepCounter(0);
            }
            if (zone.duration !== undefined && zone.zoneName !== undefined) {
              const { duration, zoneName } = zone;

              if (!currentZoneDurations[zoneName]) {
                currentZoneDurations[zoneName] = 0;
              }
              if (duration !== null) {
                currentZoneDurations[zoneName] += duration / 60; // Convert to minutes
              }
              const accumulatedDuration = currentZoneDurations[zoneName];
              const color = getIntensityColor(accumulatedDuration);
              const coordinates = zoneCoordinates[zoneName]?.coordinates || [];
              if (Array.isArray(coordinates)) {
                const polygon = L.polygon(coordinates, {
                  color: color,
                  fillOpacity: 0.9 - (accumulatedDuration / maxDuration) * 0.8, // min 90% to max 10% opacity
                });
                polygon.addTo(zoneLayerRef.current);

                const zoneCenter = calculateCenter(coordinates);

                if (eventType === 'exit') {
                  lastExitTimestamp = new Date(zone.timestamp);
                  lastExitZoneName = zoneName;
                }
                
                if (eventType === 'enter' && lastExitTimestamp && lastExitZoneName) {
                  const movementDuration = (new Date(zone.timestamp) - lastExitTimestamp) / 60000; // Convert to minutes
                  const routeKey = `${lastExitZoneName}-${zoneName}`;
                  if (!currentMovementTimes[routeKey]) {
                    currentMovementTimes[routeKey] = 0;
                  }
                  currentMovementTimes[routeKey] += movementDuration;
                  lastExitTimestamp = null;
                  lastExitZoneName = null;
                
                  const prevZoneCenter = calculateCenter(zoneCoordinates[lastExitZoneName]?.coordinates || []);
                  if (prevZoneCenter) {
                    const polyline = L.polyline([prevZoneCenter, zoneCenter], {
                      color: getColorByFrequency(routeCounts[routeKey] || 1),
                      weight: 1 + (routeCounts[routeKey] || 1) * 0.1, // Weight based on frequency
                      opacity: 0.5, // Semi-transparent lines
                    });
                    polyline.addTo(lineLayerRef.current);
                  }
                }
              }
            }
          }
        }
      });

      setZoneDurations(currentZoneDurations);
      setRouteFrequencies(routeCounts);
      setMovementTimes(currentMovementTimes);
    }
  }, [diagramData, sliderValue, zoneCoordinates, getColorByFrequency, getIntensityColor, calculateCenter, stepCounter, zoneSteps, stepThreshold]);

  const handleSliderChange = (e) => {
    setSliderValue(parseInt(e.target.value, 10));
    setStepCounter(0); // Reset step counter on slider change
    const currentZone = diagramData[parseInt(e.target.value, 10)];
    if (currentZone && currentZone.duration !== undefined) {
      setZoneSteps(Math.ceil(currentZone.duration)); // Set zoneSteps to the duration of the current zone
    } else {
      setZoneSteps(0);
    }
  };

  const currentZoneData = diagramData[sliderValue] || {};
  const currentTimestamp = currentZoneData.timestamp ? new Date(currentZoneData.timestamp).toLocaleString() : '';

  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>Спагетти-диаграмма</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div
          id="planMapContainer"
          ref={planMapContainerRef}
          style={{ height: '500px', width: '100%', display: currentMapType === 'plan' ? 'block' : 'none' }}
        ></div>
        <div
          id="gpsMapContainer"
          ref={gpsMapContainerRef}
          style={{ height: '500px', width: '100%', display: currentMapType === 'gps' ? 'block' : 'none' }}
        ></div>
        <CFormText>Текущий шаг: {currentTimestamp}</CFormText>
        <CFormRange min="0" max={diagramData.length - 1} value={sliderValue} onChange={handleSliderChange} />
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
