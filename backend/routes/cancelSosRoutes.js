// backend/routes/cancelSosRoutes.js

const express = require('express');
const router = express.Router();
const { cancelSosMessage } = require('../controllers/messageController');

router.post('/cancel-sos', cancelSosMessage);

module.exports = router;
