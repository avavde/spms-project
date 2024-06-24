-- departments table
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- devices table
CREATE TABLE devices (
    id SERIAL PRIMARY KEY,
    fw_version VARCHAR(50),
    nfc_uid VARCHAR(50),
    imei VARCHAR(50),
    mac_uwb VARCHAR(50),
    ip VARCHAR(50),
    mac_address VARCHAR(50),
    hwid VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- zones table
CREATE TABLE zones (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    type VARCHAR(50),
    coordinates JSON,
    beacons VARCHAR[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
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

-- employees table
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    department_id INTEGER REFERENCES departments(id),
    position VARCHAR(100),
    device_id INTEGER REFERENCES devices(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- movements table
CREATE TABLE movements (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    zone_id INTEGER REFERENCES zones(id),
    beacon_id INTEGER REFERENCES devices(id),
    timestamp TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- user_actions table
CREATE TABLE user_actions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action_type VARCHAR(50),
    description TEXT,
    timestamp TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- department_zones table
CREATE TABLE department_zones (
    id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES departments(id),
    zone_id INTEGER REFERENCES zones(id),
    allowed BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- employee_zones table
CREATE TABLE employee_zones (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    zone_id INTEGER REFERENCES zones(id),
    allowed BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- device_positions table
CREATE TABLE device_positions (
    id SERIAL PRIMARY KEY,
    device_id INTEGER REFERENCES devices(id),
    timestamp TIMESTAMP,
    latitude FLOAT,
    longitude FLOAT,
    height FLOAT,
    sat_quantity INTEGER,
    hdop FLOAT,
    vdop FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
