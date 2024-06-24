import React from 'react';
import { CCard, CCardBody, CCardHeader, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import { beaconReports } from '../../data/reportsData';

const BeaconReport = () => {
  return (
    <CCard>
      <CCardHeader>
        Отчет по меткам
      </CCardHeader>
      <CCardBody>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID метки</CTableHeaderCell>
              <CTableHeaderCell>Уровень заряда</CTableHeaderCell>
              <CTableHeaderCell>Состояние</CTableHeaderCell>
              <CTableHeaderCell>Последний сигнал</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {beaconReports.map((report) => (
              <CTableRow key={report.beaconId}>
                <CTableDataCell>{report.beaconId}</CTableDataCell>
                <CTableDataCell>{report.batteryLevel}</CTableDataCell>
                <CTableDataCell>{report.status}</CTableDataCell>
                <CTableDataCell>{report.lastSignal}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );
};

export default BeaconReport;
