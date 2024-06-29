import React from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow, CAlert, CWidgetStatsA, CWidgetStatsB, CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell } from '@coreui/react';
import { CChartBar } from '@coreui/react-chartjs';

const EquipmentMonitoring = () => {
  const equipmentData = [
    { id: 1, name: 'Мостовой кран 1', status: 'Работает', performance: [90, 85, 80, 95], temperature: 75, pressure: 3.5 },
    { id: 2, name: 'Мостовой кран 2', status: 'На обслуживании', performance: [60, 55, 65, 70], temperature: 65, pressure: 2.8 },
    // дополнительные данные...
  ];

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>Мониторинг критически важных узлов и оборудования</CCardHeader>
          <CCardBody>
            <CRow>
              {equipmentData.map((equip) => (
                <CCol sm="6" lg="6" key={equip.id}>
                  <CWidgetStatsA 
                    className="mb-4"
                    color="primary"
                    value={`${equip.temperature} °C`}
                    title={`Температура - ${equip.name}`}
                    chart={
                      <CChartBar 
                        datasets={[
                          {
                            label: 'Температура',
                            data: [equip.temperature],
                            backgroundColor: 'rgba(255,193,7,0.4)',
                            borderColor: 'rgba(255,193,7,1)',
                            borderWidth: 1,
                          },
                        ]}
                        options={{ aspectRatio: 2 }}
                      />
                    }
                  />
                  <CWidgetStatsA 
                    className="mb-4"
                    color="info"
                    value={`${equip.pressure} Бар`}
                    title={`Давление - ${equip.name}`}
                    chart={
                      <CChartBar 
                        datasets={[
                          {
                            label: 'Давление',
                            data: [equip.pressure],
                            backgroundColor: 'rgba(0,123,255,0.4)',
                            borderColor: 'rgba(0,123,255,1)',
                            borderWidth: 1,
                          },
                        ]}
                        options={{ aspectRatio: 2 }}
                      />
                    }
                  />
                  <CWidgetStatsB
                    className="mb-4"
                    color="danger"
                    inverse
                    value={`${equip.performance[equip.performance.length - 1]}%`}
                    title={`Производительность - ${equip.name}`}
                    progress={{ value: equip.performance[equip.performance.length - 1] }}
                  />
                </CCol>
              ))}
            </CRow>
            <CTable responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Название оборудования</CTableHeaderCell>
                  <CTableHeaderCell>Статус</CTableHeaderCell>
                  <CTableHeaderCell>Последняя проверка</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {equipmentData.map((equip) => (
                  <CTableRow key={equip.id}>
                    <CTableDataCell>{equip.name}</CTableDataCell>
                    <CTableDataCell>{equip.status}</CTableDataCell>
                    <CTableDataCell>{new Date().toLocaleString()}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <CAlert color="danger">Критическое предупреждение: Мостовой кран 2 требует немедленного обслуживания!</CAlert>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default EquipmentMonitoring;
