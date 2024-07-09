// src/routes.js

import React from 'react';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const Monitoring = React.lazy(() => import('./views/monitoring/Monitoring'));
const Reports = React.lazy(() => import('./views/reports/Reports'));
const Users = React.lazy(() => import('./views/admin/Users'));
const Employees = React.lazy(() => import('./views/admin/Employees'));
const PlansAndZones = React.lazy(() => import('./views/admin/PlansAndZones'));
const GeneralSettings = React.lazy(() => import('./views/admin/GeneralSettings'));
const SystemSettings = React.lazy(() => import('./views/admin/SystemSettings'));
const DispatchControl = React.lazy(() => import('./views/dispatch/DispatchControl'));
const EquipmentMonitoring = React.lazy(() => import('./views/equipment/EquipmentMonitoring'));
const EvacuationOrganization = React.lazy(() => import('./views/safety/EvacuationOrganization'));
const ReportsERPIntegration = React.lazy(() => import('./views/reports/ReportsERPIntegration'));
const EmployeeEditPage = React.lazy(() => import('./views/pages/EmployeeEditPage'));

const routes = [
  { path: '/', exact: true, name: 'Главная' },
  { path: '/dashboard', name: 'Инфопанель', element: Dashboard },
  { path: '/monitoring', name: 'Карта и мониторинг', element: Monitoring },
  { path: '/reports', name: 'Отчеты', element: Reports },
  { path: '/users', name: 'Пользователи', element: Users },
  { path: '/employees', name: 'Сотрудники', element: Employees },
  { path: '/plans-and-zones', name: 'Планы и зоны', element: PlansAndZones },
  { path: '/general-settings', name: 'Общие настройки', element: GeneralSettings },
  { path: '/system-settings', name: 'Системные настройки', element: SystemSettings },
  { path: '/dispatch-control', name: 'Диспетчеризация и контроль', element: DispatchControl },
  { path: '/equipment-monitoring', name: 'Мониторинг оборудования', element: EquipmentMonitoring },
  { path: '/evacuation-organization', name: 'Организация эвакуации', element: EvacuationOrganization },
  { path: '/reports-erp-integration', name: 'Интеграция с ERP', element: ReportsERPIntegration },
  { path: '/employee/edit/:id', name: 'Редактирование сотрудника', element: EmployeeEditPage },
];

export default routes;
