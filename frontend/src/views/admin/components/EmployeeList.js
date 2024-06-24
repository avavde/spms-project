// src/views/admin/components/EmployeeList.js

import React from 'react';
import PropTypes from 'prop-types';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton } from '@coreui/react';

const EmployeeList = ({ employees, onEdit, onDelete }) => {
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
            <CTableDataCell>{employee.lastName}</CTableDataCell>
            <CTableDataCell>{employee.firstName}</CTableDataCell>
            <CTableDataCell>{employee.middleName}</CTableDataCell>
            <CTableDataCell>{employee.position}</CTableDataCell>
            <CTableDataCell>{employee.department}</CTableDataCell>
            <CTableDataCell>{employee.phone}</CTableDataCell>
            <CTableDataCell>{employee.deviceId}</CTableDataCell>
            <CTableDataCell>
              <CButton color="primary" size="sm" onClick={() => onEdit(employee)}>Редактировать</CButton>
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
};

export default EmployeeList;
