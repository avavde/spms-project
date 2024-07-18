const express = require('express');
const buildingController = require('../controllers/buildingController');

const router = express.Router();

router.post('/', buildingController.createBuilding);
router.get('/', buildingController.getBuildings);
router.get('/:id', buildingController.getBuildingById);
router.put('/:id', buildingController.updateBuilding);
router.delete('/:id', buildingController.deleteBuilding);

module.exports = router;
