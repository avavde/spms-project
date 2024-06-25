CREATE TABLE device_zone_positions (
  id SERIAL PRIMARY KEY,
  device_id INTEGER NOT NULL,
  zone_id INTEGER NOT NULL,
  UNIQUE (device_id, zone_id)
);

