import React, { useEffect, useState } from 'react';
import deviceService from '../services/deviceService';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash } from '@coreui/icons';

const DeviceList = () => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await deviceService.getAllDevices();
      setDevices(response.data);
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deviceService.deleteDevice(id);
      fetchDevices();
    } catch (error) {
      console.error('Error deleting device:', error);
    }
  };

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>
            <strong>Device List</strong>
          </CCardHeader>
          <CCardBody>
            <CTable hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>FW Version</CTableHeaderCell>
                  <CTableHeaderCell>NFC UID</CTableHeaderCell>
                  <CTableHeaderCell>IMEI</CTableHeaderCell>
                  <CTableHeaderCell>MAC UWB</CTableHeaderCell>
                  <CTableHeaderCell>IP</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {devices.map((device) => (
                  <CTableRow key={device.id}>
                    <CTableDataCell>{device.id}</CTableDataCell>
                    <CTableDataCell>{device.name}</CTableDataCell>
                    <CTableDataCell>{device.fw_version}</CTableDataCell>
                    <CTableDataCell>{device.nfc_uid}</CTableDataCell>
                    <CTableDataCell>{device.imei}</CTableDataCell>
                    <CTableDataCell>{device.mac_uwb}</CTableDataCell>
                    <CTableDataCell>{device.ip}</CTableDataCell>
                    <CTableDataCell>
                      <CButton color="primary" variant="outline" size="sm">
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton
                        color="danger"
                        variant="outline"
                        size="sm"
                        className="ml-2"
                        onClick={() => handleDelete(device.id)}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default DeviceList;
