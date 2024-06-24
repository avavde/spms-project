const express = require('express');
const userActionController = require('../controllers/userActionController');
const router = express.Router();

router.get('/', userActionController.getAllUserActions);
router.get('/:id', userActionController.getUserActionById);
router.post('/', userActionController.createUserAction);
router.put('/:id', userActionController.updateUserAction);
router.delete('/:id', userActionController.deleteUserAction);

module.exports = router;
