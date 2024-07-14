import React from 'react';
import { CCol, CRow } from '@coreui/react';
import EmployeeManagement from './components/EmployeeManagement'; // Импортируем компонент EmployeeManagement
import SOSButton from 'src/components/SOSButton';
import CancelSosButton from 'src/components/CancelSosButton';

const Employees = () => {
  return (
    <CRow>
      <CCol xs="12">
            <EmployeeManagement />
            <SOSButton />
            <CancelSosButton />
      </CCol>
    </CRow>
  );
};

export default Employees;
