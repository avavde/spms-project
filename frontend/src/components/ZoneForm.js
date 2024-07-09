import React, { useState, useEffect } from 'react';
import { CForm, CFormCheck, CFormLabel, CFormSelect, CContainer, CButton, CBadge } from '@coreui/react';
import PropTypes from 'prop-types';
import zonesService from 'src/services/zonesService';
import employeeZoneAssignmentService from 'src/services/employeeZoneAssignmentService';

const ZoneForm = ({ employeeId, onSave }) => {
  const [checkboxes, setCheckboxes] = useState({});
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState('');
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const zones = await zonesService.getAllZones(employeeId);
      const assignments = await employeeZoneAssignmentService.getAssignmentByEmployeeId(employeeId);
      const initialCheckboxesState = zones.reduce((acc, zone) => {
        acc[zone.id] = assignments.some(a => a.zone_id === zone.id && a.assignment_type === 'forbidden');
        return acc;
      }, {});
      const workingZone = assignments.find(a => a.assignment_type === 'working')?.zone_id || '';
      setZones(zones);
      setCheckboxes(initialCheckboxesState);
      setSelectedZone(workingZone.toString());
      setAssignments(assignments);
    };

    fetchData();
  }, [employeeId]);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [name]: checked,
    }));
  };

  const handleSelectChange = (event) => {
    setSelectedZone(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const forbiddenZones = Object.keys(checkboxes).filter((zoneId) => checkboxes[zoneId]);
    const allowedZones = Object.keys(checkboxes).filter((zoneId) => !checkboxes[zoneId]);
    const newAssignments = [];

    // Обработка запрещенных зон
    forbiddenZones.forEach(zoneId => {
      newAssignments.push({
        employee_id: employeeId,
        zone_id: parseInt(zoneId, 10),
        assignment_type: 'forbidden'
      });
    });

    // Обработка разрешенных зон (снятые чеки)
    allowedZones.forEach(zoneId => {
      newAssignments.push({
        employee_id: employeeId,
        zone_id: parseInt(zoneId, 10),
        assignment_type: 'allowed'
      });
    });

    // Обработка рабочей зоны
    if (selectedZone) {
      newAssignments.push({
        employee_id: employeeId,
        zone_id: parseInt(selectedZone, 10),
        assignment_type: 'working'
      });
    }

    const existingAssignments = assignments.reduce((acc, a) => {
      acc[a.zone_id] = a;
      return acc;
    }, {});

    try {
      const promises = [];
      newAssignments.forEach(assignment => {
        if (existingAssignments[assignment.zone_id]) {
          promises.push(employeeZoneAssignmentService.updateAssignment(existingAssignments[assignment.zone_id].id, assignment));
        } else {
          promises.push(employeeZoneAssignmentService.createAssignment(assignment));
        }
      });

      assignments.forEach(assignment => {
        if (!newAssignments.some(a => a.zone_id === assignment.zone_id && a.assignment_type === assignment.assignment_type)) {
          promises.push(employeeZoneAssignmentService.deleteAssignment(assignment.id));
        }
      });

      await Promise.all(promises);
      onSave();
    } catch (error) {
      console.error('Ошибка при сохранении назначения зон:', error);
    }
  };

  const getZoneBadge = (zoneType) => {
    switch (zoneType) {
      case 'control':
        return <CBadge color="warning" className="ms-2">Контроль</CBadge>;
      case 'warning':
        return <CBadge color="danger" className="ms-2">Предупреждение</CBadge>;
      case 'danger':
        return <CBadge color="dark" className="ms-2">Опасная</CBadge>;
      default:
        return null;
    }
  };

  return (
    <CContainer>
      <CForm onSubmit={handleSubmit}>
        <CFormLabel>Запрещенные зоны:</CFormLabel>
        {zones.map((zone) => (
          <CFormCheck
            key={zone.id.toString()}
            id={zone.id.toString()}
            name={zone.id.toString()}
            label={
              <>
                {zone.name} {getZoneBadge(zone.type)}
              </>
            }
            checked={checkboxes[zone.id]}
            onChange={handleCheckboxChange}
          />
        ))}
        <CFormLabel>Рабочая зона:</CFormLabel>
        <CFormSelect value={selectedZone} onChange={handleSelectChange}>
          <option value="">Выберите зону</option>
          {zones.map((zone) => (
            <option key={zone.id.toString()} value={zone.id.toString()}>
              {zone.name}
            </option>
          ))}
        </CFormSelect>
        <br />
        {zones.map((zone) => {
          if (zone.id.toString() === selectedZone) {
            return <CBadge key={zone.id} color={getZoneBadgeColor(zone.type)}>{zone.type}</CBadge>;
          }
          return null;
        })}
        <br />
        <CButton type="submit" color="primary">Сохранить</CButton>
      </CForm>
    </CContainer>
  );
};

ZoneForm.propTypes = {
  employeeId: PropTypes.number.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default ZoneForm;

const getZoneBadgeColor = (zoneType) => {
  switch (zoneType) {
    case 'control':
      return 'warning';
    case 'warning':
      return 'danger';
    case 'danger':
      return 'dark';
    default:
      return 'secondary';
  }
};
