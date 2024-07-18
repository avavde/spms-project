import React from 'react';
import { CToaster, CToast, CToastBody, CToastHeader } from '@coreui/react';
import { useAlert } from '../context/AlertContext';

const ToasterProvider = () => {
  const { alerts } = useAlert();

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

  return (
    <CToaster position="top-right">
      {alerts.map((alert, index) => (
        <CToast key={index} color={alert.type} className="text-white" autohide={5000} fade>
          <CToastHeader closeButton>
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
      ))}
    </CToaster>
  );
};

export default ToasterProvider;