// src/pages/EmployeeEditPage.js

import React from 'react';
import { useParams } from 'react-router-dom';
import CheckboxComponent from 'src/components/CheckboxComponent'; // Импортируем компонент

import EmployeeEdit from 'src/components/EmployeeEdit';

const EmployeeEditPage = () => {
  const { id } = useParams();

  return (
    <div>
      <h2>Редактирование сотрудника</h2>
      <EmployeeEdit employeeId={parseInt(id, 10)} />
      <CheckboxComponent /> {/* Используем компонент */}
    </div>
  );
};

export default EmployeeEditPage;
