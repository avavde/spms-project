import React from 'react';
import PropTypes from 'prop-types';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react';

const beacons = [
  { id: 1, uuid: 'beacon1', battery: '10%' },
  { id: 2, uuid: 'beacon2', battery: '15%' },
  { id: 3, uuid: 'beacon3', battery: '5%' },
  { id: 4, uuid: 'beacon4', battery: '8%' },
  { id: 5, uuid: 'beacon5', battery: '12%' },
];

const LowBatteryBeaconsModal = ({ visible, onClose }) => {
  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Метки с низким зарядом</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>UUID</CTableHeaderCell>
              <CTableHeaderCell>Уровень заряда</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {beacons.map((beacon) => (
              <CTableRow key={beacon.id}>
                <CTableDataCell>{beacon.id}</CTableDataCell>
                <CTableDataCell>{beacon.uuid}</CTableDataCell>
                <CTableDataCell>{beacon.battery}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Закрыть
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

LowBatteryBeaconsModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LowBatteryBeaconsModal;
