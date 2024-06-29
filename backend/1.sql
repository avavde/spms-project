-- Удаляем существующие таблицы, если они существуют
DROP TABLE IF EXISTS user_actions CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS department_zones CASCADE;
DROP TABLE IF EXISTS device_positions CASCADE;
DROP TABLE IF EXISTS device_gnss_positions CASCADE;
DROP TABLE IF EXISTS device_zone_positions CASCADE;
DROP TABLE IF EXISTS device_statuses CASCADE;
DROP TABLE IF EXISTS device_events CASCADE;
DROP TABLE IF EXISTS device_self_tests CASCADE;
DROP TABLE IF EXISTS devices CASCADE;
DROP TABLE IF EXISTS zones CASCADE;
DROP TABLE IF EXISTS beacons CASCADE;
DROP TABLE IF EXISTS movements CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS devicetypes CASCADE;

-- Создаем таблицу users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    middle_name VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    role VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем таблицу user_actions
CREATE TABLE user_actions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action_type VARCHAR(50),
    description TEXT,
    timestamp TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем таблицу departments
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем таблицу department_zones
CREATE TABLE department_zones (
    id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES departments(id),
    zone_id INTEGER,
    allowed BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем таблицу zones
CREATE TABLE zones (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Создаем таблицу beacons
CREATE TABLE beacons (
    id SERIAL PRIMARY KEY,
    zone_id INTEGER NOT NULL REFERENCES zones(id) ON DELETE CASCADE,
    beacon_mac VARCHAR(255) NOT NULL,
    CONSTRAINT beacons_zone_id_beacon_mac_key UNIQUE (zone_id, beacon_mac)
);

-- Создаем таблицу devices
CREATE TABLE devices (
    id VARCHAR(255) PRIMARY KEY,
    fw_version VARCHAR(255),
    nfc_uid VARCHAR(255),
    imei VARCHAR(255),
    mac_uwb VARCHAR(255),
    ip VARCHAR(255),
    devicetype VARCHAR(50),
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем таблицу device_zone_positions
CREATE TABLE device_zone_positions (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(255) REFERENCES devices(id),
    zone_id INTEGER REFERENCES zones(id),
    timestamp TIMESTAMP NOT NULL,
    rssi DOUBLE PRECISION,
    temperature DOUBLE PRECISION,
    pressure DOUBLE PRECISION,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем таблицу device_statuses
CREATE TABLE device_statuses (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(255) REFERENCES devices(id),
    timestamp TIMESTAMP,
    battery VARCHAR(20),
    sos BOOLEAN,
    gps BOOLEAN,
    beacons BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем таблицу gnss_positions
CREATE TABLE gnss_positions (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(255) REFERENCES devices(id),
    timestamp TIMESTAMP,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    height DOUBLE PRECISION,
    sat_quantity INTEGER,
    hdop DOUBLE PRECISION,
    vdop DOUBLE PRECISION,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем таблицу device_events
CREATE TABLE device_events (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(255) REFERENCES devices(id),
    timestamp TIMESTAMP,
    event VARCHAR(50),
    sync VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем таблицу device_self_tests
CREATE TABLE device_self_tests (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(255) REFERENCES devices(id),
    result TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем таблицу movements
CREATE TABLE movements (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(255) NOT NULL REFERENCES devices(id),
    from_zone_id INTEGER NOT NULL REFERENCES zones(id),
    to_zone_id INTEGER NOT NULL REFERENCES zones(id),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаем таблицу employees
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    department_id INTEGER REFERENCES departments(id),
    position VARCHAR(100),
    device_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем таблицу devicetypes
CREATE TABLE devicetypes (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(255) NOT NULL,
    device_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

