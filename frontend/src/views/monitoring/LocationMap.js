import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapContainer, ImageOverlay, Polygon, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import ZoneEmployeesModal from '../../components/dashboard/ZoneEmployeesModal';
import 'leaflet/dist/leaflet.css';
import plan from 'src/assets/brand/plan.jpeg';
import employeeIconUrl from 'src/assets/images/employee.png';
import zonesService from 'src/services/zonesService';
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
        const data = await zonesService.getAllZones();
        console.log('Fetched zones:', data); // Лог для проверки данных
        setZones(data || []);
      } catch (error) {
        console.error('Ошибка при получении зон:', error);
      }
    };
    fetchZones();

    initWebSocket((data) => {
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

  const handleOpenModal = useCallback((zone) => {
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
    return zones.map(zone => {
      const employees = realTimeData.filter(data => data.zone_id === zone.id).map(data => data.employee);
      return { ...zone, employees };
    });
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
            <Popup>
              {zone.name}: {zone.employees ? zone.employees.length : 0} сотрудников
            </Popup>
          </Polygon>
        ))}
        {realTimeData.map((data) => {
          const zone = updatedZones.find(zone => zone.id === data.zone_id);
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
