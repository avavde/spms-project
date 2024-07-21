const Beacon = require('./Beacon');
const BeaconFloorPlan = require('./BeaconFloorPlan');
const Building = require('./Building');
const Department = require('./Department');
const DepartmentZone = require('./DepartmentZone');
const Device = require('./Device');
const DeviceEvent = require('./DeviceEvent');
const DeviceSelfTest = require('./DeviceSelfTest');
const DeviceStatus = require('./DeviceStatus');
const DeviceZonePosition = require('./DeviceZonePosition');
const Employee = require('./Employee');
const EmployeeZone = require('./EmployeeZone');
const EmployeeZoneAssignment = require('./EmployeeZoneAssignment');
const FloorPlan = require('./FloorPlan');
const GNSSPosition = require('./GNSSPosition');
const Movement = require('./Movement');
const Report = require('./Report');
const User = require('./User');
const UserAction = require('./UserAction');
const Zone = require('./Zone');
const ZoneEvent = require('./ZoneEvent');
const ZoneViolation = require('./ZoneViolation');

// Define associations
Beacon.belongsTo(FloorPlan, { foreignKey: 'floor_id' });
Beacon.belongsTo(Zone, { foreignKey: 'zone_id', onDelete: 'CASCADE' });

BeaconFloorPlan.belongsTo(Building, { foreignKey: 'building_id' });

Building.hasMany(FloorPlan, { foreignKey: 'building_id', onDelete: 'CASCADE' });

DepartmentZone.belongsTo(Department, { foreignKey: 'department_id' });
DepartmentZone.belongsTo(Zone, { foreignKey: 'zone_id', onDelete: 'CASCADE' });

Employee.belongsTo(Department, { foreignKey: 'department_id' });
Employee.belongsTo(Device, { foreignKey: 'beaconid', targetKey: 'id' });

EmployeeZone.belongsTo(Employee, { foreignKey: 'employee_id' });
EmployeeZone.belongsTo(Zone, { foreignKey: 'zone_id', onDelete: 'CASCADE' });

EmployeeZoneAssignment.belongsTo(Employee, { foreignKey: 'employee_id' });
EmployeeZoneAssignment.belongsTo(Zone, { foreignKey: 'zone_id', onDelete: 'CASCADE' });

FloorPlan.belongsTo(Building, { foreignKey: 'building_id' });

Zone.belongsTo(Department, { foreignKey: 'department_id' });
Zone.belongsTo(FloorPlan, { foreignKey: 'floor_id' });
Zone.hasMany(Beacon, { foreignKey: 'zone_id', onDelete: 'CASCADE' });

ZoneEvent.belongsTo(Employee, { foreignKey: 'employee_id' });
ZoneEvent.belongsTo(Zone, { foreignKey: 'zone_id', onDelete: 'CASCADE' });

ZoneViolation.belongsTo(Employee, { foreignKey: 'employee_id' });

UserAction.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  Beacon,
  BeaconFloorPlan,
  Building,
  Department,
  DepartmentZone,
  Device,
  DeviceEvent,
  DeviceSelfTest,
  DeviceStatus,
  DeviceZonePosition,
  Employee,
  EmployeeZone,
  EmployeeZoneAssignment,
  FloorPlan,
  GNSSPosition,
  Movement,
  Report,
  User,
  UserAction,
  Zone,
  ZoneEvent,
  ZoneViolation,
};
