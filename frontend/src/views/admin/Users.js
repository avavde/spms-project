import React from 'react';
import { CCol, CRow } from '@coreui/react';

import UserManagement from './components/UserManagement';
import { CContainer } from '@coreui/react';
const Users = () => {
  return (
    <CRow>
      <CCol xs="12">
            <CContainer>
                <UserManagement />
            </CContainer>
      </CCol>
    </CRow>
  );
};

export default Users;
