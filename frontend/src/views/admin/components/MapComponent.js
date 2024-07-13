import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet'; // Добавлен импорт
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import plan from 'src/assets/brand/plan.jpeg';
import beaconIconUrl from 'src/assets/images/ble-beacon.png';

const imageBounds = [[0, 0], [1000, 1000]];
L.drawLocal.draw.handlers.marker.tooltip.start = 'Кликните на карту, чтобы добавить маяк.';

const MapComponent = ({ zones, availableBeacons, onCreateZone, onEditZone, onDeleteZone, onCreateBeacon, onEditBeacon, onDeleteBeacon }) => {
  useEffect(() => {
    const mapInstance = L.map('map', {
      crs: L.CRS.Simple,
    }).setView([500, 500], 2);

    L.imageOverlay(plan, imageBounds).addTo(mapInstance);

    const drawnItems = new L.FeatureGroup();
    mapInstance.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
      },
      draw: {
        polygon: true,
        polyline: false,
        rectangle: true,
        circle: false,
        marker: true,
        circlemarker: false,
      },
    });

    mapInstance.addControl(drawControl);

    mapInstance.on(L.Draw.Event.CREATED, (event) => {
      const layer = event.layer;
      if (event.layerType === 'marker') {
        if (layer.getLatLng) {
          onCreateBeacon(layer.getLatLng());
        }
      } else {
        onCreateZone(layer);
      }
    });

    mapInstance.on('draw:edited', (event) => onEditZone(event.layers));
    mapInstance.on('draw:deleted', (event) => onDeleteZone(event.layers));

    zones.forEach((zone) => {
      const layer = L.polygon(zone.coordinates, {
        color: getColorByZoneType(zone.type),
        fillColor: getColorByZoneType(zone.type),
        fillOpacity: 0.5,
      }).bindPopup(`<b>${zone.name}</b><br>${zone.type || 'Неизвестный тип'}`).addTo(drawnItems);

      layer.on('click', () => onEditZone(layer, zone));
    });

    availableBeacons.forEach((beacon) => {
      if (beacon.map_coordinates) {
        const icon = L.icon({
          iconUrl: beaconIconUrl,
          iconSize: [50, 50],
        });

        const marker = L.marker(beacon.map_coordinates, { icon, draggable: true })
          .on('dragend', (event) => {
            console.log(`Beacon ${beacon.beacon_mac} moved to ${JSON.stringify(event.target.getLatLng())}`);
            onEditBeacon(event.target.getLatLng(), beacon.beacon_mac);
          })
          .on('click', () => {
            if (window.confirm(`Удалить маяк ${beacon.beacon_mac}?`)) {
              onDeleteBeacon(beacon.beacon_mac);
            }
          })
          .addTo(mapInstance)
          .bindPopup(beacon.beacon_mac || 'Неизвестный MAC');
      }
    });

    return () => {
      mapInstance.off();
      mapInstance.remove();
    };
  }, [zones, availableBeacons, onCreateZone, onEditZone, onDeleteZone, onCreateBeacon, onEditBeacon, onDeleteBeacon]);

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

  return <div id="map" style={{ height: '500px', width: '100%' }}></div>;
};

MapComponent.propTypes = {
  zones: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    coordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    type: PropTypes.string,
    beacons: PropTypes.arrayOf(PropTypes.string).isRequired,
  })).isRequired,
  availableBeacons: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    map_coordinates: PropTypes.arrayOf(PropTypes.number),
    beacon_mac: PropTypes.string,
  })).isRequired,
  onCreateZone: PropTypes.func.isRequired,
  onEditZone: PropTypes.func.isRequired,
  onDeleteZone: PropTypes.func.isRequired,
  onCreateBeacon: PropTypes.func.isRequired,
  onEditBeacon: PropTypes.func.isRequired,
  onDeleteBeacon: PropTypes.func.isRequired,
};

export default MapComponent;
