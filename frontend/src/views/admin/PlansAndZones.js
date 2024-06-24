import React from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import AdminZoneEditor from './AdminZoneEditor';  // Импортируем компонент редактора зон

const PlansAndZones = () => {
  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader>
            Планы и зоны
          </CCardHeader>
          <CCardBody>
            <AdminZoneEditor />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default PlansAndZones;
