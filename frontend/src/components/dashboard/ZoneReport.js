import React, { useState } from 'react';
import { CListGroup, CListGroupItem, CButton } from '@coreui/react';
import ZoneEmployeesModal from './ZoneEmployeesModal';
import { zones } from '../../data/zonesData';

const ZoneReport = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);

  const handleOpenModal = (zone) => {
    setSelectedZone(zone);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedZone(null);
  };

  return (
    <>
      <CListGroup>
        {zones.map((zone) => (
          <CListGroupItem key={zone.id}>
            <CButton color="link" onClick={() => handleOpenModal(zone)}>
              {zone.name}: {zone.employeeCount} сотрудников
            </CButton>
          </CListGroupItem>
        ))}
      </CListGroup>
      {selectedZone && (
        <ZoneEmployeesModal
          visible={modalVisible}
          onClose={handleCloseModal}
          zone={selectedZone}
        />
      )}
    </>
  );
};

export default ZoneReport;
