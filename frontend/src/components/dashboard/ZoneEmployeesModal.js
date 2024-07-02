import React from 'react';
import PropTypes from 'prop-types';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react';

const ZoneEmployeesModal = ({ visible, onClose, zone }) => {
  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>{zone ? zone.name : 'Зона'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {zone && zone.employees ? (
          <ul>
            {zone.employees.map((employee) => (
              <li key={employee.id}>{employee.name}</li>
            ))}
          </ul>
        ) : (
          <p>Нет данных о сотрудниках в этой зоне.</p>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>Закрыть</CButton>
      </CModalFooter>
    </CModal>
  );
};

ZoneEmployeesModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  zone: PropTypes.shape({
    name: PropTypes.string,
    employees: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })),
  }),
};

export default ZoneEmployeesModal;
