import React from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow,  CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell, CAlert, CWidgetStatsB } from '@coreui/react';

const EvacuationOrganization = () => {
  const evacuationData = {
    totalPeople: 51,
    evacuated: 50,
    inDangerZone: 1,
    fallSensor: 'Работает'
  };

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>Организация эвакуации</CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm="6" lg="3">
                <CWidgetStatsB
                  color="info"
                  inverse
                  header={`${evacuationData.totalPeople}`}
                  text="Всего на смене"
                />
              </CCol>
              <CCol sm="6" lg="3">
                <CWidgetStatsB
                  color="success"
                  inverse
                  header={`${evacuationData.evacuated}`}
                  text="Покинули зону"
                  progress={{ value: (evacuationData.evacuated / evacuationData.totalPeople) * 100 }}
                />
              </CCol>
              <CCol sm="6" lg="3">
                <CWidgetStatsB
                  color="danger"
                  inverse
                  header={`${evacuationData.inDangerZone}`}
                  text="В опасной зоне"
                  progress={{ value: (evacuationData.inDangerZone / evacuationData.totalPeople) * 100 }}
                />
              </CCol>
              <CCol sm="6" lg="3">
                <CWidgetStatsB
                  color="warning"
                  inverse
                  header={evacuationData.fallSensor}
                  text="Датчик падения"
                />
              </CCol>
            </CRow>
            <CTable responsive className="mt-4">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Описание</CTableHeaderCell>
                  <CTableHeaderCell>Значение</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow>
                  <CTableDataCell>Всего на смене</CTableDataCell>
                  <CTableDataCell>{evacuationData.totalPeople}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell>Покинули зону</CTableDataCell>
                  <CTableDataCell>{evacuationData.evacuated}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell>В опасной зоне</CTableDataCell>
                  <CTableDataCell>{evacuationData.inDangerZone}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell>Датчик падения</CTableDataCell>
                  <CTableDataCell>{evacuationData.fallSensor}</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
            {evacuationData.inDangerZone > 0 && (
              <CAlert color="danger" className="mt-4">Внимание: {evacuationData.inDangerZone} человек(а) в опасной зоне!</CAlert>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default EvacuationOrganization;
