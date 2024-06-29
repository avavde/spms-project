import React from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CCollapse, CButton } from '@coreui/react';
import { CChartBar, CChartLine, CChartDoughnut } from '@coreui/react-chartjs';

const ReportsERPIntegration = () => {
  const [reportType, setReportType] = React.useState('monthly');
  const [collapse, setCollapse] = React.useState(false);

  const reportData = {
    monthly: [100, 200, 150, 300],
    yearly: [1200, 2400, 1800, 3600],
  };

  const handleDropdownClick = (type) => {
    setReportType(type);
    setCollapse(false);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>Информативные отчеты и интеграция с системами ERP</CCardHeader>
          <CCardBody>
            <CDropdown className="mb-3">
              <CDropdownToggle color="secondary">Выберите тип отчета</CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem onClick={() => handleDropdownClick('monthly')}>Месячный</CDropdownItem>
                <CDropdownItem onClick={() => handleDropdownClick('yearly')}>Годовой</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
            <CRow className="mb-4">
              <CCol sm="4">
                <CChartBar 
                  data={{
                    labels: ['Январь', 'Февраль', 'Март', 'Апрель'],
                    datasets: [{
                      label: 'Производство',
                      backgroundColor: 'rgba(0, 123, 255, 0.5)',
                      borderColor: 'rgba(0, 123, 255, 1)',
                      data: reportData[reportType]
                    }]
                  }}
                  options={chartOptions}
                />
              </CCol>
              <CCol sm="4">
                <CChartLine 
                  data={{
                    labels: ['Январь', 'Февраль', 'Март', 'Апрель'],
                    datasets: [{
                      label: 'Финансы',
                      backgroundColor: 'rgba(40, 167, 69, 0.5)',
                      borderColor: 'rgba(40, 167, 69, 1)',
                      data: reportData[reportType]
                    }]
                  }}
                  options={chartOptions}
                />
              </CCol>
              <CCol sm="4">
                <CChartDoughnut 
                  data={{
                    labels: ['Январь', 'Февраль', 'Март', 'Апрель'],
                    datasets: [{
                      label: 'Ресурсы',
                      backgroundColor: [
                        'rgba(255, 193, 7, 0.5)',
                        'rgba(220, 53, 69, 0.5)',
                        'rgba(0, 123, 255, 0.5)',
                        'rgba(40, 167, 69, 0.5)'
                      ],
                      borderColor: [
                        'rgba(255, 193, 7, 1)',
                        'rgba(220, 53, 69, 1)',
                        'rgba(0, 123, 255, 1)',
                        'rgba(40, 167, 69, 1)'
                      ],
                      data: reportData[reportType]
                    }]
                  }}
                  options={chartOptions}
                />
              </CCol>
            </CRow>
            <CTable responsive className="mt-4">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Поставка</CTableHeaderCell>
                  <CTableHeaderCell>Объем</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {reportData[reportType].map((value, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>Поставка {index + 1}</CTableDataCell>
                    <CTableDataCell>{value}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <CButton color="primary" className="mt-4" onClick={() => setCollapse(!collapse)}>Подробнее</CButton>
            <CCollapse visible={collapse}>
              <CCard className="mt-3">
                <CCardBody>
                  <h5>Дополнительная информация</h5>
                  <p>Здесь можно добавить дополнительную информацию, графики или таблицы, которые будут полезны для анализа данных и принятия решений.</p>
                </CCardBody>
              </CCard>
            </CCollapse>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ReportsERPIntegration;
