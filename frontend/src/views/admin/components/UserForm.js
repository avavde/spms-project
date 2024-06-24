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

const UserForm = ({ show, onClose, onSave, user, roles }) => {
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    username: '',
    password: '',
    phone: '',
    email: '',
    position: '',
    photo: '',
    role: '',
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      setFormData({
        lastName: '',
        firstName: '',
        middleName: '',
        username: '',
        password: '',
        phone: '',
        email: '',
        position: '',
        photo: '',
        role: '',
      });
    }
  }, [user]);

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
        <CModalTitle>{user ? 'Редактировать пользователя' : 'Добавить пользователя'}</CModalTitle>
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
            <CFormLabel htmlFor="username">Имя пользователя</CFormLabel>
            <CFormInput id="username" name="username" value={formData.username} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="password">Пароль</CFormLabel>
            <CFormInput type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="phone">Телефон</CFormLabel>
            <CFormInput id="phone" name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="email">Электронная почта</CFormLabel>
            <CFormInput type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="position">Должность</CFormLabel>
            <CFormInput id="position" name="position" value={formData.position} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="photo">Фотография</CFormLabel>
            <CFormInput type="file" id="photo" name="photo" onChange={handleChange} />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="role">Роль</CFormLabel>
            <CFormSelect id="role" name="role" value={formData.role} onChange={handleChange}>
              {roles.map((role, index) => (
                <option key={index} value={role}>{role}</option>
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

UserForm.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  user: PropTypes.object,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default UserForm;
