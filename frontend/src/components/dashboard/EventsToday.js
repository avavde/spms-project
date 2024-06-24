import React, { useState } from 'react';
import { CWidgetStatsC, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilChartPie } from '@coreui/icons';
import EventsTodayModal from './EventsTodayModal';

const EventsToday = () => {
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
          color="success"
          icon={<CIcon icon={cilChartPie} height={36} />}
          value="120"
          title="События за сегодня"
          footerSlot={
            <CButton color="success" onClick={handleOpenModal}>
              Подробнее
            </CButton>
          }
        />
      </div>
      <EventsTodayModal visible={modalVisible} onClose={handleCloseModal} />
    </>
  );
};

export default EventsToday;
