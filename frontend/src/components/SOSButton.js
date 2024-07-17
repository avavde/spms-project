import React, { useState } from 'react';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import sosService from '../services/sosService';
import { useAlert } from '../context/AlertContext';

const SOSButton = () => {
  const [modal, setModal] = useState(false);
  const { addAlert } = useAlert();

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleConfirm = async () => {
    try {
      await sosService.sendSOSMessage();
      addAlert({
        id: new Date().getTime(),
        type: 'success',
        message: 'Тревога успешно объявлена',
      });
    } catch (error) {
      addAlert({
        id: new Date().getTime(),
        type: 'danger',
        message: 'Ошибка при отправке сигнала тревоги на устройства',
      });
    }
    setModal(false);
  };

  const handleCancel = () => {
    setModal(false);
  };

  return (
    <>
      <CButton color="danger" onClick={toggleModal}>
        Объявить тревогу
      </CButton>
      <CModal visible={modal} onClose={handleCancel}>
        <CModalHeader onClose={handleCancel}>
          <CModalTitle>Подтверждение тревоги</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Вы действительно хотите ОБЪЯВИТЬ ТРЕВОГУ на всех устройствах?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCancel}>
            Отмена
          </CButton>
          <CButton color="danger" onClick={handleConfirm}>
            Подтвердить
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default SOSButton;
