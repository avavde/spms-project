const express = require('express');
const bodyParser = require('body-parser');
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
const deviceStatusRoutes = require('./routes/deviceStatusRoutes'); // Новый маршрут
const deviceEventRoutes = require('./routes/deviceEventRoutes'); // Новый маршрут
const deviceSelfTestRoutes = require('./routes/deviceSelfTestRoutes'); // Новый маршрут
const mqttClient = require('./mqttClient');
const websocketServer = require('./websocketServer');

const app = express();
const server = require('http').createServer(app);
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/department-zones', departmentZoneRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/employee-zones', employeeZoneRoutes);
app.use('/api/movements', movementRoutes);
app.use('/api/user-actions', userActionRoutes);
app.use('/api/zones', zoneRoutes);
app.use('/api/device-zones', deviceZoneRoutes);
app.use('/api/gnss_positions', gnssPositionRoutes);
app.use('/api/device-statuses', deviceStatusRoutes); // Новый маршрут
app.use('/api/device-events', deviceEventRoutes); // Новый маршрут
app.use('/api/device-self-tests', deviceSelfTestRoutes); // Новый маршрут

sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});

module.exports = app;
