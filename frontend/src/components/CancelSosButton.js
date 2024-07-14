import React, { useState } from 'react';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CAlert } from '@coreui/react';
import cancelSosService from '../services/cancelSosService';

const CancelSosButton = () => {
  const [modal, setModal] = useState(false);
  const [alert, setAlert] = useState(null);

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleConfirm = async () => {
    try {
      await cancelSosService.sendCancelSosMessage();
      setAlert(<CAlert color="success">Тревога успешно отменена</CAlert>);
    } catch (error) {
      setAlert(<CAlert color="danger">Ошибка при отмене сигнала тревоги на устройства</CAlert>);
    }
    setModal(false);
  };

  const handleCancel = () => {
    setModal(false);
  };

  return (
    <>
      {alert}
      <CButton color="success" onClick={toggleModal}>
        Отменить тревогу
      </CButton>
      <CModal visible={modal} onClose={handleCancel}>
        <CModalHeader onClose={handleCancel}>
          <CModalTitle>Подтвердить отмену SOS</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Вы действительно хотите отменить тревогу на всех устройствах?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCancel}>
            Отмена
          </CButton>
          <CButton color="success" onClick={handleConfirm}>
            Подтвердить
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default CancelSosButton;
