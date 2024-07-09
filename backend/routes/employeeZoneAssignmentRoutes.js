const express = require('express');
const router = express.Router();
const employeeZoneAssignmentController = require('../controllers/employeeZoneAssignmentController');

router.get('/', employeeZoneAssignmentController.getAllAssignments);
router.get('/:id', employeeZoneAssignmentController.getAssignmentById);
router.get('/employee/:employeeId', employeeZoneAssignmentController.getAssignmentByEmployeeId); // Этот маршрут должен быть корректным
router.post('/', employeeZoneAssignmentController.createAssignment);
router.put('/:id', employeeZoneAssignmentController.updateAssignment);
router.delete('/:id', employeeZoneAssignmentController.deleteAssignment);

module.exports = router;
