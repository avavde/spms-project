import React, { useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader } from '@coreui/react';
import UserList from './UserList';
import UserForm from './UserForm';

const roles = ['Администратор', 'Пользователь', 'Менеджер', 'Инженер'];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddUser = () => {
    setCurrentUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setShowForm(true);
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleSaveUser = (user) => {
    if (user.id) {
      setUsers(users.map(u => (u.id === user.id ? user : u)));
    } else {
      user.id = Date.now();
      setUsers([...users, user]);
    }
  };

  return (
    <CCard>
      <CCardHeader>
        Управление пользователями
        <CButton color="primary" className="float-end" onClick={handleAddUser}>Добавить пользователя</CButton>
      </CCardHeader>
      <CCardBody>
        <UserList users={users} onEdit={handleEditUser} onDelete={handleDeleteUser} />
      </CCardBody>
      <UserForm
        show={showForm}
        onClose={() => setShowForm(false)}
        onSave={handleSaveUser}
        user={currentUser}
        roles={roles}
      />
    </CCard>
  );
};

export default UserManagement;
