// src/data/reportsData.js

export const beaconReports = [
    {
      beaconId: 'маяк-001',
      batteryLevel: '80%',
      status: 'активен',
      lastSignal: '2024-06-01 12:00:00',
    },
    {
      beaconId: 'маяк-002',
      batteryLevel: '50%',
      status: 'неактивен',
      lastSignal: '2024-06-01 11:00:00',
    },
    {
      beaconId: 'маяк-003',
      batteryLevel: '30%',
      status: 'активен',
      lastSignal: '2024-06-01 10:00:00',
    },
  ];
  
  
  export const employeeReports = [
    {
      employeeId: 'сотрудник-001',
      name: 'Иван Иванов',
      movements: [
        { zone: 'Зона А', enterTime: '2024-06-01 08:00:00', exitTime: '2024-06-01 12:00:00', duration: '4 часа' },
        { zone: 'Зона Б', enterTime: '2024-06-01 13:00:00', exitTime: '2024-06-01 17:00:00', duration: '4 часа' },
      ],
      dangerZoneVisits: 2,
    },
    {
      employeeId: 'сотрудник-002',
      name: 'Анна Смирнова',
      movements: [
        { zone: 'Зона В', enterTime: '2024-06-01 09:00:00', exitTime: '2024-06-01 15:00:00', duration: '6 часов' },
      ],
      dangerZoneVisits: 0,
    },
    {
      employeeId: 'сотрудник-003',
      name: 'Петр Петров',
      movements: [
        { zone: 'Зона А', enterTime: '2024-06-01 08:30:00', exitTime: '2024-06-01 16:30:00', duration: '8 часов' },
      ],
      dangerZoneVisits: 1,
    },
  ];
  
  export const eventReports = [
    {
      eventId: 'событие-001',
      type: 'Техническое обслуживание',
      time: '2024-06-01 10:00:00',
      zone: 'Зона А',
      description: 'Плановое техническое обслуживание',
    },
    {
      eventId: 'событие-002',
      type: 'Инспекция',
      time: '2024-06-01 11:00:00',
      zone: 'Зона Б',
      description: 'Проверка безопасности',
    },
    {
      eventId: 'событие-003',
      type: 'Поломка',
      time: '2024-06-01 12:00:00',
      zone: 'Зона В',
      description: 'Поломка оборудования',
    },
  ];
  
  export const zoneReports = [
    {
      zone: 'Зона А',
      employeeCount: 3,
      totalDuration: '16 часов',
      employees: ['Иван Иванов', 'Петр Петров'],
    },
    {
      zone: 'Зона Б',
      employeeCount: 1,
      totalDuration: '4 часа',
      employees: ['Иван Иванов'],
    },
    {
      zone: 'Зона В',
      employeeCount: 1,
      totalDuration: '6 часов',
      employees: ['Анна Смирнова'],
    },
  ];
  
  
  export const movementReports = [
    {
      employeeId: 'сотрудник-001',
      name: 'Иван Иванов',
      movements: [
        { zone: 'Зона А', enterTime: '2024-06-01 08:00:00', exitTime: '2024-06-01 12:00:00', duration: '4 часа' },
        { zone: 'Зона Б', enterTime: '2024-06-01 13:00:00', exitTime: '2024-06-01 17:00:00', duration: '4 часа' },
      ],
    },
    {
      employeeId: 'сотрудник-002',
      name: 'Анна Смирнова',
      movements: [
        { zone: 'Зона В', enterTime: '2024-06-01 09:00:00', exitTime: '2024-06-01 15:00:00', duration: '6 часов' },
      ],
    },
    {
      employeeId: 'сотрудник-003',
      name: 'Петр Петров',
      movements: [
        { zone: 'Зона А', enterTime: '2024-06-01 08:30:00', exitTime: '2024-06-01 16:30:00', duration: '8 часов' },
      ],
    },
  ];

  
  export const entryExitReports = [
    {
      employeeId: 'сотрудник-001',
      name: 'Иван Иванов',
      entriesExits: [
        { type: 'вход', time: '2024-06-01 08:00:00', zone: 'Зона А' },
        { type: 'выход', time: '2024-06-01 12:00:00', zone: 'Зона А' },
        { type: 'вход', time: '2024-06-01 13:00:00', zone: 'Зона Б' },
        { type: 'выход', time: '2024-06-01 17:00:00', zone: 'Зона Б' },
      ],
    },
    {
      employeeId: 'сотрудник-002',
      name: 'Анна Смирнова',
      entriesExits: [
        { type: 'вход', time: '2024-06-01 09:00:00', zone: 'Зона В' },
        { type: 'выход', time: '2024-06-01 15:00:00', zone: 'Зона В' },
      ],
    },
    {
      employeeId: 'сотрудник-003',
      name: 'Петр Петров',
      entriesExits: [
        { type: 'вход', time: '2024-06-01 08:30:00', zone: 'Зона А' },
        { type: 'выход', time: '2024-06-01 16:30:00', zone: 'Зона А' },
      ],
    },
  ];
  