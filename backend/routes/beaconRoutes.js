const express = require('express');
const beaconController = require('../controllers/beaconController');
const router = express.Router();

router.get('/available', beaconController.getAvailableBeacons);

module.exports = router;
