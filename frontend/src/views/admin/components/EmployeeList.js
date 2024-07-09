import React from 'react';
import PropTypes from 'prop-types';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton } from '@coreui/react';

const EmployeeList = ({ employees, onEdit, onDelete, onShowCurrentZone }) => {
  return (
    <CTable hover responsive>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>Фамилия</CTableHeaderCell>
          <CTableHeaderCell>Имя</CTableHeaderCell>
          <CTableHeaderCell>Отчество</CTableHeaderCell>
          <CTableHeaderCell>Должность</CTableHeaderCell>
          <CTableHeaderCell>Структурное подразделение</CTableHeaderCell>
          <CTableHeaderCell>Телефон</CTableHeaderCell>
          <CTableHeaderCell>Устройство</CTableHeaderCell>
          <CTableHeaderCell>Действия</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {employees.map((employee) => (
          <CTableRow key={employee.id}>
            <CTableDataCell>{employee.last_name}</CTableDataCell>
            <CTableDataCell>{employee.first_name}</CTableDataCell>
            <CTableDataCell>{employee.middle_name}</CTableDataCell>
            <CTableDataCell>{employee.position}</CTableDataCell>
            <CTableDataCell>{employee.department_id}</CTableDataCell>
            <CTableDataCell>{employee.phone}</CTableDataCell>
            <CTableDataCell>{employee.beaconid}</CTableDataCell>
            <CTableDataCell>
              <CButton color="primary" size="sm" onClick={() => onEdit(employee)}>Редактировать</CButton>
              {' '}
              <CButton color="info" size="sm" onClick={() => onShowCurrentZone(employee)}>Показать зону</CButton>
              {' '}
              <CButton color="danger" size="sm" onClick={() => onDelete(employee.id)}>Удалить</CButton>
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  );
};

EmployeeList.propTypes = {
  employees: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onShowCurrentZone: PropTypes.func.isRequired,
};

export default EmployeeList;
