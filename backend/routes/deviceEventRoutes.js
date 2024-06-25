const express = require('express');
const router = express.Router();
const deviceEventController = require('../controllers/deviceEventController');

router.get('/', deviceEventController.getAllDeviceEvents);
router.get('/:id', deviceEventController.getDeviceEvent);

module.exports = router;
