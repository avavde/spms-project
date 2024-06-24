import React from 'react';
import { CCard, CCardBody, CCardHeader, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import { employeeReports } from '../../data/reportsData';

const EmployeeReport = () => {
  return (
    <CCard>
      <CCardHeader>
        Отчет по сотрудникам
      </CCardHeader>
      <CCardBody>
        {employeeReports.map((report) => (
          <div key={report.employeeId}>
            <h5>{report.name}</h5>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Зона</CTableHeaderCell>
                  <CTableHeaderCell>Время входа</CTableHeaderCell>
                  <CTableHeaderCell>Время выхода</CTableHeaderCell>
                  <CTableHeaderCell>Продолжительность</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {report.movements.map((movement, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{movement.zone}</CTableDataCell>
                    <CTableDataCell>{movement.enterTime}</CTableDataCell>
                    <CTableDataCell>{movement.exitTime}</CTableDataCell>
                    <CTableDataCell>{movement.duration}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <p>Посещения опасных зон: {report.dangerZoneVisits}</p>
          </div>
        ))}
      </CCardBody>
    </CCard>
  );
};

export default EmployeeReport;
