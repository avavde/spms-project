import React from 'react';
import PropTypes from 'prop-types';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react';

const events = [
  { id: 1, event: 'Вход в зону A', time: '10:15', type: 'neutral', employee: 'Иванов Иван' },
  { id: 2, event: 'Выход из зоны B', time: '10:20', type: 'information', employee: 'Петров Петр' },
  { id: 3, event: 'Вход в зону C', time: '10:25', type: 'warning', employee: 'Сидоров Сидор' },
  { id: 4, event: 'Выход из зоны D', time: '10:30', type: 'danger', employee: 'Кузнецов Николай' },
  { id: 5, event: 'Вход в зону E', time: '10:35', type: 'neutral', employee: 'Смирнов Алексей' },
  { id: 6, event: 'Вход в зону F', time: '10:40', type: 'neutral', employee: 'Михайлов Михаил' },
  { id: 7, event: 'Выход из зоны G', time: '10:45', type: 'information', employee: 'Федоров Федор' },
  { id: 8, event: 'Вход в зону H', time: '10:50', type: 'warning', employee: 'Васильев Василий' },
  { id: 9, event: 'Выход из зоны I', time: '10:55', type: 'danger', employee: 'Григорьев Григорий' },
  { id: 10, event: 'Вход в зону J', time: '11:00', type: 'neutral', employee: 'Александров Александр' },
];

const getRowColor = (type) => {
  switch (type) {
    case 'information':
      return 'table-info';
    case 'warning':
      return 'table-warning';
    case 'danger':
      return 'table-danger';
    default:
      return '';
  }
};

const EventsTodayModal = ({ visible, onClose }) => {
  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>События за сегодня</CModalTitle>
      </CModalHeader>
      <CModalBody style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Событие</CTableHeaderCell>
              <CTableHeaderCell>Время</CTableHeaderCell>
              <CTableHeaderCell>Сотрудник</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {events.map((event) => (
              <CTableRow key={event.id} className={getRowColor(event.type)}>
                <CTableDataCell>{event.id}</CTableDataCell>
                <CTableDataCell>{event.event}</CTableDataCell>
                <CTableDataCell>{event.time}</CTableDataCell>
                <CTableDataCell>{event.employee}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Закрыть
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

EventsTodayModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EventsTodayModal;
