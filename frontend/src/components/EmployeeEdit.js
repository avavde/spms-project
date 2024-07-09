// EmployeeEdit.js

import React from 'react';
import { CContainer } from '@coreui/react';
import CheckboxGroup from './CheckboxGroup'; // Импортируем компонент CheckboxGroup

const EmployeeEdit = () => {
  return (
    <CContainer>
      <h1>Пример с чекбоксами </h1>
      <CheckboxGroup />
    </CContainer>
  );
};

export default EmployeeEdit;
