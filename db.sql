CREATE TABLE IF NOT EXISTS device_gnss_positions (
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

CREATE TABLE IF NOT EXISTS device_zone_positions (
    id SERIAL PRIMARY KEY,
    device_id INTEGER REFERENCES devices(id),
    beacon_mac VARCHAR(50),
    timestamp TIMESTAMP,
    rssi INTEGER,
    temperature FLOAT,
    pressure FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

