import React, { useState, useEffect } from 'react';
import { MapContainer, ImageOverlay, Polygon, Popup } from 'react-leaflet';
import L from 'leaflet';
import ZoneEmployeesModal from '../../components/dashboard/ZoneEmployeesModal';
import 'leaflet/dist/leaflet.css';
import plan from 'src/assets/brand/plan.jpg';
import { getAllZones } from 'src/services/zonesService';

const imageBounds = [[0, 0], [1000, 1000]];

const LocationMap = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [zones, setZones] = useState([]);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const zonesData = await getAllZones();
        setZones(zonesData);
      } catch (error) {
        console.error('Ошибка при получении зон:', error);
      }
    };

    fetchZones();
  }, []);

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
        {zones.map((zone) => (
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
              {zone.name}: {zone.employeeCount || 0} сотрудников
            </Popup>
          </Polygon>
        ))}
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
