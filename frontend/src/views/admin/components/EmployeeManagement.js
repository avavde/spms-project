// src/views/admin/components/EmployeeManagement.js

import React, { useState } from 'react';
import { CCard, CCardBody, CCardHeader, CButton } from '@coreui/react';
import EmployeeList from './EmployeeList';
import EmployeeForm from './EmployeeForm';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [departments] = useState(['Отдел 1', 'Отдел 2', 'Отдел 3']); // Пример департаментов
  const [devices] = useState([{ id: 'device1', name: 'Устройство 1' }, { id: 'device2', name: 'Устройство 2' }]); // Пример устройств

  const handleAddEmployee = () => {
    setCurrentEmployee(null);
    setShowForm(true);
  };

  const handleEditEmployee = (employee) => {
    setCurrentEmployee(employee);
    setShowForm(true);
  };

  const handleSaveEmployee = (employee) => {
    if (currentEmployee) {
      setEmployees(employees.map(emp => (emp.id === employee.id ? employee : emp)));
    } else {
      setEmployees([...employees, { ...employee, id: Date.now() }]);
    }
    setShowForm(false);
  };

  const handleDeleteEmployee = (id) => {
    setEmployees(employees.filter(employee => employee.id !== id));
  };

  return (
    <CCard>
      <CCardHeader>
        Управление сотрудниками
        <CButton color="primary" className="float-end" onClick={handleAddEmployee}>Добавить сотрудника</CButton>
      </CCardHeader>
      <CCardBody>
        <EmployeeList employees={employees} onEdit={handleEditEmployee} onDelete={handleDeleteEmployee} />
      </CCardBody>
      <EmployeeForm
        show={showForm}
        onClose={() => setShowForm(false)}
        onSave={handleSaveEmployee}
        employee={currentEmployee}
        departments={departments}
        devices={devices}
      />
    </CCard>
  );
};

export default EmployeeManagement;
