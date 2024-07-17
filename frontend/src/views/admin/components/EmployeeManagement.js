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
  CFormInput
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilPlus, cilMap } from '@coreui/icons';
import EmployeeFormModal from './EmployeeFormModal';
import DepartmentFormModal from './DepartmentFormModal';
import EmployeeLocationModal from 'src/components/EmployeeLocationModal';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [search, setSearch] = useState({
    fullName: '',
    department_id: '',
    position: '',
    beaconid: '',
  });
  const [showLocationModal, setShowLocationModal] = useState(false);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [search, employees]);

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

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearch((prevSearch) => ({
      ...prevSearch,
      [name]: value,
    }));
  };

  const filterEmployees = () => {
    let filtered = [...employees];
    Object.keys(search).forEach(key => {
      if (search[key]) {
        if (key === 'fullName') {
          const searchValue = search[key].toLowerCase();
          filtered = filtered.filter(employee => 
            employee.first_name.toLowerCase().includes(searchValue) ||
            employee.last_name.toLowerCase().includes(searchValue) ||
            (employee.middle_name && employee.middle_name.toLowerCase().includes(searchValue)) ||
            `${employee.last_name} ${employee.first_name[0]}. ${employee.middle_name ? employee.middle_name[0] + '.' : ''}`.toLowerCase().includes(searchValue)
          );
        } else {
          filtered = filtered.filter(employee => 
            String(employee[key]).toLowerCase().includes(search[key].toLowerCase())
          );
        }
      }
    });
    setFilteredEmployees(filtered);
  };

  const handleShowCurrentZone = (employee) => {
    setSelectedEmployee(employee);
    setShowLocationModal(true);
  };

  const handleCloseLocationModal = () => {
    setShowLocationModal(false);
    setSelectedEmployee(null);
  };

  const handleSaveZones = async (employeeId, zones) => {
    try {
      // Logic to save zones for the employee
      console.log(`Saving zones for employee ${employeeId}:`, zones);
    } catch (error) {
      console.error('Ошибка при сохранении назначений зон:', error);
    }
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
                  <CTableHeaderCell>Фамилия И.О.</CTableHeaderCell>
                  <CTableHeaderCell>Отдел</CTableHeaderCell>
                  <CTableHeaderCell>Должность</CTableHeaderCell>
                  <CTableHeaderCell>Бейдж</CTableHeaderCell>
                  <CTableHeaderCell>Действия</CTableHeaderCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell>
                    <CFormInput size="sm" name="fullName" value={search.fullName} onChange={handleSearchChange} />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CFormInput size="sm" name="department_id" value={search.department_id} onChange={handleSearchChange} />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CFormInput size="sm" name="position" value={search.position} onChange={handleSearchChange} />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CFormInput size="sm" name="beaconid" value={search.beaconid} onChange={handleSearchChange} />
                  </CTableDataCell>
                  <CTableDataCell></CTableDataCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredEmployees.map((employee) => (
                  <CTableRow key={employee.id}>
                    <CTableDataCell>{`${employee.last_name} ${employee.first_name[0]}. ${employee.middle_name ? employee.middle_name[0] + '.' : ''}`}</CTableDataCell>
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
                      <CButton
                        color="info"
                        variant="outline"
                        size="sm"
                        className="ml-2"
                        onClick={() => handleShowCurrentZone(employee)}
                      >
                        <CIcon icon={cilMap} />
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
        onSaveZones={handleSaveZones}
      />
      <DepartmentFormModal
        show={showDepartmentModal}
        onClose={() => setShowDepartmentModal(false)}
        department={selectedDepartment}
        onSave={handleDepartmentSave}
      />
      {selectedEmployee && (
        <EmployeeLocationModal
          employeeId={selectedEmployee.id}
          visible={showLocationModal}
          onClose={handleCloseLocationModal}
        />
      )}
    </CRow>
  );
};

export default EmployeeManagement;
