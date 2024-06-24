const express = require('express');
const employeeZoneController = require('../controllers/employeeZoneController');
const router = express.Router();

router.get('/', employeeZoneController.getAllEmployeeZones);
router.get('/:id', employeeZoneController.getEmployeeZoneById);
router.post('/', employeeZoneController.createEmployeeZone);
router.put('/:id', employeeZoneController.updateEmployeeZone);
router.delete('/:id', employeeZoneController.deleteEmployeeZone);

module.exports = router;
