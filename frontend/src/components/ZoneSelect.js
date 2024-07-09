import React, { useState, useEffect } from 'react';
import { CFormLabel, CForm, CContainer, CFormSelect } from '@coreui/react';
import PropTypes from 'prop-types';
import zonesService from 'src/services/zonesService';
import employeeZoneAssignmentService from 'src/services/employeeZoneAssignmentService';

const ZoneSelect = ({ employeeId }) => {
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const zones = await zonesService.getAllZones(employeeId);
      const assignments = await employeeZoneAssignmentService.getAssignmentByEmployeeId(employeeId);
      const workingZone = assignments.find(a => a.assignment_type === 'working')?.zone_id || '';
      setZones(zones);
      setSelectedZone(workingZone.toString());
    };

    fetchData();
  }, [employeeId]);

  const handleSelectChange = (event) => {
    setSelectedZone(event.target.value);
  };

  const getZoneStyle = (zoneType) => {
    switch (zoneType) {
      case 'control':
        return { backgroundColor: '#ffff00' }; // Желтый
      case 'warning':
        return { backgroundColor: '#ffa500' }; // Оранжевый
      case 'danger':
        return { backgroundColor: '#ff0000', color: '#fff' }; // Красный
      default:
        return {};
    }
  };

  return (
    <CContainer>
      <CForm>
        <CFormLabel>Выберите зону:</CFormLabel>
        <CFormSelect value={selectedZone} onChange={handleSelectChange}>
          <option value="">Выберите зону</option>
          {zones.map((zone) => (
            <option key={zone.id} value={zone.id.toString()} style={getZoneStyle(zone.type)}>
              {zone.name} {zone.type === 'danger' && Опасная}
            </option>
          ))}
        </CFormSelect>
      </CForm>
    </CContainer>
  );
};

ZoneSelect.propTypes = {
  employeeId: PropTypes.number.isRequired,
};

export default ZoneSelect;
