import React from 'react';
import PropTypes from 'prop-types';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CListGroup, CListGroupItem } from '@coreui/react';

const ZoneEmployeesModal = ({ visible, onClose, zone }) => {
  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>{zone.name}: Сотрудники</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CListGroup>
          {zone.employees.map((employee, index) => (
            <CListGroupItem key={index}>{employee}</CListGroupItem>
          ))}
        </CListGroup>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Закрыть
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

ZoneEmployeesModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  zone: PropTypes.object.isRequired,
};

export default ZoneEmployeesModal;
