import React from 'react';
import CIcon from '@coreui/icons-react';
import { cilSpeedometer, cilMap, cilNotes, cilUser, cilSettings, cilPeople, cilLayers, cilList, cilChartLine, cilWarning } from '@coreui/icons';
import { CNavItem, CNavTitle } from '@coreui/react';

const _nav = [
  {
    component: CNavItem,
    name: 'Инфопанель',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Карта и мониторинг',
    to: '/monitoring',
    icon: <CIcon icon={cilMap} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'ОТЧЕТЫ',
  },
  {
    component: CNavItem,
    name: 'Отчеты',
    to: '/reports',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'НАСТРОЙКИ',
  },
  {
    component: CNavItem,
    name: 'Пользователи',
    to: '/users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Сотрудники',
    to: '/employees',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Планы и зоны',
    to: '/plans-and-zones',
    icon: <CIcon icon={cilMap} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Общие настройки',
    to: '/general-settings',
    icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Настройки системы',
    to: '/system-settings',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'МОДУЛИ',
  },
  {
    component: CNavItem,
    name: 'Диспетчеризация и контроль',
    to: '/dispatch-control',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Мониторинг оборудования',
    to: '/equipment-monitoring',
    icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Контроль техники',
    to: '/proximity-control',
    icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Организация эвакуации',
    to: '/evacuation-organization',
    icon: <CIcon icon={cilWarning} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Интеграция с ERP',
    to: '/reports-erp-integration',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
];

export default _nav;
