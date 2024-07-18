import React from 'react';
import { CCard, CContainer, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import DeviceList from 'src/components/DeviceList';
import BuildingManager from 'src/components/BuildingManager';

const GeneralSettings = () => {
  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader>
            Общие настройки
          </CCardHeader>
          <CCardBody>
            <CContainer>
              <DeviceList />
              <BuildingManager />
            </CContainer>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default GeneralSettings;
