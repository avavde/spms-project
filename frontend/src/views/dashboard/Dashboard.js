import React from 'react';
import { CRow, CCol, CCard, CCardBody, CCardTitle } from '@coreui/react';
import ActiveEmployees from '../../components/dashboard/ActiveEmployees';
import ActiveBeacons from '../../components/dashboard/ActiveBeacons';
import LowBatteryBeacons from '../../components/dashboard/LowBatteryBeacons';
import EventsToday from '../../components/dashboard/EventsToday';
import EmployeesInDangerZones from '../../components/dashboard/EmployeesInDangerZones';
import LatestEvents from '../../components/dashboard/LatestEvents';
import ZoneReport from '../../components/dashboard/ZoneReport';
import SystemPerformance from '../../components/dashboard/SystemPerformance';
import EmployeeActivityChart from '../../components/dashboard/EmployeeActivityChart';

const Dashboard = () => {
  return (
    <CRow>
      <CCol sm="6" lg="4">
        <ActiveEmployees />
      </CCol>
      <CCol sm="6" lg="4">
        <ActiveBeacons />
      </CCol>
      <CCol sm="6" lg="4">
        <LowBatteryBeacons />
      </CCol>
      <CCol sm="6" lg="4">
        <EventsToday />
      </CCol>
      <CCol sm="6" lg="4">
        <EmployeesInDangerZones />
      </CCol>
      <CCol sm="12" lg="8">
        <CCard className="mb-4">
          <CCardBody>
            <CCardTitle>Последние события</CCardTitle>
            <LatestEvents />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol sm="12" lg="6">
        <CCard className="mb-4">
          <CCardBody>
            <CCardTitle>Отчет по зонам</CCardTitle>
            <ZoneReport />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol sm="12" lg="6">
        <CCard className="mb-4">
          <CCardBody>
            <CCardTitle>Производительность системы</CCardTitle>
            <SystemPerformance />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol sm="12" lg="12">
        <CCard className="mb-4">
          <CCardBody>
            <CCardTitle>График активности сотрудников</CCardTitle>
            <EmployeeActivityChart />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Dashboard;
