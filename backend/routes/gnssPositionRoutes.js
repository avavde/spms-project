const express = require('express');
const router = express.Router();
const gnssPositionController = require('../controllers/gnssPositionController');

router.get('/', gnssPositionController.getAllGNSSPositions);
router.get('/:id', gnssPositionController.getGNSSPositionById);
router.post('/', gnssPositionController.createGNSSPosition);
router.put('/:id', gnssPositionController.updateGNSSPosition);
router.delete('/:id', gnssPositionController.deleteGNSSPosition);

module.exports = router;
