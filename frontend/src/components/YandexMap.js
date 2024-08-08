import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const YandexMap = () => {
  return (
    <MapContainer
      center={[55.341244, 85.998423]} // Coordinates for Moscow, Russia
      zoom={10}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution='&copy; <a href="https://www.esri.com/en-us/home">Esri</a>'
      />
    </MapContainer>
  );
};

export default YandexMap;
