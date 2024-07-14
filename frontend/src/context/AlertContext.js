// src/context/AlertContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useWebSocket } from './WebSocketContext';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const notifications = useWebSocket();

  const addAlert = (alert) => {
    setAlerts((prevAlerts) => [...prevAlerts, alert]);
  };

  const removeAlert = (id) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  useEffect(() => {
    notifications.forEach((data) => {
      if (data.type === 'device_status') {
        switch (data.data.event) {
          case 'sos_signal':
            addAlert({
              id: new Date().getTime(),
              type: 'danger',
              message: `Внимание! Сотрудник ${data.data.employee} в опасности!`,
              employee: data.data.employee,
              timestamp: data.data.timestamp,
            });
            break;
          case 'fall_detected':
            addAlert({
              id: new Date().getTime(),
              type: 'warning',
              message: `Обнаружено падение у сотрудника ${data.data.employee}`,
              employee: data.data.employee,
              timestamp: data.data.timestamp,
            });
            break;
          case 'low_battery':
            addAlert({
              id: new Date().getTime(),
              type: 'info',
              message: `Низкий заряд батареи у сотрудника ${data.data.employee}`,
              employee: data.data.employee,
              timestamp: data.data.timestamp,
            });
            break;
          case 'sos_cleared':
            setAlerts((prevAlerts) =>
              prevAlerts.filter((alert) => alert.employee !== data.data.employee)
            );
            break;
          default:
            break;
        }
      } else if (data.type === 'zone_event') {
        addAlert({
          id: new Date().getTime(),
          type: data.data.event_type.includes('вошел') ? 'info' : 'warning',
          message: `Сотрудник ${data.data.employee} ${data.data.event_type} ${data.data.zone_name}`,
          employee: data.data.employee,
          timestamp: data.data.timestamp,
        });
      } else if (data.type === 'zone_violation') {
        addAlert({
          id: new Date().getTime(),
          type: 'danger',
          message: `Нарушение! Сотрудник ${data.data.employee} вошел в запрещенную зону ${data.data.zone_name}`,
          employee: data.data.employee,
          timestamp: data.data.timestamp,
        });
      }
    });
  }, [notifications]);

  return (
    <AlertContext.Provider value={{ addAlert, removeAlert, alerts }}>
      {children}
    </AlertContext.Provider>
  );
};

AlertProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AlertContext;
