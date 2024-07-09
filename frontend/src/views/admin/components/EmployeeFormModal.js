import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/react';
import employeeService from 'src/services/employeeService';
import departmentService from 'src/services/departmentService';
import deviceService from 'src/services/deviceService';
import EmployeeForm from './EmployeeForm';
import ZoneForm from 'src/components/ZoneForm';

const EmployeeFormModal = ({ show, onClose, employee, onSave, onSaveZones }) => {
  const [departments, setDepartments] = useState([]);
  const [beacons, setBeacons] = useState([]);
  const [formState, setFormState] = useState({
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
    fetchDepartments();
    fetchBeacons();
  }, []);

  useEffect(() => {
    if (employee) {
      console.log('Employee data received:', employee); // Добавлено для отладки
      setFormState({
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
      setFormState({
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
      const response = await deviceService.getAvailableBadges();
      setBeacons(response.data);
      console.log('Beacons:', response.data); // Добавлено для отладки
    } catch (error) {
      console.error('Ошибка при получении меток:', error);
    }
  };

  const handleSaveEmployee = async (formData) => {
    try {
      const employeeData = { ...formData };
      if (employeeData.department_id === '') {
        employeeData.department_id = null;
      }

      if (employeeData.id !== null && employeeData.id !== undefined) {
        console.log('Updating employee:', employeeData.id, employeeData); // Добавлено для отладки
        await employeeService.updateEmployee(employeeData.id, employeeData);
      } else {
        console.log('Creating new employee:', employeeData); // Добавлено для отладки
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
        <EmployeeForm
          employee={formState}
          departments={departments}
          devices={beacons}
          onSave={handleSaveEmployee}
          onClose={onClose}
        />
        <hr />
        {employee && employee.id && (
          <ZoneForm employeeId={employee.id} onSave={onSaveZones} />
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>Закрыть</CButton>
      </CModalFooter>
    </CModal>
  );
};

EmployeeFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  employee: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onSaveZones: PropTypes.func.isRequired,
};

export default EmployeeFormModal;
