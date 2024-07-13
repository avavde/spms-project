import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CListGroup,
  CListGroupItem,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilInfo,
  cilWarning,
  cilUserFollow,
  cilUserUnfollow,
  cilCheckCircle,
} from '@coreui/icons'
import { initWebSocket, closeWebSocket } from '../services/webSocketService'

const NotificationsImportant = ({ setShowOffcanvas }) => {
  const [notifications, setNotifications] = useState([])
  const [sosAlert, setSosAlert] = useState(null)

  useEffect(() => {
    const handleNotification = (notification) => {
      setNotifications((prevNotifications) => [notification, ...prevNotifications])
      if (notification.event === 'SOS_START') {
        setSosAlert({
          type: 'danger',
          message: `${notification.employee} нажал кнопку SOS в зоне ${notification.zone_id} (${new Date(
            notification.timestamp
          ).toLocaleString()})`,
        })
      } else if (notification.event === 'SOS_STOP') {
        setSosAlert({
          type: 'success',
          message: `Сотрудник ${notification.employee} отменил SOS в зоне ${notification.zone_id} (${new Date(
            notification.timestamp
          ).toLocaleString()})`,
        })
      }
    }

    initWebSocket(handleNotification)

    return () => {
      closeWebSocket()
    }
  }, [])

  const renderNotificationIcon = (type) => {
    switch (type) {
      case 'enter':
        return <CIcon icon={cilUserFollow} className="me-2 text-success" />
      case 'exit':
        return <CIcon icon={cilUserUnfollow} className="me-2 text-danger" />
      case 'violation':
        return <CIcon icon={cilWarning} className="me-2 text-warning" />
      case 'SOS_START':
        return <CIcon icon={cilWarning} className="me-2 text-danger" />
      case 'SOS_STOP':
        return <CIcon icon={cilCheckCircle} className="me-2 text-success" />
      default:
        return <CIcon icon={cilInfo} className="me-2 text-info" />
    }
  }

  return (
    <>
      {sosAlert && (
        <CAlert color={sosAlert.type} closeButton onClose={() => setSosAlert(null)}>
          {sosAlert.message}
        </CAlert>
      )}
      <CDropdown className="m-2">
        <CDropdownToggle color="white" className="position-relative">
          <CIcon icon={cilBell} size="lg" />
          {notifications.length > 0 && (
            <CBadge
              shape="pill"
              color="danger"
              className="position-absolute top-0 start-100 translate-middle"
            >
              {notifications.length}
            </CBadge>
          )}
        </CDropdownToggle>
        <CDropdownMenu>
          <CListGroup className="drop-down-custom">
            {notifications.map((notification, index) => (
              <CListGroupItem key={index} className="d-flex">
                {renderNotificationIcon(notification.event)}
                <div>
                  <div>
                    {notification.message} (Zone: {notification.zone_id})
                  </div>
                  <small className="text-muted d-block">
                    {new Date(notification.timestamp).toLocaleString()}
                  </small>
                </div>
              </CListGroupItem>
            ))}
          </CListGroup>
          <CDropdownItem href="#" onClick={() => setShowOffcanvas(true)}>
            View All
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
    </>
  )
}

NotificationsImportant.propTypes = {
  setShowOffcanvas: PropTypes.func.isRequired,
}

export default NotificationsImportant
