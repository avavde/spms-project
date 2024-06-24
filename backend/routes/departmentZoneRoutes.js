const express = require('express');
const departmentZoneController = require('../controllers/departmentZoneController');
const router = express.Router();

router.get('/', departmentZoneController.getAllDepartmentZones);
router.get('/:id', departmentZoneController.getDepartmentZoneById);
router.post('/', departmentZoneController.createDepartmentZone);
router.put('/:id', departmentZoneController.updateDepartmentZone);
router.delete('/:id', departmentZoneController.deleteDepartmentZone);

module.exports = router;
