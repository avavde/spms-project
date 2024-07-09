import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton, CForm, CFormLabel, CFormInput } from '@coreui/react';
import departmentService from 'src/services/departmentService';

const DepartmentFormModal = ({ show, onClose, department, onSave }) => {
  const [formState, setFormState] = useState({ name: '' });

  useEffect(() => {
    if (department) {
      setFormState(department);
    }
  }, [department]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (department) {
      await departmentService.updateDepartment(department.id, formState);
    } else {
      await departmentService.createDepartment(formState);
    }
    onSave();
    onClose();
  };

  return (
    <CModal show={show} onClose={onClose}>
      <CModalHeader closeButton>{department ? 'Изменить отдел' : 'Новый отдел'}</CModalHeader>
      <CModalBody>
        <CForm onSubmit={handleSubmit}>
          <CFormLabel>Название отдела</CFormLabel>
          <CFormInput name="name" value={formState.name} onChange={handleChange} placeholder="Название отдела" />
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>Закрыть</CButton>
        <CButton color="primary" onClick={handleSubmit}>Сохранить</CButton>
      </CModalFooter>
    </CModal>
  );
};

DepartmentFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  department: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};

export default DepartmentFormModal;
