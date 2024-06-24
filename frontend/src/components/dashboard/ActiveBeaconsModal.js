import React from 'react';
import PropTypes from 'prop-types';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react';

const beacons = [
  { id: 1, uuid: 'beacon1', status: 'Активен' },
  { id: 2, uuid: 'beacon2', status: 'Активен' },
  { id: 3, uuid: 'beacon3', status: 'Активен' },
  { id: 4, uuid: 'beacon4', status: 'Активен' },
  { id: 5, uuid: 'beacon5', status: 'Активен' },
];

const ActiveBeaconsModal = ({ visible, onClose }) => {
  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Активные метки</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>UUID</CTableHeaderCell>
              <CTableHeaderCell>Статус</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {beacons.map((beacon) => (
              <CTableRow key={beacon.id}>
                <CTableDataCell>{beacon.id}</CTableDataCell>
                <CTableDataCell>{beacon.uuid}</CTableDataCell>
                <CTableDataCell>{beacon.status}</CTableDataCell>
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

ActiveBeaconsModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ActiveBeaconsModal;
