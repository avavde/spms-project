import React from 'react';
import PropTypes from 'prop-types';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react';

const employees = [
  { id: 1, name: 'Сотрудник A', zone: 'Опасная зона 1' },
  { id: 2, name: 'Сотрудник B', zone: 'Опасная зона 2' },
  { id: 3, name: 'Сотрудник C', zone: 'Опасная зона 3' },
];

const EmployeesInDangerZonesModal = ({ visible, onClose }) => {
  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Сотрудники в опасных зонах</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Имя</CTableHeaderCell>
              <CTableHeaderCell>Зона</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {employees.map((employee) => (
              <CTableRow key={employee.id}>
                <CTableDataCell>{employee.id}</CTableDataCell>
                <CTableDataCell>{employee.name}</CTableDataCell>
                <CTableDataCell>{employee.zone}</CTableDataCell>
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

EmployeesInDangerZonesModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EmployeesInDangerZonesModal;
