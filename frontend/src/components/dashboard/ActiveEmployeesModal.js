import React from 'react';
import PropTypes from 'prop-types';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react';

const employees = [
  { id: 1, name: 'Сотрудник A', department: 'Отдел 1' },
  { id: 2, name: 'Сотрудник B', department: 'Отдел 2' },
  { id: 3, name: 'Сотрудник C', department: 'Отдел 3' },
  { id: 4, name: 'Сотрудник D', department: 'Отдел 4' },
  { id: 5, name: 'Сотрудник E', department: 'Отдел 5' },
];

const ActiveEmployeesModal = ({ visible, onClose }) => {
  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Сотрудники на смене</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Имя</CTableHeaderCell>
              <CTableHeaderCell>Отдел</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {employees.map((employee) => (
              <CTableRow key={employee.id}>
                <CTableDataCell>{employee.id}</CTableDataCell>
                <CTableDataCell>{employee.name}</CTableDataCell>
                <CTableDataCell>{employee.department}</CTableDataCell>
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

ActiveEmployeesModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ActiveEmployeesModal;
