import React from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import EmployeeManagement from './components/EmployeeManagement'; // Импортируем компонент EmployeeManagement

const Employees = () => {
  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader>
            Сотрудники
          </CCardHeader>
          <CCardBody>
            <EmployeeManagement />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Employees;
