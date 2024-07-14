import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react';
import { MapContainer, TileLayer, Marker, Popup, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import locationService from 'src/services/locationService';
import employeeIconUrl from 'src/assets/images/employee.png';
import plan from 'src/assets/brand/plan.jpeg';

const employeeIcon = new L.Icon({
  iconUrl: employeeIconUrl,
  iconSize: [25, 25],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

const EmployeeLocationModal = ({ employeeId, visible, onClose }) => {
  const [locationData, setLocationData] = useState(null);

  useEffect(() => {
    const fetchLocationData = async () => {
      if (employeeId) {
        try {
          const data = await locationService.getLocationData(employeeId);
          setLocationData(data);
        } catch (error) {
          console.error('Error fetching location data:', error);
        }
      }
    };

    fetchLocationData();
  }, [employeeId]);

  const renderMap = () => {
    if (!locationData) {
      return <div>Загрузка данных...</div>;
    }

    const { coordinates, gps, full_name } = locationData;

    if (gps) {
      return (
        <MapContainer center={coordinates} zoom={15} style={{ height: '400px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={coordinates} icon={employeeIcon}>
            <Popup>Сотрудник {full_name}</Popup>
          </Marker>
        </MapContainer>
      );
    } else if (coordinates) {
      const imageBounds = [[0, 0], [1000, 1000]];

      return (
        <MapContainer
          center={[500, 500]}
          zoom={2}
          style={{ height: '400px', width: '100%' }}
          crs={L.CRS.Simple}
        >
          <ImageOverlay
            url={plan}
            bounds={imageBounds}
            opacity={1}
          />
          <Marker position={coordinates} icon={employeeIcon}>
            <Popup>Сотрудник {full_name}</Popup>
          </Marker>
        </MapContainer>
      );
    } else {
      return <div>Невозможно определить местоположение сотрудника.</div>;
    }
  };

  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Геопозиция сотрудника</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {renderMap()}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Закрыть
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

EmployeeLocationModal.propTypes = {
  employeeId: PropTypes.string.isRequired, // Убедимся, что employeeId передается и является обязательным
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EmployeeLocationModal;
