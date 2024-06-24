import React, { useState } from 'react';
import { CWidgetStatsC, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPeople } from '@coreui/icons';
import ActiveEmployeesModal from './ActiveEmployeesModal';

const ActiveEmployees = () => {
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
          color="primary"
          icon={<CIcon icon={cilPeople} height={36} />}
          value="35"
          title="На смене"
          footerSlot={
            <CButton color="primary" onClick={handleOpenModal}>
              Подробнее
            </CButton>
          }
        />
      </div>
      <ActiveEmployeesModal visible={modalVisible} onClose={handleCloseModal} />
    </>
  );
};

export default ActiveEmployees;
