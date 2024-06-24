import React from 'react';
import { CCol, CRow } from '@coreui/react';
import EmployeeReport from '../../components/reports/EmployeeReport';
import BeaconReport from '../../components/reports/BeaconReport';
import ZoneReport from '../../components/reports/ZoneReport';
import EventReport from '../../components/reports/EventReport';

const Reports = () => {
  return (
    <CRow>
      <CCol xs="12" lg="6">
        <EmployeeReport />
      </CCol>
      <CCol xs="12" lg="6">
        <BeaconReport />
      </CCol>
      <CCol xs="12" lg="6">
        <ZoneReport />
      </CCol>
      <CCol xs="12" lg="6">
        <EventReport />
      </CCol>
    </CRow>
  );
};

export default Reports;
