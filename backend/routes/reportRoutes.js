const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/generate', reportController.generateReport);
router.get('/generate-enterprise-summary', reportController.generateEnterpriseSummary);

module.exports = router;
