-- Для таблицы devices
CREATE TABLE IF NOT EXISTS devices (
    id SERIAL PRIMARY KEY,
    fw_version VARCHAR(255),
    nfc_uid VARCHAR(255),
    imei VARCHAR(255) UNIQUE,
    mac_uwb VARCHAR(255),
    ip VARCHAR(255)
);

-- Для таблицы device_gnss_positions
CREATE TABLE IF NOT EXISTS device_gnss_positions (
    id SERIAL PRIMARY KEY,
    device_id INT,
    timestamp TIMESTAMP,
    latitude FLOAT,
    longitude FLOAT,
    height FLOAT,
    sat_quantity INT,
    hdop FLOAT,
    vdop FLOAT,
    UNIQUE(device_id, timestamp)
);

-- Для таблицы device_zone_positions
CREATE TABLE IF NOT EXISTS device_zone_positions (
    id SERIAL PRIMARY KEY,
    device_id INT,
    beacon_mac VARCHAR(255),
    timestamp TIMESTAMP,
    rssi INT,
    temperature FLOAT,
    pressure FLOAT,
    UNIQUE(device_id, beacon_mac, timestamp)
);

