import React from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import Realtime from './Realtime';
import LocationMap from './LocationMap';

const Monitoring = () => {
  return (
    <CRow>
        <CCol xs="12" lg="6">
        <CCard>
          <CCardHeader>
            Карта местоположений
          </CCardHeader>
          <CCardBody>
            <LocationMap />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs="12" lg="6">
        <CCard>
          <CCardHeader>
            Реальное время
          </CCardHeader>
          <CCardBody>
            <Realtime />
          </CCardBody>
        </CCard>
      </CCol>

    </CRow>
  );
};

export default Monitoring;
