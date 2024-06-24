import React from 'react';
import { CCard, CCardBody, CCardHeader, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import { zoneReports } from '../../data/reportsData';

const ZoneReport = () => {
  return (
    <CCard>
      <CCardHeader>
        Отчет по зонам
      </CCardHeader>
      <CCardBody>
        {zoneReports.map((report) => (
          <div key={report.zone}>
            <h5>{report.zone}</h5>
            <p>Количество сотрудников: {report.employeeCount}</p>
            <p>Общее время пребывания: {report.totalDuration}</p>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Сотрудник</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {report.employees.map((employee, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{employee}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </div>
        ))}
      </CCardBody>
    </CCard>
  );
};

export default ZoneReport;
