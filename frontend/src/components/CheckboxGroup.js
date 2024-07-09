import React, { useState, useEffect } from 'react';
import { CFormCheck, CFormLabel, CForm, CContainer } from '@coreui/react';
import PropTypes from 'prop-types';
import zonesService from 'src/services/zonesService';
import employeeZoneAssignmentService from 'src/services/employeeZoneAssignmentService';

const CheckboxGroup = ({ employeeId }) => {
  const [checkboxes, setCheckboxes] = useState({});
  const [zones, setZones] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const zones = await zonesService.getAllZones(employeeId);
      const assignments = await employeeZoneAssignmentService.getAssignmentByEmployeeId(employeeId);
      const initialCheckboxesState = zones.reduce((acc, zone) => {
        acc[zone.id] = assignments.some(a => a.zone_id === zone.id && a.assignment_type === 'forbidden');
        return acc;
      }, {});
      setZones(zones);
      setCheckboxes(initialCheckboxesState);
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

  return (
    <CContainer>
      <CForm>
        <CFormLabel>Выберите зоны:</CFormLabel>
        {zones.map((zone) => (
          <CFormCheck
            key={zone.id}
            id={zone.id.toString()}
            name={zone.id.toString()}
            label={zone.name}
            checked={checkboxes[zone.id]}
            onChange={handleCheckboxChange}
          />
        ))}
      </CForm>
    </CContainer>
  );
};

CheckboxGroup.propTypes = {
  employeeId: PropTypes.number.isRequired,
};

export default CheckboxGroup;
