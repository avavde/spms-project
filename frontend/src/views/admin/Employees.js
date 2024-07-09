import React from 'react';
import { CCol, CRow } from '@coreui/react';
import EmployeeManagement from './components/EmployeeManagement'; // Импортируем компонент EmployeeManagement

const Employees = () => {
  return (
    <CRow>
      <CCol xs="12">
            <EmployeeManagement />
      </CCol>
    </CRow>
  );
};

export default Employees;
