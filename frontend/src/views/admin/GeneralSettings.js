import React from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';

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
            Настройки системы.
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default GeneralSettings;
