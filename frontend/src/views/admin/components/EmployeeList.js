import React from 'react';
import PropTypes from 'prop-types';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CIcon } from '@coreui/react';
import { cilMap } from '@coreui/icons';

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
              {' '}
              <CButton color="success" size="sm" onClick={() => onShowCurrentZone(employee)}>
                <CIcon icon={cilMap} />
              </CButton>
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  );
};

EmployeeList
