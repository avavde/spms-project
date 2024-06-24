import React, { useState } from 'react';
import { CWidgetStatsC, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBatteryFull } from '@coreui/icons';
import ActiveBeaconsModal from './ActiveBeaconsModal';

const ActiveBeacons = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <div onClick={handleOpenModal} style={{ cursor: 'pointer' }}>
        <CWidgetStatsC
          className="mb-4"
          color="info"
          icon={<CIcon icon={cilBatteryFull} height={36} />}
          value="40"
          title="Активные метки"
          footerSlot={
            <CButton color="info" onClick={handleOpenModal}>
              Подробнее
            </CButton>
          }
        />
      </div>
      <ActiveBeaconsModal visible={modalVisible} onClose={handleCloseModal} />
    </>
  );
};

export default ActiveBeacons;
