import React from 'react';
import PropTypes from 'prop-types';
import { CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CButton } from '@coreui/react';

const UserList = ({ users, onEdit, onDelete }) => {
  return (
    <CTable>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>Фамилия</CTableHeaderCell>
          <CTableHeaderCell>Имя</CTableHeaderCell>
          <CTableHeaderCell>Отчество</CTableHeaderCell>
          <CTableHeaderCell>Имя пользователя</CTableHeaderCell>
          <CTableHeaderCell>Телефон</CTableHeaderCell>
          <CTableHeaderCell>Электронная почта</CTableHeaderCell>
          <CTableHeaderCell>Должность</CTableHeaderCell>
          <CTableHeaderCell>Роль</CTableHeaderCell>
          <CTableHeaderCell>Действия</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {users.map((user, index) => (
          <CTableRow key={index}>
            <CTableDataCell>{user.lastName}</CTableDataCell>
            <CTableDataCell>{user.firstName}</CTableDataCell>
            <CTableDataCell>{user.middleName}</CTableDataCell>
            <CTableDataCell>{user.username}</CTableDataCell>
            <CTableDataCell>{user.phone}</CTableDataCell>
            <CTableDataCell>{user.email}</CTableDataCell>
            <CTableDataCell>{user.position}</CTableDataCell>
            <CTableDataCell>{user.role}</CTableDataCell>
            <CTableDataCell>
              <CButton color="primary" onClick={() => onEdit(user)}>Редактировать</CButton>
              <CButton color="danger" onClick={() => onDelete(user.id)}>Удалить</CButton>
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  );
};

UserList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default UserList;
