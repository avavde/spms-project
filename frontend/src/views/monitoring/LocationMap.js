// src/components/LocationMap.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapContainer, ImageOverlay, Polygon, Popup, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import ZoneEmployeesModal from '../../components/dashboard/ZoneEmployeesModal';
import 'leaflet/dist/leaflet.css';
import plan from 'src/assets/brand/plan.jpeg';
import employeeIconUrl from 'src/assets/images/employee.png';
import zonesService from 'src/services/zonesService';
import { useWebSocket } from 'src/context/WebSocketContext';  // Импортируем WebSocketContext

const imageBounds = [[0, 0], [1000, 1000]];

const employeeIcon = new L.Icon({
  iconUrl: employeeIconUrl,
  iconSize: [25, 25],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

const LocationMap = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [zones, setZones] = useState([]);
  const notifications = useWebSocket();  // Используем WebSocketContext
  const [realTimeData, setRealTimeData] = useState([]);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const data = await zonesService.getAllZones();
        console.log('Fetched zones:', data); // Лог для проверки данных
        setZones(data || []);
      } catch (error) {
        console.error('Ошибка при получении зон:', error);
      }
    };
    fetchZones();
  }, []);

  useEffect(() => {
    notifications.forEach((message) => {
      const { type, data } = message;
      if (type === 'zone_event') {
        setRealTimeData((prevData) => {
          const newData = prevData.filter(item => item.employee_id !== data.employee_id);
          if (data.event_type === 'вошел в зону') {
            newData.push(data);
          }
          return newData;
        });
      }
    });
  }, [notifications]);

  const handleOpenModal = useCallback((zone) => {
    console.log('Открытие модального окна для зоны:', zone); // Лог для проверки данных зоны
    setSelectedZone(zone);
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedZone(null);
  }, []);

  const getColorByZoneType = useCallback((type) => {
    switch (type) {
      case 'regular':
        return 'blue';
      case 'control':
        return 'green';
      case 'warning':
        return 'orange';
      case 'danger':
        return 'red';
      default:
        return 'black';
    }
  }, []);

  const updatedZones = useMemo(() => {
    const newZones = zones.map(zone => {
      const employees = realTimeData.filter(data => data.zone_id === zone.id).map(data => data.employee);
      return { ...zone, employees };
    });
    console.log('Updated zones with employees:', newZones); // Лог для проверки обновленных данных
    return newZones;
  }, [zones, realTimeData]);

  return (
    <>
      <MapContainer
        center={[500, 500]}
        zoom={2}
        style={{ height: '100vh', width: '100%' }}
        crs={L.CRS.Simple}
      >
        <ImageOverlay
          url={plan}
          bounds={imageBounds}
          opacity={1}
        />
        {updatedZones.map((zone) => (
          <Polygon
            key={zone.id}
            positions={zone.coordinates}
            color={getColorByZoneType(zone.type)}
            fillOpacity={0.5}
            eventHandlers={{
              click: () => {
                handleOpenModal(zone);
              },
            }}
          >
            <Tooltip direction="center" permanent>
              {zone.name}: {zone.employees ? zone.employees.length : 0} сотрудников
            </Tooltip>
            <Popup>
              {zone.name}: {zone.employees ? zone.employees.length : 0} сотрудников
            </Popup>
          </Polygon>
        ))}
        {realTimeData.map((data) => {
          const zone = updatedZones.find(zone => zone.id === data.zone_id);
          if (zone) {
            const beacon = data.beacon_id && zones.find(zone => zone.beacons.includes(data.beacon_id));
            return (
              <Marker
                key={data.employee_id}
                position={beacon && beacon.map_coordinates ? L.latLng(beacon.map_coordinates) : L.latLngBounds(zone.coordinates).getCenter()}
                icon={employeeIcon}
              >
                <Popup>Сотрудник {data.employee} в зоне {zone.name}</Popup>
              </Marker>
            );
          }
          return null;
        })}
      </MapContainer>
      {selectedZone && (
        <ZoneEmployeesModal
          visible={modalVisible}
          onClose={handleCloseModal}
          zone={selectedZone}
        />
      )}
    </>
  );
};

export default LocationMap;
