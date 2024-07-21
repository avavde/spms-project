// routes/beaconRoutes.js

const express = require('express');
const router = express.Router();
const beaconController = require('../controllers/beaconController');

router.get('/available/beacons', beaconController.getAvailableBeacons);
router.put('/:beacon_mac', beaconController.updateBeaconCoordinates);
router.delete('/:beacon_mac', beaconController.deleteBeacon);
router.get('/ids', beaconController.getBeaconIdsByMacs);
router.get('/', beaconController.getAllBeacons);

module.exports = router;
