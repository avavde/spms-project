const express = require('express');
const router = express.Router();
const buildingController = require('../controllers/buildingController');

// Убедитесь, что все маршруты принимают функции обратного вызова
router.get('/', buildingController.getAllBuildings);
router.get('/:id', buildingController.getBuildingById);
router.post('/', buildingController.createBuilding);
router.put('/:id', buildingController.updateBuilding);
router.delete('/:id', buildingController.deleteBuilding);
router.get('/:id/floors', buildingController.getFloorsForBuilding);

module.exports = router;
