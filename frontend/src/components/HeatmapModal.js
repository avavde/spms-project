import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton
} from '@coreui/react';
import L from 'leaflet';
import 'leaflet.heat';
import zonesService from 'src/services/zonesService';

const HeatmapLayer = ({ heatmapData, map }) => {
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
    if (Object.keys(zoneCoordinates).length > 0 && heatmapData) {
      const heatData = Object.keys(heatmapData).map(zoneName => {
        const { totalDuration } = heatmapData[zoneName];
        const coordinates = zoneCoordinates[zoneName];
        return [...coordinates, totalDuration];
      });

      const heat = L.heatLayer(heatData, { radius: 25, blur: 15 }).addTo(map);

      return () => {
        map.removeLayer(heat);
      };
    }
  }, [heatmapData, map, zoneCoordinates]);

  return null;
};

HeatmapLayer.propTypes = {
  heatmapData: PropTypes.object.isRequired,
  map: PropTypes.object.isRequired
};

const HeatmapModal = ({ visible, onClose, heatmapData }) => {
  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>Тепловая карта сотрудника</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <MapContainer center={[500, 500]} zoom={2} style={{ height: '100vh', width: '100%' }} crs={L.CRS.Simple}>
          <ImageOverlay url={plan} bounds={imageBounds} opacity={1} />
          <HeatmapLayer heatmapData={heatmapData} />
        </MapContainer>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>Закрыть</CButton>
      </CModalFooter>
    </CModal>
  );
};

HeatmapModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  heatmapData: PropTypes.object.isRequired
};

export default HeatmapModal;
