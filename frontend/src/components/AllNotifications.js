import React, { useEffect, useState } from 'react';
import { CListGroup, CListGroupItem, CAlert, CButton } from '@coreui/react';
import PropTypes from 'prop-types';
import CIcon from '@coreui/icons-react';
import { cilBell, cilInfo, cilWarning, cilUserFollow, cilUserUnfollow, cilBurn } from '@coreui/icons';
import { useWebSocket } from '../context/WebSocketContext';
import EmployeeLocationModal from './EmployeeLocationModal';

const AllNotifications = () => {
  const notifications = useWebSocket();
  const [limitedNotifications, setLimitedNotifications] = useState([]);
  const [logs, setLogs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    setLimitedNotifications((prevNotifications) => {
      const newNotifications = [
        ...prevNotifications,
        ...notifications
      ];
      // Ограничиваем количество уведомлений до 20
      return newNotifications.slice(-20);
    });

    setLogs((prevLogs) => {
      const newLogs = [
        ...prevLogs,
        ...notifications.map((notification) => ({
          timestamp: new Date().toLocaleString(),
          message: JSON.stringify(notification),
        }))
      ];
      // Ограничиваем количество логов до 20
      return newLogs.slice(-20);
    });
  }, [notifications]);

  const getAlertColor = (eventType) => {
    switch (eventType) {
      case 'violation':
      case 'вошел в запрещенную зону':
        return 'warning';
      case 'sos_signal':
      case 'fall':
      case 'SOS_START':
      case 'FALL':
        return 'danger';
      case 'sos_stop':
      case 'SOS_STOP':
        return 'success';
      default:
        return 'info';
    }
  };

  const getIcon = (eventType) => {
    switch (eventType) {
      case 'enter':
        return cilUserFollow;
      case 'exit':
        return cilUserUnfollow;
      case 'violation':
      case 'вошел в запрещенную зону':
        return cilWarning;
      case 'low_battery':
        return cilWarning;
      case 'sos_signal':
      case 'SOS_START':
        return cilBell;
      case 'fall':
      case 'FALL':
        return cilBurn;
      default:
        return cilInfo;
    }
  };

  const handleShowModal = (employeeId) => {
    setSelectedEmployee(employeeId);
    setModalVisible(true);
  };

  const renderNotificationContent = (notification) => {
    const { data } = notification;
    if (!data) {
      console.error('Invalid notification format: ', notification);
      return <div>Некорректное сообщение</div>;
    }

    const { employee, employee_id, timestamp, message, zone_name, event_type, event } = data;
    const alertColor = getAlertColor(event_type || event);
    const icon = getIcon(event_type || event);

    let informativeMessage;
    switch (event_type || event) {
      case 'violation':
        informativeMessage = `Сотрудник ${employee} нарушил зону ${zone_name}.`;
        break;
      case 'вошел в запрещенную зону':
        informativeMessage = `Сотрудник ${employee} вошел в запрещенную зону ${zone_name}.`;
        break;
      case 'sos_signal':
      case 'SOS_START':
        informativeMessage = `Сотрудник ${employee} послал сигнал SOS!`;
        break;
      case 'fall':
      case 'FALL':
        informativeMessage = `Сотрудник ${employee} упал!`;
        break;
      case 'sos_stop':
      case 'SOS_STOP':
        informativeMessage = `Сотрудник ${employee} отменил сигнал SOS.`;
        break;
      default:
        informativeMessage = message || 'Отклик от маяка';
    }

    return (
      <CAlert color={alertColor} className="d-flex align-items-center">
        <CIcon icon={icon} className="me-2" />
        <div>
          <div>
            {informativeMessage} {zone_name && `(${zone_name})`}
          </div>
          {employee && <div>Сотрудник: {employee}</div>}
          <small className="text-muted d-block">
            {timestamp ? new Date(timestamp).toLocaleString() : 'Время не указано'}
          </small>
          {(event_type === 'sos_signal' || event_type === 'fall' || event === 'SOS_START' || event === 'FALL' || event_type === 'вошел в запрещенную зону') && (
            <CButton color="link" onClick={() => handleShowModal(employee_id)}>
              Показать на карте
            </CButton>
          )}
        </div>
      </CAlert>
    );
  };

  return (
    <>
      {limitedNotifications.length === 0 && (
        <CAlert color="info">
          Нет доступных уведомлений
        </CAlert>
      )}
      <CListGroup className="drop-down-custom">
        {limitedNotifications.map((notification, index) => (
          <CListGroupItem key={index} className="d-flex">
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

      <EmployeeLocationModal
        employeeId={selectedEmployee}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};

AllNotifications.propTypes = {
  showOffcanvas: PropTypes.bool.isRequired,
  setShowOffcanvas: PropTypes.func.isRequired,
};

export default AllNotifications;
