import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react';

const EmployeeForm = ({ show, onClose, onSave, employee, departments, devices }) => {
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    position: '',
    department: '',
    phone: '',
    beaconid: '', 
  });

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    } else {
      setFormData({
        lastName: '',
        firstName: '',
        middleName: '',
        position: '',
        department: '',
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

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <CModal visible={show} onClose={onClose}>
      <CModalHeader closeButton>
        <CModalTitle>{employee ? 'Редактировать сотрудника' : 'Добавить сотрудника'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <div className="mb-3">
            <CFormLabel htmlFor="lastName">Фамилия</CFormLabel>
            <CFormInput id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="firstName">Имя</CFormLabel>
            <CFormInput id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="middleName">Отчество</CFormLabel>
            <CFormInput id="middleName" name="middleName" value={formData.middleName} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="position">Должность</CFormLabel>
            <CFormInput id="position" name="position" value={formData.position} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="department">Структурное подразделение</CFormLabel>
            <CFormSelect id="department" name="department" value={formData.department} onChange={handleChange}>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>{dept}</option>
              ))}
            </CFormSelect>
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="phone">Телефон</CFormLabel>
            <CFormInput id="phone" name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="beaconid">Идентификатор устройства</CFormLabel>
            <CFormSelect id="beaconid" name="beaconid" value={formData.beaconid} onChange={handleChange}>
              {devices.map((device, index) => (
                <option key={index} value={device.id}>{device.name}</option>
              ))}
            </CFormSelect>
          </div>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={handleSubmit}>Сохранить</CButton>
        <CButton color="secondary" onClick={onClose}>Отмена</CButton>
      </CModalFooter>
    </CModal>
  );
};

EmployeeForm.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  employee: PropTypes.object,
  departments: PropTypes.arrayOf(PropTypes.string).isRequired,
  devices: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default EmployeeForm;
