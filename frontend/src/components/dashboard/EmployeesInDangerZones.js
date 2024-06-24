import React, { useState } from 'react';
import { CWidgetStatsC, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilWarning } from '@coreui/icons';
import EmployeesInDangerZonesModal from './EmployeesInDangerZonesModal';

const EmployeesInDangerZones = () => {
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
          color="danger"
          icon={<CIcon icon={cilWarning} height={36} />}
          value="3"
          title="Сотрудники в опасных зонах"
          footerSlot={
            <CButton color="danger" onClick={handleOpenModal}>
              Подробнее
            </CButton>
          }
        />
      </div>
      <EmployeesInDangerZonesModal visible={modalVisible} onClose={handleCloseModal} />
    </>
  );
};

export default EmployeesInDangerZones;
