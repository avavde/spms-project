import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import PropTypes from 'prop-types';
import 'leaflet/dist/leaflet.css';

const gpsIcon = new L.Icon({
  iconUrl: 'path/to/gps-icon.png',
  iconSize: [25, 25],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

const zoneIcon = new L.Icon({
  iconUrl: 'path/to/zone-icon.png',
  iconSize: [25, 25],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

const EmployeeLocation = ({ employeeId, visible, onClose }) => {
  const [locationData, setLocationData] = useState(null);

  useEffect(() => {
    if (employeeId && visible) {
      // Fetch location data for the employee
      fetch(`/api/employee/${employeeId}/location`)
        .then(response => response.json())
        .then(data => setLocationData(data))
        .catch(error => console.error('Error fetching location data:', error));
    }
  }, [employeeId, visible]);

  if (!visible || !locationData) {
    return null;
  }

  const { gps, coordinates, zone, mapUrl } = locationData;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <MapContainer center={coordinates} zoom={15} style={{ height: '400px', width: '100%' }}>
          {gps ? (
            <>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={coordinates} icon={gpsIcon}>
                <Popup>Сотрудник находится здесь</Popup>
              </Marker>
            </>
          ) : (
            <>
              <ImageOverlay url={mapUrl} bounds={[[0, 0], [1000, 1000]]} />
              {zone ? (
                <Marker position={coordinates} icon={zoneIcon}>
                  <Popup>Сотрудник находится в зоне {zone.name}</Popup>
                </Marker>
              ) : (
                <Popup position={coordinates}>Невозможно определить зону нахождения сотрудника</Popup>
              )}
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

EmployeeLocation.propTypes = {
  employeeId: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EmployeeLocation;
