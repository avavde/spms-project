import React from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';

import LocationMap from './LocationMap';

const Monitoring = () => {
  return (
    <CRow>
        <CCol xs="24" lg="12">
        <CCard>
          <CCardHeader>
            Карта местоположений
          </CCardHeader>
          <CCardBody>
            <LocationMap />
          </CCardBody>
        </CCard>
      </CCol>

    </CRow>
  );
};

export default Monitoring;
