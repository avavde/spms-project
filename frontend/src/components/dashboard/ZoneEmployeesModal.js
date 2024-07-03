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
          <>
            <p>Количество сотрудников: {zone.employees.length}</p>
            <ul>
              {zone.employees.map((employee, index) => (
                <li key={index}>{employee}</li>
              ))}
            </ul>
          </>
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
    employees: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default ZoneEmployeesModal;
