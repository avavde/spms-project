import React from 'react';
import { CAlert } from '@coreui/react';
import { useAlert } from '../context/AlertContext';

const GlobalAlerts = () => {
  const { alerts, removeAlert } = useAlert();

  return (
    <div className="global-alerts">
      {alerts.map((alert) => (
        <CAlert
          key={alert.id}
          color={alert.type}
          dismissible
          onClose={() => removeAlert(alert.id)}
        >
          {alert.message}
        </CAlert>
      ))}
    </div>
  );
};

export default GlobalAlerts;
