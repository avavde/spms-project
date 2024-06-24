const express = require('express');
const zoneController = require('../controllers/zoneController');
const router = express.Router();

router.get('/', zoneController.getAllZones);
router.get('/:id', zoneController.getZoneById);
router.post('/', zoneController.createZone);
router.put('/:id', zoneController.updateZone);
router.delete('/:id', zoneController.deleteZone);

module.exports = router;
