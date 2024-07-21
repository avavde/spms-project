import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CFormCheck,
} from '@coreui/react';

const ZoneFormModal = ({ visible, zone, availableBeacons, onSave, onDelete, onClose }) => {
  const [zoneName, setZoneName] = useState('');
  const [zoneType, setZoneType] = useState('');
  const [selectedBeacons, setSelectedBeacons] = useState([]);

  useEffect(() => {
    if (zone) {
      setZoneName(zone.name);
      setZoneType(zone.type || '');
      setSelectedBeacons(zone.beacons || []);
    }
  }, [zone]);

  const handleBeaconChange = (beaconId) => {
    setSelectedBeacons((prevSelected) =>
      prevSelected.includes(beaconId)
        ? prevSelected.filter((id) => id !== beaconId)
        : [...prevSelected, beaconId]
    );
  };

  const handleSave = () => {
    const newZone = {
      ...zone,
      name: zoneName,
      type: zoneType,
      beacons: selectedBeacons,
    };
    onSave(newZone);
  };

  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Редактировать зону</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <div className="mb-3">
            <CFormLabel htmlFor="zoneName">Название зоны</CFormLabel>
            <CFormInput id="zoneName" value={zoneName} onChange={(e) => setZoneName(e.target.value)} />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="zoneType">Тип зоны</CFormLabel>
            <CFormSelect id="zoneType" value={zoneType} onChange={(e) => setZoneType(e.target.value)}>
              <option value="regular">Обычная</option>
              <option value="control">Зона контроля</option>
              <option value="warning">Зона предупреждения</option>
              <option value="danger">Опасная зона</option>
            </CFormSelect>
          </div>
          <div className="mb-3">
            <CFormLabel>Маяки</CFormLabel>
            {availableBeacons && availableBeacons.length > 0 ? (
              availableBeacons.map((beacon) => (
                <CFormCheck
                  key={beacon.id}
                  id={`beacon-${beacon.id}`}
                  label={`ID: ${beacon.beacon_mac || 'Неизвестный MAC'}`}
                  checked={selectedBeacons.includes(beacon.id)}
                  onChange={() => handleBeaconChange(beacon.id)}
                />
              ))
            ) : (
              <div>Нет доступных маяков</div>
            )}
          </div>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={handleSave}>Сохранить</CButton>
        <CButton color="danger" onClick={() => onDelete(zone.id)}>Удалить</CButton>
        <CButton color="secondary" onClick={onClose}>Закрыть</CButton>
      </CModalFooter>
    </CModal>
  );
};

ZoneFormModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  zone: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    coordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    type: PropTypes.string,
    beacons: PropTypes.arrayOf(PropTypes.string),
  }),
  availableBeacons: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    map_coordinates: PropTypes.arrayOf(PropTypes.number),
    beacon_mac: PropTypes.string,
  })).isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ZoneFormModal;
