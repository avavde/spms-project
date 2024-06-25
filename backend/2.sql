DROP TABLE IF EXISTS "DepartmentZones" CASCADE;
DROP TABLE IF EXISTS "Employees" CASCADE;
DROP TABLE IF EXISTS "EmployeeZones" CASCADE;
DROP TABLE IF EXISTS "GNSSPositions" CASCADE;
DROP TABLE IF EXISTS "Movements" CASCADE;
DROP TABLE IF EXISTS "Users" CASCADE;
DROP TABLE IF EXISTS "UserActions" CASCADE;
DROP TABLE IF EXISTS "Zones" CASCADE;
DROP TABLE IF EXISTS "Departments" CASCADE;
DROP TABLE IF EXISTS "Devices" CASCADE;
DROP TABLE IF EXISTS "DeviceZonePositions" CASCADE;
CREATE TABLE "Departments" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "description" VARCHAR(255)
);

CREATE TABLE "Zones" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "description" VARCHAR(255),
  "department_id" INTEGER NOT NULL REFERENCES "Departments"("id")
);

CREATE TABLE "DepartmentZones" (
  "id" SERIAL PRIMARY KEY,
  "department_id" INTEGER NOT NULL REFERENCES "Departments"("id"),
  "zone_id" INTEGER NOT NULL REFERENCES "Zones"("id")
);

CREATE TABLE "Devices" (
  "id" VARCHAR(255) PRIMARY KEY,
  "fw_version" VARCHAR(255),
  "nfc_uid" VARCHAR(255),
  "imei" VARCHAR(255),
  "mac_uwb" VARCHAR(255),
  "ip" VARCHAR(255),
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "DeviceZonePositions" (
  "id" SERIAL PRIMARY KEY,
  "deviceId" VARCHAR(255) REFERENCES "Devices"("id"),
  "zoneId" INTEGER REFERENCES "Zones"("id"),
  "timestamp" TIMESTAMP NOT NULL,
  "rssi" FLOAT NOT NULL,
  "temperature" FLOAT NOT NULL,
  "pressure" FLOAT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Employees" (
  "id" SERIAL PRIMARY KEY,
  "first_name" VARCHAR(255) NOT NULL,
  "last_name" VARCHAR(255) NOT NULL,
  "middle_name" VARCHAR(255),
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "phone" VARCHAR(255) UNIQUE NOT NULL,
  "department_id" INTEGER NOT NULL REFERENCES "Departments"("id")
);

CREATE TABLE "EmployeeZones" (
  "id" SERIAL PRIMARY KEY,
  "employee_id" INTEGER NOT NULL REFERENCES "Employees"("id"),
  "zone_id" INTEGER NOT NULL REFERENCES "Zones"("id")
);

CREATE TABLE "GNSSPositions" (
  "id" SERIAL PRIMARY KEY,
  "deviceId" VARCHAR(255) REFERENCES "Devices"("id"),
  "timestamp" TIMESTAMP NOT NULL,
  "latitude" FLOAT NOT NULL,
  "longitude" FLOAT NOT NULL,
  "height" FLOAT NOT NULL,
  "satQuantity" INTEGER NOT NULL,
  "hdop" FLOAT NOT NULL,
  "vdop" FLOAT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Movements" (
  "id" SERIAL PRIMARY KEY,
  "device_id" VARCHAR(255) REFERENCES "Devices"("id"),
  "timestamp" TIMESTAMP NOT NULL,
  "latitude" FLOAT NOT NULL,
  "longitude" FLOAT NOT NULL,
  "altitude" FLOAT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Users" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR(255) UNIQUE NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "first_name" VARCHAR(255),
  "last_name" VARCHAR(255),
  "middle_name" VARCHAR(255),
  "email" VARCHAR(255) UNIQUE,
  "phone" VARCHAR(255),
  "role" VARCHAR(255),
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "UserActions" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "Users"("id"),
  "action" VARCHAR(255) NOT NULL,
  "timestamp" TIMESTAMP NOT NULL
);

