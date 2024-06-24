import React, { useState } from 'react';
import { MapContainer, ImageOverlay, Polygon, Popup } from 'react-leaflet';
import L from 'leaflet';
import { zones } from '../../data/zonesData';
import ZoneEmployeesModal from '../../components/dashboard/ZoneEmployeesModal';
import 'leaflet/dist/leaflet.css';
import plan from 'src/assets/brand/plan.jpg';  // Импортируем изображение плана помещения

const imageBounds = [[0, 0], [1000, 1000]]; // Пример координат для изображения

const LocationMap = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);

  const handleOpenModal = (zone) => {
    setSelectedZone(zone);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedZone(null);
  };

  return (
    <>
      <MapContainer
        center={[500, 500]} // Центр изображения
        zoom={2} // Настроим масштаб
        style={{ height: '600px', width: '100%' }}
        crs={L.CRS.Simple} // Используем простую систему координат
      >
        <ImageOverlay
          url={plan}  // Используем изображение плана помещения
          bounds={imageBounds}
          opacity={1}
        />
        {zones.map((zone) => (
          <Polygon
            key={zone.id}
            positions={zone.coordinates}
            color="blue"
            fillOpacity={0.5}
            eventHandlers={{
              click: () => {
                handleOpenModal(zone);
              },
            }}
          >
            <Popup>
              {zone.name}: {zone.employeeCount} сотрудников
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
