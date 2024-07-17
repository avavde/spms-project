const express = require('express');
const router = express.Router();
const deviceStatusController = require('../controllers/DeviceStatusController');

router.get('/', deviceStatusController.getAllDeviceStatuses);
router.get('/:id', deviceStatusController.getDeviceStatus);

module.exports = router;
