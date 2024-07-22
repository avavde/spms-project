import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton
} from '@coreui/react';
import zonesService from 'src/services/zonesService';

const SpaghettiDiagramModal = ({ visible, onClose, movements }) => {
  const svgRef = useRef(null);
  const [zoneCoordinates, setZoneCoordinates] = useState({});

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const zones = await zonesService.getAllZones();
        const positions = {};
        zones.forEach(zone => {
          positions[zone.name] = zone.map_coordinates;
        });
        setZoneCoordinates(positions);
      } catch (error) {
        console.error('Ошибка при получении зон:', error);
      }
    };

    fetchZones();
  }, []);

  useEffect(() => {
    if (visible && svgRef.current) {
      // Очистка предыдущего графика
      d3.select(svgRef.current).selectAll('*').remove();

      const svg = d3.select(svgRef.current);
      const width = svgRef.current.clientWidth;
      const height = svgRef.current.clientHeight;

      const radius = Math.min(width, height) / 2 - 50;
      const centerX = width / 2;
      const centerY = height / 2;

      // Получение уникальных зон
      const uniqueZones = Array.from(new Set(movements.map(d => d.zoneName)));

      // Распределение зон по кругу
      const angleScale = d3.scalePoint()
        .domain(uniqueZones)
        .range([0, 2 * Math.PI]);

      const zonePositions = uniqueZones.map(zone => ({
        zone,
        x: centerX + radius * Math.cos(angleScale(zone) - Math.PI / 2),
        y: centerY + radius * Math.sin(angleScale(zone) - Math.PI / 2)
      }));

      // Добавление кругов для зон
      svg.selectAll('.zone')
        .data(zonePositions)
        .enter().append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 20)
        .attr('fill', 'lightblue');

      // Добавление подписей для зон
      svg.selectAll('.zone-label')
        .data(zonePositions)
        .enter().append('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y - 30)
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .text(d => d.zone);

      // Создание дуг для перемещений
      const line = d3.line()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3.curveBundle.beta(1));

      const links = [];
      for (let i = 0; i < movements.length - 1; i++) {
        if (movements[i].eventType === 'exit' && movements[i + 1].eventType === 'enter') {
          const fromZone = zonePositions.find(z => z.zone === movements[i].zoneName);
          const toZone = zonePositions.find(z => z.zone === movements[i + 1].zoneName);
          links.push([fromZone, toZone]);
        }
      }

      svg.selectAll('.link')
        .data(links)
        .enter().append('path')
        .attr('d', d => line(d))
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 1);
    }
  }, [visible, movements, zoneCoordinates]);

  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>Перемещения сотрудника</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <svg ref={svgRef} width="100%" height="500"></svg>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>Закрыть</CButton>
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
