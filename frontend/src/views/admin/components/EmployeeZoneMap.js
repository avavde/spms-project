// frontend/src/components/EmployeeZoneMap.js

import React from 'react';
import PropTypes from 'prop-types';
import { CModal, CModalHeader, CModalBody, CModalTitle } from '@coreui/react';

const EmployeeZoneMap = ({ isOpen, onClose, employee }) => {
  return (
    <CModal visible={isOpen} onClose={onClose}>
      <CModalHeader onClose={onClose}>
        <CModalTitle>Местоположение сотрудника {employee.first_name} {employee.last_name}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {/* Здесь идет логика отображения карты и зоны */}
        <div>Карта с зоной сотрудника {employee.first_name} {employee.last_name}</div>
      </CModalBody>
    </CModal>
  );
};

EmployeeZoneMap.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  employee: PropTypes.object.isRequired,
};

export default EmployeeZoneMap;
