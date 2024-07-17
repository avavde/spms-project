import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CButton
} from '@coreui/react';

const EmployeeForm = ({ employee, departments, devices, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    id: null,
    first_name: '',
    last_name: '',
    middle_name: '',
    email: '',
    position: '',
    department_id: '',
    phone: '',
    beaconid: '',
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        id: employee.id || null,
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        middle_name: employee.middle_name || '',
        email: employee.email || '',
        position: employee.position || '',
        department_id: employee.department_id || '',
        phone: employee.phone || '',
        beaconid: employee.beaconid || '',
      });
    } else {
      setFormData({
        id: null,
        first_name: '',
        last_name: '',
        middle_name: '',
        email: '',
        position: '',
        department_id: '',
        phone: '',
        beaconid: '',
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData); // Добавлено для отладки
    onSave(formData);
  };

  return (
    <CForm onSubmit={handleSubmit}>
            <div className="mb-3">
        <CFormLabel htmlFor="last_name">Фамилия</CFormLabel>
        <CFormInput
          id="last_name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <CFormLabel htmlFor="first_name">Имя</CFormLabel>
        <CFormInput
          id="first_name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <CFormLabel htmlFor="middle_name">Отчество</CFormLabel>
        <CFormInput
          id="middle_name"
          name="middle_name"
          value={formData.middle_name}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <CFormLabel htmlFor="email">Email</CFormLabel>
        <CFormInput
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <CFormLabel htmlFor="position">Должность</CFormLabel>
        <CFormInput
          id="position"
          name="position"
          value={formData.position}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <CFormLabel htmlFor="department_id">Структурное подразделение</CFormLabel>
        <CFormSelect
          id="department_id"
          name="department_id"
          value={formData.department_id}
          onChange={handleChange}
        >
          <option value="">Выберите отдел</option>
          {departments.map((dept, index) => (
            <option key={index} value={dept.id}>{dept.name}</option>
          ))}
        </CFormSelect>
      </div>
      <div className="mb-3">
        <CFormLabel htmlFor="phone">Телефон</CFormLabel>
        <CFormInput
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <CFormLabel htmlFor="beaconid">Идентификатор устройства</CFormLabel>
        <CFormSelect
          id="beaconid"
          name="beaconid"
          value={formData.beaconid}
          onChange={handleChange}
        >
          <option value="">Выберите метку</option>
          {devices.map((device, index) => (
            <option key={index} value={device.id}>{device.id}</option>
          ))}
        </CFormSelect>
      </div>
      <CButton color="primary" type="submit">Сохранить</CButton>
      <CButton color="secondary" type="button" onClick={onClose}>Закрыть</CButton> {/* Добавлено использование onClose */}
    </CForm>
  );
};

EmployeeForm.propTypes = {
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  employee: PropTypes.object,
  departments: PropTypes.arrayOf(PropTypes.object).isRequired,
  devices: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default EmployeeForm;
