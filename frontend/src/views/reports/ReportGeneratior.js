import React, { useState, useEffect } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilWalk, cilFire, cilMediaPlay } from '@coreui/icons';

import reportService from 'src/services/reportService';
import employeeService from 'src/services/employeeService';
import SpaghettiDiagramModal from 'src/components/SpaghettiDiagramModal';
import HeatmapModal from 'src/components/HeatmapModal';

const ReportGenerator = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reports, setReports] = useState([]);
  const [movements, setMovements] = useState([]);
  const [showDiagram, setShowDiagram] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await employeeService.getAllEmployees();
        setEmployees(response.data);
      } catch (error) {
        console.error('Ошибка при получении сотрудников:', error);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await reportService.getReports();
        setReports(response);
      } catch (error) {
        console.error('Ошибка при получении списка отчетов:', error);
      }
    };
    fetchReports();
  }, []);

  const handleGenerateReport = async () => {
    try {
      const { summaryLink, detailLink } = await reportService.generateReport(selectedEmployees, startDate, endDate);
      setReports([...reports,
        { link: summaryLink, created_at: new Date().toISOString(), report_type: 'employee_resume', parameters: JSON.stringify({ employeeId: selectedEmployees, startDate, endDate }) },
        { link: detailLink, created_at: new Date().toISOString(), report_type: 'employee_zone_movements', parameters: JSON.stringify({ employeeId: selectedEmployees, startDate, endDate }) }
      ]);
    } catch (error) {
      console.error('Ошибка при формировании отчета:', error);
    }
  };

  const handleGenerateEnterpriseSummary = async () => {
    try {
      const { link } = await reportService.generateEnterpriseSummary(startDate, endDate);
      setReports([...reports, { link, created_at: new Date().toISOString(), report_type: 'enterprise', parameters: JSON.stringify({ startDate, endDate }) }]);
    } catch (error) {
      console.error('Ошибка при формировании сводного отчета:', error);
    }
  };

  const handleSelectEmployee = (employeeId) => {
    setSelectedEmployees(prevSelected =>
      prevSelected.includes(employeeId)
        ? prevSelected.filter(id => id !== employeeId)
        : [...prevSelected, employeeId]
    );
  };

  const handleViewMovements = async (employeeId) => {
    try {
      const response = await employeeService.getEmployeeMovements(employeeId, startDate, endDate);
      setMovements(response.data);
      setShowDiagram(true);
    } catch (error) {
      console.error('Ошибка при получении перемещений сотрудника:', error);
    }
  };

  const handleViewHeatmap = async (employeeId) => {
    try {
      const response = await employeeService.getHeatmapData(employeeId, startDate, endDate);
      setMovements(response.data);
      setShowHeatmap(true);
    } catch (error) {
      console.error('Ошибка при получении данных для тепловой карты:', error);
    }
  };

  const getEmployeeNameById = (id) => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? `${employee.last_name} ${employee.first_name[0]}. ${employee.middle_name ? employee.middle_name[0] + '.' : ''}` : id;
  };

  const parseParameters = (parameters) => {
    const params = JSON.parse(parameters);
    if (params.employeeId) {
      const employeeNames = params.employeeId.map(id => getEmployeeNameById(parseInt(id)));
      return `Сотрудники: ${employeeNames.join(', ')}; Период: ${params.startDate} - ${params.endDate}`;
    }
    return `Период: ${params.startDate} - ${params.endDate}`;
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Генерация отчетов</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CRow className="mb-3">
                <CFormLabel htmlFor="startDate" className="col-sm-2 col-form-label">Начальная дата</CFormLabel>
                <CCol sm={10}>
                  <CFormInput type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="endDate" className="col-sm-2 col-form-label">Конечная дата</CFormLabel>
                <CCol sm={10}>
                  <CFormInput type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </CCol>
              </CRow>
              <CRow>
                <CCol xs={12}>
                  <CTable hover>
                    <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Выбрать</CTableHeaderCell>
                        <CTableHeaderCell>Фамилия И.О.</CTableHeaderCell>
                        <CTableHeaderCell>Отдел</CTableHeaderCell>
                        <CTableHeaderCell>Должность</CTableHeaderCell>
                        <CTableHeaderCell>Действия</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {employees.map((employee) => (
                        <CTableRow key={employee.id}>
                          <CTableDataCell>
                            <CFormCheck
                              checked={selectedEmployees.includes(employee.id)}
                              onChange={() => handleSelectEmployee(employee.id)}
                            />
                          </CTableDataCell>
                          <CTableDataCell>{`${employee.last_name} ${employee.first_name[0]}. ${employee.middle_name ? employee.middle_name[0] + '.' : ''}`}</CTableDataCell>
                          <CTableDataCell>{employee.department}</CTableDataCell>
                          <CTableDataCell>{employee.position}</CTableDataCell>
                          <CTableDataCell>
                            <CButton color="primary" shape="rounded-pill" size="sm" onClick={() => handleViewMovements(employee.id)}>
                              <CIcon icon={cilWalk} className="me-2" />
                              Спагетти
                            </CButton>
                            <CButton color="secondary" shape="rounded-pill" size="sm" onClick={() => handleViewHeatmap(employee.id)}>
                              <CIcon icon={cilFire} className="me-2" />
                              Теплокарта
                            </CButton>
                            <CButton color="secondary" shape="rounded-pill" size="sm">
                              <CIcon icon={cilMediaPlay} className="me-2" />
                              Трек
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CCol>
              </CRow>
              <CRow className="mt-3">
                <CCol xs={12}>
                  <CButton color="primary" onClick={handleGenerateReport}>Сформировать отчет</CButton>
                </CCol>
              </CRow>
              <CRow className="mt-3">
                <CCol xs={12}>
                  <CButton color="secondary" onClick={handleGenerateEnterpriseSummary}>Сформировать сводный отчет</CButton>
                </CCol>
              </CRow>
            </CForm>
            <hr />
            <h5>История отчетов</h5>
            <CTable hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableHeaderCell>Тип отчета</CTableHeaderCell>
                  <CTableHeaderCell>Параметры</CTableHeaderCell>
                  <CTableHeaderCell>Ссылки</CTableHeaderCell>
                  <CTableHeaderCell>Дата создания</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {reports.map((report, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{report.report_type === 'employee_resume' ? 'Резюме сотрудника' : report.report_type === 'employee_zone_movements' ? 'Перемещения сотрудника' : 'Сводный отчет'}</CTableDataCell>
                    <CTableDataCell>{parseParameters(report.parameters)}</CTableDataCell>
                    <CTableDataCell>
                      <a href={report.link} target="_blank" rel="noopener noreferrer">Скачать</a>
                    </CTableDataCell>
                    <CTableDataCell>{new Date(report.created_at).toLocaleString()}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
      {showDiagram && (
        <SpaghettiDiagramModal
          visible={showDiagram}
          onClose={() => setShowDiagram(false)}
          movements={movements}
        />
      )}
      {showHeatmap && (
        <HeatmapModal
          visible={showHeatmap}
          onClose={() => setShowHeatmap(false)}
          heatmapData={movements}
        />
      )}
    </CRow>
  );
};

export default ReportGenerator;
