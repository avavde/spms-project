import React from 'react';
import { CCard, CCardBody, CCardHeader, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import { eventReports } from '../../data/reportsData';

const EventReport = () => {
  return (
    <CCard>
      <CCardHeader>
        События и инциденты
      </CCardHeader>
      <CCardBody>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID события</CTableHeaderCell>
              <CTableHeaderCell>Тип события</CTableHeaderCell>
              <CTableHeaderCell>Время</CTableHeaderCell>
              <CTableHeaderCell>Зона</CTableHeaderCell>
              <CTableHeaderCell>Описание</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {eventReports.map((report) => (
              <CTableRow key={report.eventId}>
                <CTableDataCell>{report.eventId}</CTableDataCell>
                <CTableDataCell>{report.type}</CTableDataCell>
                <CTableDataCell>{report.time}</CTableDataCell>
                <CTableDataCell>{report.zone}</CTableDataCell>
                <CTableDataCell>{report.description}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );
};

export default EventReport;
