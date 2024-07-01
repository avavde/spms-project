import React, { useEffect, useState } from 'react';
import employeeService from 'src/services/employeeService';
import departmentService from 'src/services/departmentService';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilPlus } from '@coreui/icons';
import EmployeeFormModal from './EmployeeFormModal';
import DepartmentFormModal from './DepartmentFormModal';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeeService.getAllEmployees();
      setEmployees(response.data);
    } catch (error) {
      console.error('Ошибка при получении сотрудников:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getAllDepartments();
      setDepartments(response.data);
    } catch (error) {
      console.error('Ошибка при получении отделов:', error);
    }
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setShowEmployeeModal(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeModal(true);
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await employeeService.deleteEmployee(id);
      fetchEmployees();
    } catch (error) {
      console.error('Ошибка при удалении сотрудника:', error);
    }
  };

  const handleAddDepartment = () => {
    setSelectedDepartment(null);
    setShowDepartmentModal(true);
  };

  const handleEmployeeSave = () => {
    fetchEmployees();
    setShowEmployeeModal(false);
  };

  const handleDepartmentSave = () => {
    fetchDepartments();
    setShowDepartmentModal(false);
  };

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>
            <strong>Управление сотрудниками</strong>
            <CButton color="success" size="sm" className="float-right" onClick={handleAddEmployee}>
              <CIcon icon={cilPlus} /> Добавить сотрудника
            </CButton>
            <CButton color="success" size="sm" className="float-right mr-2" onClick={handleAddDepartment}>
              <CIcon icon={cilPlus} /> Добавить отдел
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableHeaderCell>Имя</CTableHeaderCell>
                  <CTableHeaderCell>Фамилия</CTableHeaderCell>
                  <CTableHeaderCell>Отчество</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Телефон</CTableHeaderCell>
                  <CTableHeaderCell>Отдел</CTableHeaderCell>
                  <CTableHeaderCell>Должность</CTableHeaderCell>
                  <CTableHeaderCell>Назначенная метка</CTableHeaderCell>
                  <CTableHeaderCell>Действия</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {employees.map((employee) => (
                  <CTableRow key={employee.id}>
                    <CTableDataCell>{employee.id}</CTableDataCell>
                    <CTableDataCell>{employee.first_name}</CTableDataCell>
                    <CTableDataCell>{employee.last_name}</CTableDataCell>
                    <CTableDataCell>{employee.middle_name}</CTableDataCell>
                    <CTableDataCell>{employee.email}</CTableDataCell>
                    <CTableDataCell>{employee.phone}</CTableDataCell>
                    <CTableDataCell>{departments.find(dept => dept.id === employee.department_id)?.name}</CTableDataCell>
                    <CTableDataCell>{employee.position}</CTableDataCell>
                    <CTableDataCell>{employee.beaconid || 'Не назначена'}</CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="primary"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditEmployee(employee)}
                      >
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton
                        color="danger"
                        variant="outline"
                        size="sm"
                        className="ml-2"
                        onClick={() => handleDeleteEmployee(employee.id)}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
      <EmployeeFormModal
        show={showEmployeeModal}
        onClose={() => setShowEmployeeModal(false)}
        employee={selectedEmployee}
        onSave={handleEmployeeSave}
      />
      <DepartmentFormModal
        show={showDepartmentModal}
        onClose={() => setShowDepartmentModal(false)}
        department={selectedDepartment}
        onSave={handleDepartmentSave}
      />
    </CRow>
  );
};

export default EmployeeManagement;
