
// src/components/EmployeeLocationModal.js
import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CListGroup,
  CListGroupItem,
  CBadge,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner
} from '@coreui/react';
import { MapContainer, TileLayer, Marker, Popup, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import locationService from '../services/locationService';
import employeeService from '../services/employeeService';
import { useWebSocket } from '../context/WebSocketContext';
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
  const [deviceStatus, setDeviceStatus] = useState(null);
  const [zones, setZones] = useState({ working: [], allowed: [], forbidden: [] });
  const [filteredMessages, setFilteredMessages] = useState([]);
  const messages = useWebSocket();

  const fetchEmployeeData = useCallback(async () => {
    try {
      const employee = await employeeService.getEmployeeById(employeeId);
      const beaconId = employee.data.beaconid;

      const [location, status, zoneAssignments] = await Promise.all([
        locationService.getLocationData(employeeId),
        employeeService.getDeviceStatus(beaconId),
        employeeService.getZoneAssignments(employeeId)
      ]);

      setLocationData(location);
      setDeviceStatus(status);
      setZones({
        working: zoneAssignments.filter(assignment => assignment.assignment_type === 'working').map(zone => zone.Zone),
        allowed: zoneAssignments.filter(assignment => assignment.assignment_type === 'allowed').map(zone => zone.Zone),
        forbidden: zoneAssignments.filter(assignment => assignment.assignment_type === 'forbidden').map(zone => zone.Zone)
      });
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  }, [employeeId]);

  useEffect(() => {
    if (visible) {
      fetchEmployeeData();
    }
  }, [employeeId, fetchEmployeeData, visible]);

  useEffect(() => {
    const employeeMessages = messages.filter(msg => msg.data && msg.data.employee_id === employeeId);
    setFilteredMessages(employeeMessages.slice(0, 10));
  }, [messages, employeeId]);

  const renderMap = () => {
    if (!locationData) {
      return <CSpinner />;
    }

    const { coordinates, gps, full_name, position, department } = locationData;
    const employeeInfo = (
      <div>
        <p><strong>ФИО:</strong> {full_name}</p>
        {position && <p><strong>Должность:</strong> {position}</p>}
        {department && <p><strong>Департамент:</strong> {department}</p>}
      </div>
    );

    if (gps) {
      return (
        <div>
          {employeeInfo}
          <MapContainer center={coordinates} zoom={15} style={{ height: '400px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={coordinates} icon={employeeIcon}>
              <Popup>Сотрудник {full_name}</Popup>
            </Marker>
          </MapContainer>
        </div>
      );
    } else if (coordinates) {
      const imageBounds = [[0, 0], [1000, 1000]];

      return (
        <div>
          {employeeInfo}
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
        </div>
      );
    } else {
      return <div>Невозможно определить местоположение сотрудника.</div>;
    }
  };

  const renderDeviceStatus = () => {
    if (!deviceStatus) return null;

    return (
      <CCard>
        <CCardHeader>
          Статус устройства
        </CCardHeader>
        <CCardBody>
          <p><strong>Идентификатор устройства:</strong> {deviceStatus.deviceId}</p>
          <p><strong>Заряд батареи:</strong> {deviceStatus.batteryLevel}%</p>
        </CCardBody>
      </CCard>
    );
  };

  const renderZones = () => {
    const { working, allowed, forbidden } = zones;
    return (
      <CCard>
        <CCardHeader>
          Зоны доступа
        </CCardHeader>
        <CCardBody>
          <h6>Рабочие зоны</h6>
          <CListGroup>
            {working.length > 0 ? (
              working.map((zone, index) => (
                <CListGroupItem key={index}>{zone.name}</CListGroupItem>
              ))
            ) : (
              <CListGroupItem>Зоны не назначены</CListGroupItem>
            )}
          </CListGroup>
          <h6 className="mt-3">Разрешенные зоны</h6>
          <CListGroup>
            {allowed.length > 0 ? (
              allowed.map((zone, index) => (
                <CListGroupItem key={index}>{zone.name}</CListGroupItem>
              ))
            ) : (
              <CListGroupItem>Зоны не назначены</CListGroupItem>
            )}
          </CListGroup>
          <h6 className="mt-3">Запрещенные зоны</h6>
          <CListGroup>
            {forbidden.length > 0 ? (
              forbidden.map((zone, index) => (
                <CListGroupItem key={index}>{zone.name}</CListGroupItem>
              ))
            ) : (
              <CListGroupItem>Зоны не назначены</CListGroupItem>
            )}
          </CListGroup>
        </CCardBody>
      </CCard>
    );
  };

  const renderMessages = () => {
    return (
      <CCard>
        <CCardHeader>
          Последние сообщения
        </CCardHeader>
        <CCardBody>
          <CListGroup>
            {filteredMessages.length > 0 ? (
              filteredMessages.map((msg, index) => (
                <CListGroupItem key={index}>
                  <CBadge color="info" className="me-2">{new Date(msg.timestamp).toLocaleString()}</CBadge>
                  {msg.message}
                </CListGroupItem>
              ))
            ) : (
              <CListGroupItem>Нет сообщений</CListGroupItem>
            )}
          </CListGroup>
        </CCardBody>
      </CCard>
    );
  };

  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>Геопозиция сотрудника</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow>
          <CCol xs={12} md={6}>
            {renderMap()}
          </CCol>
          <CCol xs={12} md={6}>
            {renderDeviceStatus()}
            {renderZones()}
            {renderMessages()}
          </CCol>
        </CRow>
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
  employeeId: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EmployeeLocationModal;
