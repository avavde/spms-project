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
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [reports, setReports] = useState([]);
  const [showDiagram, setShowDiagram] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);

  useEffect(() => {
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0)).toISOString().slice(0, -5);
    const end = new Date(today.setHours(23, 59, 59, 999)).toISOString().slice(0, -5);

    setStartDateTime(start);
    setEndDateTime(end);
  }, []);

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
      const { summaryLink, detailLink } = await reportService.generateReport(selectedEmployees, startDateTime, endDateTime);
      setReports([...reports,
        { link: summaryLink, created_at: new Date().toISOString(), report_type: 'employee_resume', parameters: JSON.stringify({ employeeId: selectedEmployees, startDateTime, endDateTime }) },
        { link: detailLink, created_at: new Date().toISOString(), report_type: 'employee_zone_movements', parameters: JSON.stringify({ employeeId: selectedEmployees, startDateTime, endDateTime }) }
      ]);
    } catch (error) {
      console.error('Ошибка при формировании отчета:', error);
    }
  };

  const handleGenerateEnterpriseSummary = async () => {
    try {
      const { link } = await reportService.generateEnterpriseSummary(startDateTime, endDateTime);
      setReports([...reports, { link, created_at: new Date().toISOString(), report_type: 'enterprise', parameters: JSON.stringify({ startDateTime, endDateTime }) }]);
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

  const handleViewSpaghetti = (employeeId) => {
    setCurrentEmployeeId(employeeId);
  };
  
  useEffect(() => {
    if (currentEmployeeId !== null) {
      console.log(currentEmployeeId);
      setShowDiagram(true);
    }
  }, [currentEmployeeId]);

  const handleViewHeatmap = (employeeId) => {
    setCurrentEmployeeId(employeeId);
    setShowHeatmap(true);
  };

  const getEmployeeNameById = (id) => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? `${employee.last_name} ${employee.first_name[0]}. ${employee.middle_name ? employee.middle_name[0] + '.' : ''}` : id;
  };

  const parseParameters = (parameters) => {
    const params = JSON.parse(parameters);
    if (params.employeeId) {
      const employeeNames = params.employeeId.map(id => getEmployeeNameById(parseInt(id)));
      return `Сотрудники: ${employeeNames.join(', ')}; Период: ${params.startDateTime} - ${params.endDateTime}`;
    }
    return `Период: ${params.startDateTime} - ${params.endDateTime}`;
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
                <CFormLabel htmlFor="startDateTime" className="col-sm-2 col-form-label">Начальная дата и время</CFormLabel>
                <CCol sm={10}>
                  <CFormInput type="datetime-local" id="startDateTime" value={startDateTime} onChange={(e) => setStartDateTime(e.target.value)} />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="endDateTime" className="col-sm-2 col-form-label">Конечная дата и время</CFormLabel>
                <CCol sm={10}>
                  <CFormInput type="datetime-local" id="endDateTime" value={endDateTime} onChange={(e) => setEndDateTime(e.target.value)} />
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
                            <CButton color="primary" shape="rounded-pill" size="sm" onClick={() => handleViewSpaghetti(employee.id)}>
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
      <CTableDataCell>
        {report.report_type === 'employee_resume' ? 'Резюме сотрудника' :
         report.report_type === 'employee_zone_movements' ? 'Перемещения сотрудника' :
         'Сводный отчет'}
      </CTableDataCell>
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
    employeeId={currentEmployeeId}
    startDateTime={startDateTime}
    endDateTime={endDateTime}
  />
)}
{showHeatmap && (
  <HeatmapModal
    visible={showHeatmap}
    onClose={() => setShowHeatmap(false)}
    employeeId={currentEmployeeId}
    startDateTime={startDateTime}
    endDateTime={endDateTime}
  />
)}
</CRow>
);
};

export default ReportGenerator;
