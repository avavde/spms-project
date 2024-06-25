-- Изменение типа данных для столбца id в таблице devices
ALTER TABLE devices ALTER COLUMN id TYPE character varying(255);

-- Исправление связанных таблиц
ALTER TABLE device_zone_positions ALTER COLUMN device_id TYPE character varying(255);
ALTER TABLE gnss_positions ALTER COLUMN device_id TYPE character varying(255);
ALTER TABLE movements ALTER COLUMN device_id TYPE character varying(255);

