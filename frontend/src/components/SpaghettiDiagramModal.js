import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
} from '@coreui/react';
import employeeService from 'src/services/employeeService';
import { Line } from 'react-chartjs-2';

const SpaghettiDiagramModal = ({ visible, employeeId, onClose }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [events, setEvents] = useState([]);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    if (visible && employeeId && startDate && endDate) {
      fetchEmployeeMovements();
    }
  }, [visible, employeeId, startDate, endDate]);

  const fetchEmployeeMovements = async () => {
    try {
      const data = await employeeService.getEmployeeMovements(employeeId, startDate, endDate);
      setEvents(data);
      generateChartData(data);
    } catch (error) {
      console.error('Error fetching employee movements:', error);
    }
  };

  const generateChartData = (data) => {
    const labels = data.map(event => new Date(event.timestamp).toLocaleString());
    const datasets = [
      {
        label: 'Перемещения сотрудника',
        data: data.map(event => event.zone_id),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ];

    setChartData({ labels, datasets });
  };

  const handleGenerate = () => {
    fetchEmployeeMovements();
  };

  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>Спагетти-диаграмма перемещений сотрудника</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <div className="mb-3">
            <CFormLabel htmlFor="startDate">Начальная дата</CFormLabel>
            <CFormInput
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="endDate">Конечная дата</CFormLabel>
            <CFormInput
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </CForm>
        {events.length > 0 && <Line data={chartData} />}
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={handleGenerate}>Сгенерировать</CButton>
        <CButton color="secondary" onClick={onClose}>Закрыть</CButton>
      </CModalFooter>
    </CModal>
  );
};

SpaghettiDiagramModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  employeeId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SpaghettiDiagramModal;
