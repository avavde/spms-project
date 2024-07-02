const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');

// Сначала добавляем более специфичные маршруты
router.get('/available/beacons', deviceController.getAvailableBeacons);  // Новый маршрут
router.get('/available/badges', deviceController.getAvailableBadges);    // Существующий маршрут

// Затем добавляем остальные маршруты
router.get('/', deviceController.getAllDevices);
router.get('/:id', deviceController.getDeviceById);
router.post('/', deviceController.createDevice);
router.put('/:id', deviceController.updateDevice);
router.delete('/:id', deviceController.deleteDevice);

module.exports = router;
