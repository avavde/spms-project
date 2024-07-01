const express = require('express');
const departmentController = require('../controllers/departmentController');
const router = express.Router();

// Маршрут для получения всех отделов
router.get('/', departmentController.getAllDepartments);

// Маршрут для получения отдела по ID
router.get('/:id', departmentController.getDepartmentById);

// Маршрут для создания нового отдела
router.post('/', departmentController.createDepartment);

// Маршрут для обновления отдела по ID
router.put('/:id', departmentController.updateDepartment);

// Маршрут для удаления отдела по ID
router.delete('/:id', departmentController.deleteDepartment);

module.exports = router;
