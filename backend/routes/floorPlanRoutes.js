const express = require('express');
const floorPlanController = require('../controllers/floorPlanController');

const router = express.Router();

router.post('/', floorPlanController.createFloorPlan);
router.get('/', floorPlanController.getFloorPlans);
router.get('/:id', floorPlanController.getFloorPlanById);
router.put('/:id', floorPlanController.updateFloorPlan);
router.delete('/:id', floorPlanController.deleteFloorPlan);

module.exports = router;
