import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/react';
import zonesService from 'src/services/zonesService';

const CurrentZoneModal = ({ show, onClose, employee }) => {
  const [currentZone, setCurrentZone] = useState(null);

  useEffect(() => {
    if (employee) {
      fetchCurrentZone();
    }
  }, [employee]);

  const fetchCurrentZone = async () => {
    try {
      const response = await zonesService.getCurrentZone(employee.id);
      setCurrentZone(response);
    } catch (error) {
      console.error('Ошибка при получении текущей зоны:', error);
    }
  };

  return (
    <CModal visible={show} onClose={onClose}>
      <CModalHeader closeButton>Текущая зона сотрудника</CModalHeader>
      <CModalBody>
        {currentZone ? (
          <div>
            <p>Название зоны: {currentZone.name}</p>
            <p>Описание: {currentZone.description}</p>
          </div>
        ) : (
          <p>Зона не найдена.</p>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>Закрыть</CButton>
      </CModalFooter>
    </CModal>
  );
};

CurrentZoneModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  employee: PropTypes.object.isRequired,
};

export default CurrentZoneModal;
