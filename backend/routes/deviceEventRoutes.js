const express = require('express');
const router = express.Router();
const deviceEventController = require('../controllers/DeviceEventController');

router.get('/', deviceEventController.getAllDeviceEvents);
router.get('/:id', deviceEventController.getDeviceEvent);

module.exports = router;
