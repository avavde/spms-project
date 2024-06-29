import React from 'react';
import { CCard, CContainer, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import DeviceList from 'src/components/DeviceList';

const GeneralSettings = () => {
  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader>
            Общие настройки
          </CCardHeader>
          <CCardBody>
            {/* Добавьте функционал для общих настроек */}
            <CContainer>
      <DeviceList />
    </CContainer>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default GeneralSettings;
