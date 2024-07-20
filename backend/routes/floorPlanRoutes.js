// routes/floorPlanRoutes.js
const express = require('express');
const router = express.Router();
const floorPlanController = require('../controllers/floorPlanController');

router.get('/', floorPlanController.getAllFloorPlans);
router.get('/:id', floorPlanController.getFloorPlanById);
router.post('/', floorPlanController.createFloorPlan);
router.put('/:id', floorPlanController.updateFloorPlan);
router.delete('/:id', floorPlanController.deleteFloorPlan);
router.get('/unassigned', floorPlanController.getUnassignedFloorPlans);

module.exports = router;
