import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton, CForm, CFormLabel, CFormInput, CFormSelect } from '@coreui/react';
import employeeService from 'src/services/employeeService';
import departmentService from 'src/services/departmentService';
import deviceService from 'src/services/deviceService';

const EmployeeFormModal = ({ show, onClose, employee, onSave }) => {
  const [departments, setDepartments] = useState([]);
  const [beacons, setBeacons] = useState([]);
  const [formState, setFormState] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    email: '',
    phone: '',
    department_id: '',
    position: '',
    beaconid: '',
  });

  useEffect(() => {
    fetchDepartments();
    fetchBeacons();
  }, []);

  useEffect(() => {
    if (employee) {
      setFormState(employee);
    } else {
      setFormState({
        first_name: '',
        last_name: '',
        middle_name: '',
        email: '',
        phone: '',
        department_id: '',
        position: '',
        beaconid: '',
      });
    }
  }, [employee]);

  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getAllDepartments();
      setDepartments(response.data);
    } catch (error) {
      console.error('Ошибка при получении отделов:', error);
    }
  };

  const fetchBeacons = async () => {
    try {
      const response = await deviceService.getAvailableBeacons();
      setBeacons(response.data);
    } catch (error) {
      console.error('Ошибка при получении меток:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const employeeData = { ...formState };
      // Если department_id пустой, установите его в null
      if (employeeData.department_id === '') {
        employeeData.department_id = null;
      }
  
      if (employee) {
        await employeeService.updateEmployee(employee.id, employeeData);
      } else {
        await employeeService.createEmployee(employeeData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Ошибка при сохранении сотрудника:', error.response ? error.response.data : error.message);
    }
  };
  

  return (
    <CModal visible={show} onClose={onClose}>
      <CModalHeader closeButton>{employee ? 'Изменить сотрудника' : 'Новый сотрудник'}</CModalHeader>
      <CModalBody>
        <CForm onSubmit={handleSubmit}>
          <CFormLabel>Имя</CFormLabel>
          <CFormInput name="first_name" value={formState.first_name} onChange={handleChange} placeholder="Имя" />
          <CFormLabel>Фамилия</CFormLabel>
          <CFormInput name="last_name" value={formState.last_name} onChange={handleChange} placeholder="Фамилия" />
          <CFormLabel>Отчество</CFormLabel>
          <CFormInput name="middle_name" value={formState.middle_name} onChange={handleChange} placeholder="Отчество" />
          <CFormLabel>Email</CFormLabel>
          <CFormInput type="email" name="email" value={formState.email} onChange={handleChange} placeholder="Email" />
          <CFormLabel>Телефон</CFormLabel>
          <CFormInput name="phone" value={formState.phone} onChange={handleChange} placeholder="Телефон" />
          <CFormLabel>Отдел</CFormLabel>
          <CFormSelect name="department_id" value={formState.department_id} onChange={handleChange}>
            <option value="">Выберите отдел</option>
            {departments.map(department => (
              <option key={department.id} value={department.id}>{department.name}</option>
            ))}
          </CFormSelect>
          <CFormLabel>Должность</CFormLabel>
          <CFormInput name="position" value={formState.position} onChange={handleChange} placeholder="Должность" />
          <CFormLabel>Метка</CFormLabel>
          <CFormSelect name="beaconid" value={formState.beaconid} onChange={handleChange}>
            <option value="">Выберите метку</option>
            {beacons.map(beacon => (
              <option key={beacon.id} value={beacon.id}>{beacon.id}</option>
            ))}
          </CFormSelect>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>Отмена</CButton>
        <CButton color="primary" type="submit" onClick={handleSubmit}>Сохранить</CButton>
      </CModalFooter>
    </CModal>
  );
};

EmployeeFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  employee: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};

export default EmployeeFormModal;
