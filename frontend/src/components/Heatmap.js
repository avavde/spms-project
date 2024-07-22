import React, { useEffect, useState } from 'react';
import { MapContainer, ImageOverlay, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import 'leaflet/dist/leaflet.css';
import plan from 'src/assets/brand/plan.jpg';
import zonesService from 'src/services/zonesService';
import employeeService from 'src/services/employeeService';

const imageBounds = [[0, 0], [1000, 1000]];

const HeatmapLayer = ({ movements }) => {
  const map = useMap();
  const [zoneCoordinates, setZoneCoordinates] = useState({});

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const zones = await zonesService.getAllZones();
        const positions = {};
        zones.forEach(zone => {
          positions[zone.name] = zone.map_coordinates;
        });
        setZoneCoordinates(positions);
      } catch (error) {
        console.error('Ошибка при получении зон:', error);
      }
    };

    fetchZones();
  }, []);

  useEffect(() => {
    if (Object.keys(zoneCoordinates).length > 0) {
      const heatData = movements.map(movement => {
        const { zoneName, duration } = movement;
        const coordinates = zoneCoordinates[zoneName];
        return [...coordinates, duration];
      });

      const heat = L.heatLayer(heatData, { radius: 25, blur: 15 }).addTo(map);

      return () => {
        map.removeLayer(heat);
      };
    }
  }, [movements, map, zoneCoordinates]);

  return null;
};

const Heatmap = ({ employeeId, startDate, endDate }) => {
  const [movements, setMovements] = useState([]);

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const data = await employeeService.getEmployeeMovements(employeeId, startDate, endDate);
        setMovements(data);
      } catch (error) {
        console.error('Ошибка при получении перемещений сотрудника:', error);
      }
    };

    fetchMovements();
  }, [employeeId, startDate, endDate]);

  return (
    <MapContainer center={[500, 500]} zoom={2} style={{ height: '100vh', width: '100%' }} crs={L.CRS.Simple}>
      <ImageOverlay url={plan} bounds={imageBounds} opacity={1} />
      <HeatmapLayer movements={movements} />
    </MapContainer>
  );
};

export default Heatmap;
