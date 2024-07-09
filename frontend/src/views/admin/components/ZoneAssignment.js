import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import zonesService from 'src/services/zonesService';
import {
  CForm,
  CFormLabel,
  CFormCheck,
  CButton
} from '@coreui/react';

const ZoneAssignment = ({ employeeId, onSaveZones }) => {
  const [zones, setZones] = useState([]);
  const [selectedZones, setSelectedZones] = useState({
    workplace: '',
    allowed: [],
    forbidden: []
  });

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      const data = await zonesService.getAllZones();
      console.log('Fetched zones:', data); // Лог для проверки данных
      setZones(data || []);
    } catch (error) {
      console.error('Ошибка при получении зон:', error);
    }
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    console.log(`Change event: name=${name}, value=${value}`);
    setSelectedZones((prevSelectedZones) => ({
      ...prevSelectedZones,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    console.log(`Change event: name=${name}, value=${value}, checked=${checked}`);
    setSelectedZones((prevSelectedZones) => {
      let updatedValues;
      if (checked) {
        updatedValues = [...prevSelectedZones[name], value];
      } else {
        updatedValues = prevSelectedZones[name].filter(zone => zone !== value);
      }
      return {
        ...prevSelectedZones,
        [name]: updatedValues
      };
    });
  };

  useEffect(() => {
    console.log('Updated selectedZones:', selectedZones);
  }, [selectedZones]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(`Saving zones for employee ${employeeId}:`, selectedZones);
      await onSaveZones(selectedZones);
    } catch (error) {
      console.error('Ошибка при сохранении назначений зон:', error);
    }
  };

  return (
    <CForm onSubmit={handleSubmit}>
      <div className="mb-3">
        <CFormLabel htmlFor="workplace">Рабочее место</CFormLabel>
        <CFormCheck
          type="radio"
          id="workplace-none"
          name="workplace"
          value=""
          checked={selectedZones.workplace === ''}
          onChange={handleRadioChange}
          label="Не выбрано"
        />
        {zones.map(zone => (
          <CFormCheck
            key={zone.id}
            type="radio"
            id={`workplace-${zone.id}`}
            name="workplace"
            value={zone.id}
            checked={selectedZones.workplace === zone.id}
            onChange={handleRadioChange}
            label={zone.name}
          />
        ))}
      </div>
      <div className="mb-3">
        <CFormLabel htmlFor="allowed">Разрешенные зоны</CFormLabel>
        {zones.map(zone => (
          <CFormCheck
            key={zone.id}
            type="checkbox"
            id={`allowed-${zone.id}`}
            name="allowed"
            value={zone.id}
            checked={selectedZones.allowed.includes(zone.id)}
            onChange={handleCheckboxChange}
            label={zone.name}
          />
        ))}
      </div>
      <div className="mb-3">
        <CFormLabel htmlFor="forbidden">Запрещенные зоны</CFormLabel>
        {zones.map(zone => (
          <CFormCheck
            key={zone.id}
            type="checkbox"
            id={`forbidden-${zone.id}`}
            name="forbidden"
            value={zone.id}
            checked={selectedZones.forbidden.includes(zone.id)}
            onChange={handleCheckboxChange}
            label={zone.name}
          />
        ))}
      </div>
      <CButton color="primary" type="submit">Сохранить зоны</CButton>
    </CForm>
  );
};

ZoneAssignment.propTypes = {
  employeeId: PropTypes.number.isRequired,
  onSaveZones: PropTypes.func.isRequired,
};

export default ZoneAssignment;

