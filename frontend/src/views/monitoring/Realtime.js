import React from 'react';
import { CListGroup, CListGroupItem } from '@coreui/react';

const realTimeData = [
  { id: 1, name: 'Сотрудник A', status: 'На рабочем месте' },
  { id: 2, name: 'Сотрудник B', status: 'В зоне A' },
  { id: 3, name: 'Сотрудник C', status: 'В зоне Б' },
];

const Realtime = () => {
  return (
    <CListGroup>
      {realTimeData.map((item) => (
        <CListGroupItem key={item.id}>
          {item.name}: {item.status}
        </CListGroupItem>
      ))}
    </CListGroup>
  );
};

export default Realtime;
