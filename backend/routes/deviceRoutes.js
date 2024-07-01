const express = require('express');
const deviceController = require('../controllers/deviceController');
const router = express.Router();

router.get('/', deviceController.getAllDevices);
router.get('/:id', deviceController.getDeviceById);
router.post('/', deviceController.createDevice);
router.put('/:id', deviceController.updateDevice);
router.delete('/:id', deviceController.deleteDevice);
router.get('/available/beacons', deviceController.getAvailableBeacons);

module.exports = router;
