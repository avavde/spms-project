import React, { useEffect, useState } from 'react';
import {
  CListGroup,
  CListGroupItem,
  CAlert,
} from '@coreui/react';
import PropTypes from 'prop-types';
import CIcon from '@coreui/icons-react';
import {
  cilBell,
  cilInfo,
  cilWarning,
  cilUserFollow,
  cilUserUnfollow,
} from '@coreui/icons';
import { initWebSocket, closeWebSocket } from '../services/webSocketService';

const AllNotifications = ({ showOffcanvas, setShowOffcanvas }) => {
  const [notifications, setNotifications] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const handleNotification = (notification) => {
      setNotifications((prevNotifications) => [notification, ...prevNotifications]);
      setLogs((prevLogs) => [
        ...prevLogs,
        { timestamp: new Date().toLocaleString(), message: JSON.stringify(notification) },
      ]);
    };

    initWebSocket(handleNotification);

    return () => {
      closeWebSocket();
    };
  }, []);

  const renderNotificationIcon = (type) => {
    switch (type) {
      case 'enter':
        return <CIcon icon={cilUserFollow} className="me-2 text-success" />;
      case 'exit':
        return <CIcon icon={cilUserUnfollow} className="me-2 text-danger" />;
      case 'violation':
        return <CIcon icon={cilWarning} className="me-2 text-warning" />;
      case 'low_battery':
        return <CIcon icon={cilWarning} className="me-2 text-danger" />;
      case 'sos_signal':
        return <CIcon icon={cilBell} className="me-2 text-danger" />;
      default:
        return <CIcon icon={cilInfo} className="me-2 text-info" />;
    }
  };

  const renderNotificationContent = (notification) => {
    const { data } = notification;
    if (!data) {
      console.error('Invalid notification format: ', notification);
      return <div>Некорректное сообщение</div>;
    }

    const { employee, timestamp, message, zone } = data;

    return (
      <div>
        <div>{message || 'Отклик от маяка'} {zone && `(${zone})`}</div>
        {employee && <div>Сотрудник: {employee}</div>}
        <small className="text-muted d-block">
          {timestamp ? new Date(timestamp).toLocaleString() : 'Время не указано'}
        </small>
      </div>
    );
  };

  return (
    <>
      {notifications.length === 0 && (
        <CAlert color="info">
          Нет доступных уведомлений
        </CAlert>
      )}
      <CListGroup className="drop-down-custom">
        {notifications.map((notification, index) => (
          <CListGroupItem key={index} className="d-flex">
            {renderNotificationIcon(notification.data.event_type)}
            {renderNotificationContent(notification)}
          </CListGroupItem>
        ))}
      </CListGroup>
      <div>
        <h5>Logs</h5>
        <CListGroup>
          {logs.map((log, index) => (
            <CListGroupItem key={index}>
              <div>{log.timestamp}</div>
              <pre>{log.message}</pre>
            </CListGroupItem>
          ))}
        </CListGroup>
      </div>
    </>
  );
};

AllNotifications.propTypes = {
  showOffcanvas: PropTypes.bool.isRequired,
  setShowOffcanvas: PropTypes.func.isRequired,
};

export default AllNotifications;
