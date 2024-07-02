import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormSelect,
} from '@coreui/react';

const BeaconFormModal = ({ visible, availableBeacons, onSave, onClose }) => {
  const [selectedBeaconId, setSelectedBeaconId] = useState('');

  const handleSave = () => {
    onSave(selectedBeaconId);
  };

  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Выберите маяк</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CFormSelect
          value={selectedBeaconId}
          onChange={(e) => setSelectedBeaconId(e.target.value)}
        >
          <option value="">Выберите маяк</option>
          {availableBeacons.map((beacon) => (
            <option key={beacon.id} value={beacon.id}>
              {beacon.beacon_mac || 'Неизвестный MAC'}
            </option>
          ))}
        </CFormSelect>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={handleSave}>Сохранить</CButton>
        <CButton color="secondary" onClick={onClose}>Отмена</CButton>
      </CModalFooter>
    </CModal>
  );
};

BeaconFormModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  availableBeacons: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    beacon_mac: PropTypes.string,
  })).isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default BeaconFormModal;
