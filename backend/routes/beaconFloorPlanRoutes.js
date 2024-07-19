const express = require('express');
const beaconFloorPlanController = require('../controllers/beaconFloorPlanController');

const router = express.Router();

router.post('/', beaconFloorPlanController.createBeaconFloorPlan);
router.get('/', beaconFloorPlanController.getAllBeaconFloorPlans); // Исправлено
router.get('/:id', beaconFloorPlanController.getBeaconFloorPlanById);
router.put('/:id', beaconFloorPlanController.updateBeaconFloorPlan);
router.delete('/:id', beaconFloorPlanController.deleteBeaconFloorPlan);

module.exports = router;
