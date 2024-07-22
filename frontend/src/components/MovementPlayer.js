import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, ImageOverlay, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import plan from 'src/assets/brand/plan.jpg';
import employeeIconUrl from 'src/assets/images/employee.png';

const imageBounds = [[0, 0], [1000, 1000]];

const employeeIcon = new L.Icon({
  iconUrl: employeeIconUrl,
  iconSize: [25, 25],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

const MovementPlayer = ({ movements }) => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const movementIndex = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (movementIndex.current < movements.length) {
        const movement = movements[movementIndex.current];
        setCurrentPosition(movement.zoneName);
        movementIndex.current += 1;
      }
    }, 1000); // интервал в 1 секунду, можно изменить по необходимости

    return () => clearInterval(interval);
  }, [movements]);

  const getZoneCoordinates = (zoneName) => {
    // Эта функция должна возвращать координаты зоны по её имени
    // Пример:
    const zones = {
      'Table-296': [200, 200],
      'Table-708': [300, 300],
      'Vector-25-41': [400, 400],
      'Master': [500, 500],
      'Talbe-720': [600, 600]
    };
    return zones[zoneName];
  };

  return (
    <MapContainer center={[500, 500]} zoom={2} style={{ height: '100vh', width: '100%' }} crs={L.CRS.Simple}>
      <ImageOverlay url={plan} bounds={imageBounds} opacity={1} />
      {currentPosition && (
        <Marker position={getZoneCoordinates(currentPosition)} icon={employeeIcon}>
          <Popup>Текущая зона: {currentPosition}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MovementPlayer;
