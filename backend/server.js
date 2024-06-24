const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const zoneRoutes = require('./routes/zoneRoutes');
const employeeZoneRoutes = require('./routes/employeeZoneRoutes');
const departmentZoneRoutes = require('./routes/departmentZoneRoutes');
const movementRoutes = require('./routes/movementRoutes');
const userActionRoutes = require('./routes/userActionRoutes');
const mqttClient = require('./mqttClient');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

require('dotenv').config();
require('./websocketServer');

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/zones', zoneRoutes);
app.use('/api/employee-zones', employeeZoneRoutes);
app.use('/api/department-zones', departmentZoneRoutes);
app.use('/api/movements', movementRoutes);
app.use('/api/user-actions', userActionRoutes);

sequelize.sync().then(() => {
  server.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
