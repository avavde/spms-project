import React, { useState } from 'react';
import { CWidgetStatsC, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilWarning } from '@coreui/icons';
import LowBatteryBeaconsModal from './LowBatteryBeaconsModal';

const LowBatteryBeacons = () => {
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
          color="warning"
          icon={<CIcon icon={cilWarning} height={36} />}
          value="5"
          title="Метки с низким зарядом"
          footerSlot={
            <CButton color="warning" onClick={handleOpenModal}>
              Подробнее
            </CButton>
          }
        />
      </div>
      <LowBatteryBeaconsModal visible={modalVisible} onClose={handleCloseModal} />
    </>
  );
};

export default LowBatteryBeacons;
