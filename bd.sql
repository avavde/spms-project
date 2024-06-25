CREATE TABLE IF NOT EXISTS devices (
  id SERIAL PRIMARY KEY,
  fw_version VARCHAR(50),
  nfc_uid VARCHAR(50),
  imei VARCHAR(50) UNIQUE,
  mac_uwb VARCHAR(50),
  ip VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS device_self_tests (
  id SERIAL PRIMARY KEY,
  device_id INTEGER REFERENCES devices(id),
  result JSONB
);

CREATE TABLE IF NOT EXISTS device_statuses (
  id SERIAL PRIMARY KEY,
  device_id INTEGER REFERENCES devices(id),
  timestamp TIMESTAMP,
  battery VARCHAR(10),
  sos BOOLEAN,
  gps BOOLEAN,
  beacons BOOLEAN,
  UNIQUE(device_id, timestamp)
);

CREATE TABLE IF NOT EXISTS device_events (
  id SERIAL PRIMARY KEY,
  device_id INTEGER REFERENCES devices(id),
  timestamp TIMESTAMP,
  event VARCHAR(255),
  sync VARCHAR(10),
  UNIQUE(device_id, timestamp)
);

CREATE TABLE IF NOT EXISTS device_zone_positions (
  id SERIAL PRIMARY KEY,
  device_id INTEGER REFERENCES devices(id),
  beacon_mac VARCHAR(50),
  timestamp TIMESTAMP,
  rssi INTEGER,
  temperature FLOAT,
  pressure FLOAT,
  UNIQUE(device_id, beacon_mac, timestamp)
);

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
  UNIQUE(device_id, timestamp)
);

