const express = require('express');
const employeeController = require('../controllers/employeeController');
const router = express.Router();

// Маршрут для получения всех сотрудников
router.get('/', employeeController.getAllEmployees);

// Маршрут для получения сотрудника по ID
router.get('/:id', employeeController.getEmployeeById);

// Маршрут для создания нового сотрудника
router.post('/', employeeController.createEmployee);

// Маршрут для обновления сотрудника по ID
router.put('/:id', employeeController.updateEmployee);

// Маршрут для удаления сотрудника по ID
router.delete('/:id', employeeController.deleteEmployee);

// Маршрут для назначения метки сотруднику
router.put('/:id/assign-beacon', employeeController.assignBeacon);

// Маршрут для отображения позиции сотрудника
router.get('/:id/location', employeeController.getEmployeeLocation);

module.exports = router;
