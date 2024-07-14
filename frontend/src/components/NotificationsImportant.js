import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CRow,
  CCol,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilBell,
  cilInfo,
  cilWarning,
  cilUserFollow,
  cilUserUnfollow,
  cilCheckCircle,
  cilBurn,
} from '@coreui/icons';
import { useWebSocket } from '../context/WebSocketContext';

const NotificationsImportant = ({ setShowOffcanvas }) => {
  const notifications = useWebSocket();
  const [notificationCounts, setNotificationCounts] = useState({
    enter: 0,
    exit: 0,
    violation: 0,
    SOS_START: 0,
    SOS_STOP: 0,
    fall: 0,
  });

  const eventTypes = {
    enter: 'Вход',
    exit: 'Выход',
    violation: 'Нарушение',
    SOS_START: 'SOS-сигнал',
    SOS_STOP: 'Отмена SOS',
    fall: 'Падение',
  };

  useEffect(() => {
    const counts = {
      enter: 0,
      exit: 0,
      violation: 0,
      SOS_START: 0,
      SOS_STOP: 0,
      fall: 0,
    };

    notifications.forEach((notification) => {
      const event = notification.data.event_type || notification.data.event;
      if (counts[event] !== undefined) {
        counts[event] += 1;
      }
    });

    setNotificationCounts(counts);
  }, [notifications]);

  const renderNotificationIcon = (type) => {
    switch (type) {
      case 'enter':
        return <CIcon icon={cilUserFollow} className="me-2 text-success" />;
      case 'exit':
        return <CIcon icon={cilUserUnfollow} className="me-2 text-danger" />;
      case 'violation':
        return <CIcon icon={cilWarning} className="me-2 text-warning" />;
      case 'SOS_START':
        return <CIcon icon={cilWarning} className="me-2 text-danger" />;
      case 'SOS_STOP':
        return <CIcon icon={cilCheckCircle} className="me-2 text-success" />;
      case 'fall':
        return <CIcon icon={cilBurn} className="me-2 text-danger" />;
      default:
        return <CIcon icon={cilInfo} className="me-2 text-info" />;
    }
  };

  return (
    <>
      <CDropdown className="m-2">
        <CDropdownToggle color="white" className="position-relative">
          <CIcon icon={cilBell} size="lg" />
          {(notificationCounts.enter + notificationCounts.exit + notificationCounts.violation +
            notificationCounts.SOS_START + notificationCounts.SOS_STOP + notificationCounts.fall) > 0 && (
            <CBadge
              shape="pill"
              color="danger"
              className="position-absolute top-0 start-100 translate-middle"
            >
              {notificationCounts.enter + notificationCounts.exit + notificationCounts.violation +
                notificationCounts.SOS_START + notificationCounts.SOS_STOP + notificationCounts.fall}
            </CBadge>
          )}
        </CDropdownToggle>
        <CDropdownMenu>
          <CRow className="p-2">
            <CCol xs="12">
              <CDropdownItem header>Уведомления</CDropdownItem>
            </CCol>
            <CCol xs="12">
              {Object.keys(notificationCounts).map((type) => (
                <CDropdownItem key={type} className="d-flex align-items-center">
                  {renderNotificationIcon(type)}
                  <span className="flex-grow-1">{eventTypes[type]}</span>
                  <CBadge color="primary" className="ms-2">{notificationCounts[type]}</CBadge>
                </CDropdownItem>
              ))}
            </CCol>
            <CCol xs="12">
              <CDropdownItem divider />
              <CDropdownItem href={window.location.href} onClick={() => setShowOffcanvas(true)}>
                Просмотреть все
              </CDropdownItem>
            </CCol>
          </CRow>
        </CDropdownMenu>
      </CDropdown>
    </>
  );
};

NotificationsImportant.propTypes = {
  setShowOffcanvas: PropTypes.func.isRequired,
};

export default NotificationsImportant;
