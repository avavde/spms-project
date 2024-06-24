import React from 'react';
import { CChartBar } from '@coreui/react-chartjs';

const EmployeeActivityChart = () => {
  return (
    <CChartBar
      data={{
        labels: ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
        datasets: [
          {
            label: 'Количество событий',
            backgroundColor: '#f87979',
            data: [40, 20, 12, 39, 10, 40, 39],
          },
        ],
      }}
      labels="Количество событий"
    />
  );
};

export default EmployeeActivityChart;
