import React from 'react';
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react';

// Пример данных событий
const events = [
  { id: 1, employee: 'Иванов А. П.', zone: 'Зона B', time: '10:15', type: 'neutral' },
  { id: 2, employee: 'Шатров С. М.', zone: 'Зона C', time: '10:20', type: 'information' },
  { id: 3, employee: 'Горный С. Э.', zone: 'Зона A', time: '10:25', type: 'warning' },
  { id: 4, employee: 'Круглый М. Ю.', zone: 'Зона B', time: '10:30', type: 'danger' },
  { id: 5, employee: 'Поперечный Т.И.', zone: 'Зона C', time: '10:35', type: 'neutral' },
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

const LatestEvents = () => {
  return (
    <CTable>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>Сотрудник</CTableHeaderCell>
          <CTableHeaderCell>Зона</CTableHeaderCell>
          <CTableHeaderCell>Время</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {events.map((event) => (
          <CTableRow key={event.id} className={getRowColor(event.type)}>
            <CTableDataCell>{event.employee}</CTableDataCell>
            <CTableDataCell>{event.zone}</CTableDataCell>
            <CTableDataCell>{event.time}</CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  );
};

export default LatestEvents;
