import React, { useRef, useState, useEffect } from 'react';
import { CToaster, CToast, CToastBody, CToastHeader } from '@coreui/react';
import { useAlert } from '../context/AlertContext';

const ToasterProvider = () => {
  const { alerts } = useAlert();
  const toaster = useRef();
  const [toasts, setToasts] = useState([]);

  const getIcon = (type) => {
    switch (type) {
      case 'danger':
        return <i className="cil-warning"></i>;
      case 'warning':
        return <i className="cil-bell"></i>;
      case 'info':
        return <i className="cil-info"></i>;
      default:
        return <i className="cil-info"></i>;
    }
  };

  useEffect(() => {
    alerts.forEach(alert => {
      const newToast = (
        <CToast key={alert.timestamp} color={alert.type} className="text-white" autohide={true} fade={true}>
          <CToastHeader closeButton={true}>
            {getIcon(alert.type)}
            <strong className="me-auto ms-2">Уведомление</strong>
            <small className="text-muted ms-auto">{new Date(alert.timestamp).toLocaleString()}</small>
          </CToastHeader>
          <CToastBody>
            {alert.message}
            {(alert.type === 'danger' || alert.type === 'warning') && (
              <button
                className="btn btn-link text-white"
                onClick={() => console.log('Показать зону сотрудника')}
              >
                Позиция сотрудника
              </button>
            )}
          </CToastBody>
        </CToast>
      );
      setToasts(prevToasts => [...prevToasts, newToast]);
    });
  }, [alerts]);

  return (
    <CToaster ref={toaster} push={toasts} placement="top-end" />
  );
};

export default ToasterProvider;
