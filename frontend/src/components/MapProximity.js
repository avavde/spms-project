// src/components/MapProximity.js
import React from 'react';
import PropTypes from 'prop-types';
import { MapContainer, ImageOverlay, Circle, Rectangle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Добавляем этот импорт

import planSvg from '../assets/plan.svg'; // путь к SVG файлу

const MapProximity = ({ tags, dangerZones }) => {
  const mapWidth = 12; // ширина карты в метрах
  const mapHeight = 30; // высота карты в метрах
  const bounds = [[0, 0], [mapHeight, mapWidth]]; // границы карты

  const dangerZoneColors = {
    danger: 'red',
    warning: 'orange'
  };

  return (
    <MapContainer center={[mapHeight / 2, mapWidth / 2]} zoom={1} style={{ height: '100vh', width: '100%' }} crs={L.CRS.Simple} maxBounds={bounds} maxBoundsViscosity={1.0}>
      <ImageOverlay
        url={planSvg}
        bounds={bounds}
      />
      {tags.map(tag => (
        <Circle
          key={tag.id}
          center={[mapHeight - tag.coordinates.y, tag.coordinates.x]}
          radius={tag.id === '8' ? 0.25 : 0.25} // 0.5 метра в радиусе
          pathOptions={{ color: tag.id === '8' ? 'red' : 'green' }}
        />
      ))}
      {dangerZones.map(zone => (
        <Rectangle
          key={zone.id}
          bounds={[
            [mapHeight - zone.coordinates.y, zone.coordinates.x],
            [mapHeight - (zone.coordinates.y + zone.height), zone.coordinates.x + zone.width]
          ]}
          pathOptions={{ color: dangerZoneColors[zone.type], fillOpacity: 0.5 }}
        />
      ))}
    </MapContainer>
  );
};

MapProximity.propTypes = {
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      coordinates: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        z: PropTypes.number.isRequired
      }).isRequired
    })
  ).isRequired,
  dangerZones: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      coordinates: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired
      }).isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired
    })
  ).isRequired
};

export default MapProximity;
