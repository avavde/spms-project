const express = require('express');
const router = express.Router();
const deviceZoneController = require('../controllers/deviceZoneController');

router.post('/', deviceZoneController.createDeviceZonePosition);
router.get('/', deviceZoneController.getAllDeviceZonePositions);
router.get('/:id', deviceZoneController.getDeviceZonePositionById);
router.put('/:id', deviceZoneController.updateDeviceZonePosition);
router.delete('/:id', deviceZoneController.deleteDeviceZonePosition);

module.exports = router;
