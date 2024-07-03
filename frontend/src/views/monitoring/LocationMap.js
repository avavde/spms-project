import React, { useState, useEffect } from 'react';
import { MapContainer, ImageOverlay, Polygon, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import ZoneEmployeesModal from '../../components/dashboard/ZoneEmployeesModal';
import 'leaflet/dist/leaflet.css';
import plan from 'src/assets/brand/plan.jpeg';
import employeeIconUrl from 'src/assets/images/employee.png';
import { getAllZones } from 'src/services/zonesService';
import { initWebSocket, closeWebSocket } from 'src/services/webSocketService';

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
  const [realTimeData, setRealTimeData] = useState([]);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const zonesData = await getAllZones();
        setZones(zonesData);
        console.log('Fetched zones:', zonesData);
      } catch (error) {
        console.error('Ошибка при получении зон:', error);
      }
    };

    fetchZones();

    initWebSocket((data) => {
      console.log('Received WebSocket data:', data);
      setRealTimeData((prevData) => {
        const existingIndex = prevData.findIndex(item => item.device_id === data.device_id);
        if (existingIndex !== -1) {
          const newData = [...prevData];
          newData[existingIndex] = data;
          return newData;
        } else {
          return [...prevData, data];
        }
      });
    });

    return () => {
      closeWebSocket();
    };
  }, []);

  useEffect(() => {
    // Обновление зон с учетом реальных данных
    const updatedZones = zones.map(zone => {
      const employees = realTimeData.filter(data => data.zone_id === zone.id).map(data => data.employee);
      return { ...zone, employees };
    });
    setZones(updatedZones);
  }, [realTimeData, zones]);

  const handleOpenModal = (zone) => {
    setSelectedZone(zone);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedZone(null);
  };

  const getColorByZoneType = (type) => {
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
  };

  return (
    <>
      <MapContainer
        center={[500, 500]}
        zoom={2}
        style={{ height: '600px', width: '100%' }}
        crs={L.CRS.Simple}
      >
        <ImageOverlay
          url={plan}
          bounds={imageBounds}
          opacity={1}
        />
        {zones && zones.length > 0 && zones.map((zone) => (
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
            <Popup>
              {zone.name}: {zone.employees ? zone.employees.length : 0} сотрудников
            </Popup>
          </Polygon>
        ))}
        {realTimeData && realTimeData.length > 0 && realTimeData.map((data) => {
          console.log('Processing realTimeData entry:', data);
          const zone = zones.find(zone => zone.id === data.zone_id);
          if (zone) {
            return (
              <Marker
                key={data.device_id}
                position={L.latLngBounds(zone.coordinates).getCenter()}
                icon={employeeIcon}
              >
                <Popup>Сотрудник {data.employee} в зоне {zone.name}</Popup>
              </Marker>
            );
          } else {
            // По умолчанию отображаем на координатах маяка, если зона не найдена
            const beacon = data.beacon_id && zones.find(zone => zone.beacons.includes(data.beacon_id));
            if (beacon && beacon.map_coordinates) {
              return (
                <Marker
                  key={data.device_id}
                  position={L.latLng(beacon.map_coordinates)}
                  icon={employeeIcon}
                >
                  <Popup>Сотрудник {data.employee} рядом с маяком {beacon.beacon_mac}</Popup>
                </Marker>
              );
            }
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
