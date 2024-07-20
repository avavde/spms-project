const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const departmentZoneRoutes = require('./routes/departmentZoneRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const employeeZoneRoutes = require('./routes/employeeZoneRoutes');
const movementRoutes = require('./routes/movementRoutes');
const userActionRoutes = require('./routes/userActionRoutes');
const zoneRoutes = require('./routes/zoneRoutes');
const deviceZoneRoutes = require('./routes/deviceZoneRoutes');
const gnssPositionRoutes = require('./routes/gnssPositionRoutes');
const deviceStatusRoutes = require('./routes/deviceStatusRoutes');
const deviceEventRoutes = require('./routes/deviceEventRoutes');
const deviceSelfTestRoutes = require('./routes/deviceSelfTestRoutes');
const mqttClient = require('./mqttClient');
const websocketServer = require('./websocketServer');
const beaconRoutes = require('./routes/beaconRoutes');
const employeeZoneAssignmentRoutes = require('./routes/employeeZoneAssignmentRoutes');
const reportRoutes = require('./routes/reportRoutes');
const sosRoutes = require('./routes/sosRoutes');
const cancelSosRoutes = require('./routes/cancelSosRoutes');
const buildingRoutes = require('./routes/buildingRoutes');
const floorPlanRoutes = require('./routes/floorPlanRoutes');
const beaconFloorPlanRoutes = require('./routes/beaconFloorPlanRoutes');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/cancel-sos', cancelSosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/department-zones', departmentZoneRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/employee-zones', employeeZoneRoutes);
app.use('/api/employee-zone-assignments', employeeZoneAssignmentRoutes);
app.use('/api/movements', movementRoutes);
app.use('/api/user-actions', userActionRoutes);
app.use('/api/zones', zoneRoutes);
app.use('/api/device-zones', deviceZoneRoutes);
app.use('/api/gnss_positions', gnssPositionRoutes);
app.use('/api/device-statuses', deviceStatusRoutes);
app.use('/api/device-events', deviceEventRoutes);
app.use('/api/device-self-tests', deviceSelfTestRoutes);
app.use('/api/beacons', beaconRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/send-sos', sosRoutes);
app.use('/api/buildings', buildingRoutes);
app.use('/api/beacon-floor-plans', beaconFloorPlanRoutes);
app.use('/api/floor-plans', floorPlanRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});


sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
