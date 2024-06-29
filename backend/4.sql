-- Создание таблицы Departments
CREATE TABLE Departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255)
);

-- Создание таблицы Zones
CREATE TABLE Zones (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  department_id INTEGER NOT NULL,
  FOREIGN KEY (department_id) REFERENCES Departments(id)
);

-- Создание таблицы Beacons
CREATE TABLE Beacons (
  id SERIAL PRIMARY KEY,
  zoneId INTEGER NOT NULL,
  beacon_mac VARCHAR(255) NOT NULL,
  FOREIGN KEY (zoneId) REFERENCES Zones(id)
);

-- Создание таблицы DepartmentZones
CREATE TABLE DepartmentZones (
  id SERIAL PRIMARY KEY,
  department_id INTEGER NOT NULL,
  zone_id INTEGER NOT NULL,
  FOREIGN KEY (department_id) REFERENCES Departments(id),
  FOREIGN KEY (zone_id) REFERENCES Zones(id)
);

-- Создание таблицы Devices
CREATE TABLE Devices (
  id VARCHAR(255) PRIMARY KEY,
  fw_version VARCHAR(255),
  nfc_uid VARCHAR(255),
  imei VARCHAR(255),
  mac_uwb VARCHAR(255),
  ip VARCHAR(255),
  devicetype VARCHAR(255),
  createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы DeviceEvents
CREATE TABLE DeviceEvents (
  id SERIAL PRIMARY KEY,
  deviceId VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  event VARCHAR(255),
  sync VARCHAR(255),
  createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (deviceId) REFERENCES Devices(id)
);

-- Создание таблицы DeviceSelfTests
CREATE TABLE DeviceSelfTests (
  id SERIAL PRIMARY KEY,
  deviceId VARCHAR(255) NOT NULL,
  result TEXT,
  createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (deviceId) REFERENCES Devices(id)
);

-- Создание таблицы DeviceStatuses
CREATE TABLE DeviceStatuses (
  id SERIAL PRIMARY KEY,
  deviceId VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  battery VARCHAR(255),
  sos BOOLEAN,
  gps BOOLEAN,
  beacons BOOLEAN,
  createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (deviceId) REFERENCES Devices(id)
);

-- Создание таблицы DeviceZonePositions
CREATE TABLE DeviceZonePositions (
  id SERIAL PRIMARY KEY,
  deviceId VARCHAR(255) NOT NULL,
  zoneId INTEGER NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  rssi DOUBLE PRECISION,
  temperature DOUBLE PRECISION,
  pressure DOUBLE PRECISION,
  createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (deviceId) REFERENCES Devices(id),
  FOREIGN KEY (zoneId) REFERENCES Zones(id)
);

-- Создание таблицы Employees
CREATE TABLE Employees (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  middle_name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(255) UNIQUE NOT NULL,
  department_id INTEGER NOT NULL,
  FOREIGN KEY (department_id) REFERENCES Departments(id)
);

-- Создание таблицы EmployeeZones
CREATE TABLE EmployeeZones (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL,
  zone_id INTEGER NOT NULL,
  FOREIGN KEY (employee_id) REFERENCES Employees(id),
  FOREIGN KEY (zone_id) REFERENCES Zones(id)
);

-- Создание таблицы GNSSPositions
CREATE TABLE GNSSPositions (
  id SERIAL PRIMARY KEY,
  deviceId VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  height DOUBLE PRECISION,
  sat_quantity INTEGER,
  hdop DOUBLE PRECISION,
  vdop DOUBLE PRECISION,
  createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (deviceId) REFERENCES Devices(id)
);

-- Создание таблицы Movements
CREATE TABLE Movements (
  id SERIAL PRIMARY KEY,
  deviceId VARCHAR(255) NOT NULL,
  from_zone_id INTEGER NOT NULL,
  to_zone_id INTEGER NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  createdat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedat TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (deviceId) REFERENCES Devices(id),
  FOREIGN KEY (from_zone_id) REFERENCES Zones(id),
  FOREIGN KEY (to_zone_id) REFERENCES Zones(id)
);

-- Создание таблицы Users
CREATE TABLE Users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  middle_name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(255),
  role VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы UserActions
CREATE TABLE UserActions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  action VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Users(id)
);

