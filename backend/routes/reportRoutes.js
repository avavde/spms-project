const express = require('express');
const router = express.Router();
const { generateReport, getReports } = require('../controllers/reportController');

// Генерация отчета
router.post('/generate', async (req, res) => {
  try {
    const { reportType, parameters } = req.body;
    const report = await generateReport(reportType, parameters);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Получение всех отчетов
router.get('/', getReports);

module.exports = router;
