-- Удаление существующих таблиц
DROP TABLE IF EXISTS employee_zones CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS device_zone_positions CASCADE;
DROP TABLE IF EXISTS gnss_positions CASCADE;
DROP TABLE IF EXISTS movements CASCADE;
DROP TABLE IF EXISTS user_actions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS department_zones CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS beacons CASCADE;
DROP TABLE IF EXISTS device_events CASCADE;
DROP TABLE IF EXISTS device_self_tests CASCADE;
DROP TABLE IF EXISTS device_statuses CASCADE;
DROP TABLE IF EXISTS devices CASCADE;
DROP TABLE IF EXISTS zones CASCADE;

-- Создание таблицы zones первой
CREATE TABLE zones (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Создание остальных таблиц
CREATE TABLE beacons (
    id SERIAL PRIMARY KEY,
    zone_id INTEGER NOT NULL,
    beacon_mac VARCHAR(255) NOT NULL,
    FOREIGN KEY (zone_id) REFERENCES zones(id)
);

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE department_zones (
    id SERIAL PRIMARY KEY,
    department_id INTEGER NOT NULL,
    zone_id INTEGER NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (zone_id) REFERENCES zones(id)
);

CREATE TABLE devices (
    id VARCHAR(255) PRIMARY KEY,
    fw_version VARCHAR(255),
    nfc_uid VARCHAR(255),
    imei VARCHAR(255),
    mac_uwb VARCHAR(255),
    ip VARCHAR(255),
    devicetype VARCHAR(255),
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE device_events (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    event VARCHAR(255),
    sync VARCHAR(255),
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(id)
);

CREATE TABLE device_self_tests (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(255) NOT NULL,
    result TEXT,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(id)
);

CREATE TABLE device_statuses (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    battery VARCHAR(255),
    sos BOOLEAN,
    gps BOOLEAN,
    beacons BOOLEAN,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(id)
);

CREATE TABLE device_zone_positions (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(255) NOT NULL,
    zone_id INTEGER NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    rssi DOUBLE PRECISION,
    temperature DOUBLE PRECISION,
    pressure DOUBLE PRECISION,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(id),
    FOREIGN KEY (zone_id) REFERENCES zones(id)
);

CREATE TABLE gnss_positions (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    height DOUBLE PRECISION,
    sat_quantity INTEGER,
    hdop DOUBLE PRECISION,
    vdop DOUBLE PRECISION,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(id)
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(255) UNIQUE NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE employee_zones (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL,
    zone_id INTEGER NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (zone_id) REFERENCES zones(id)
);

CREATE TABLE movements (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(255) NOT NULL,
    from_zone_id INTEGER NOT NULL,
    to_zone_id INTEGER NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(id),
    FOREIGN KEY (from_zone_id) REFERENCES zones(id),
    FOREIGN KEY (to_zone_id) REFERENCES zones(id)
);

CREATE TABLE users (
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

CREATE TABLE user_actions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    action VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

