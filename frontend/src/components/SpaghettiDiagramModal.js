import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import PropTypes from 'prop-types';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton
} from '@coreui/react';

// Регистрация необходимых компонентов Chart.js
Chart.register(...registerables);

const SpaghettiDiagramModal = ({ visible, onClose, movements }) => {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (visible && canvasRef.current) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const ctx = canvasRef.current.getContext('2d');

      const labels = movements.map(movement => new Date(movement.timestamp).toLocaleTimeString());
      const uniqueZones = [...new Set(movements.map(movement => movement.zoneName))];

      const data = {
        labels,
        datasets: uniqueZones.map((zone, index) => ({
          label: zone,
          data: movements
            .filter(movement => movement.zoneName === zone)
            .map(movement => ({ x: new Date(movement.timestamp).toLocaleTimeString(), y: index })),
          borderColor: `rgba(${index * 30}, ${index * 60}, ${index * 90}, 0.6)`,
          fill: false,
          tension: 0.1,
        }))
      };

      chartRef.current = new Chart(ctx, {
        type: 'line',
        data,
        options: {
          scales: {
            x: {
              type: 'category',
              title: {
                display: true,
                text: 'Time'
              }
            },
            y: {
              type: 'category',
              labels: uniqueZones,
              title: {
                display: true,
                text: 'Zones'
              }
            }
          },
          elements: {
            point: {
              radius: 5
            }
          },
          responsive: true,
          plugins: {
            legend: {
              display: true
            }
          }
        }
      });
    }
  }, [visible, movements]);

  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Spaghetti Diagram</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <canvas ref={canvasRef}></canvas>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>Close</CButton>
      </CModalFooter>
    </CModal>
  );
};

SpaghettiDiagramModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  movements: PropTypes.arrayOf(PropTypes.shape({
    timestamp: PropTypes.string.isRequired,
    zoneName: PropTypes.string.isRequired,
    zoneType: PropTypes.string.isRequired,
    eventType: PropTypes.string.isRequired,
    duration: PropTypes.number
  })).isRequired
};

export default SpaghettiDiagramModal;
