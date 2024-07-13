import React, { useState } from 'react';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CAlert } from '@coreui/react';
import sosService from '../services/sosService';

const SOSButton = () => {
    const [modal, setModal] = useState(false);
    const [alert, setAlert] = useState(null);

    const toggleModal = () => {
        setModal(!modal);
    };

    const handleConfirm = async () => {
        try {
            await sosService.sendSOSMessage();
            setAlert(<CAlert color="success">Тревока успешно объявлена</CAlert>);
        } catch (error) {
            setAlert(<CAlert color="danger">Ошибка при отправки сигнала тревоги на устройства</CAlert>);
        }
        setModal(false);
    };

    const handleCancel = () => {
        setModal(false);
    };

    return (
        <>
            {alert}
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
