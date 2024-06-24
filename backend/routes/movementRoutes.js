const express = require('express');
const movementController = require('../controllers/movementController');
const router = express.Router();

router.get('/', movementController.getAllMovements);
router.get('/:id', movementController.getMovementById);
router.post('/', movementController.createMovement);
router.put('/:id', movementController.updateMovement);
router.delete('/:id', movementController.deleteMovement);

module.exports = router;
