const express = require('express');
const router = express.Router();
const deviceSelfTestController = require('../controllers/DeviceSelfTestController');

router.get('/', deviceSelfTestController.getAllDeviceSelfTests);
router.get('/:id', deviceSelfTestController.getDeviceSelfTest);

module.exports = router;
