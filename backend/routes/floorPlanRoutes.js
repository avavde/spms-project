const express = require('express');
const router = express.Router();
const floorPlanController = require('../controllers/floorPlanController');

router.get('/', floorPlanController.getAllFloorPlans);
router.get('/:id', floorPlanController.getFloorPlanById);
router.post('/', floorPlanController.createFloorPlan);
router.post('/:id/image', floorPlanController.uploadFloorPlanImage);  // Новый маршрут для загрузки изображения
router.put('/:id', floorPlanController.updateFloorPlan);
router.delete('/:id', floorPlanController.deleteFloorPlan);
router.get('/unassigned', floorPlanController.getUnassignedFloorPlans);

module.exports = router;
