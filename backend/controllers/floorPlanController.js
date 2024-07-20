// controllers/floorPlanController.js
const { FloorPlan, Building } = require('../models');
const path = require('path');
const multer = require('multer');

// Настройка хранения файлов с помощью multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Setting destination for file upload');
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    console.log('Setting filename for file upload');
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

exports.getAllFloorPlans = async (req, res) => {
  try {
    const floorPlans = await FloorPlan.findAll();
    res.json(floorPlans);
  } catch (error) {
    console.error('Ошибка при получении этажей:', error);
    res.status(500).json({ error: 'Ошибка при получении этажей' });
  }
};

exports.getFloorPlanById = async (req, res) => {
  try {
    const floorPlan = await FloorPlan.findByPk(req.params.id);
    if (!floorPlan) {
      return res.status(404).json({ error: 'Этаж не найден' });
    }
    res.json(floorPlan);
  } catch (error) {
    console.error('Ошибка при получении этажа:', error);
    res.status(500).json({ error: 'Ошибка при получении этажа' });
  }
};

exports.createFloorPlan = async (req, res) => {
  console.log('Handling createFloorPlan request');
  upload.single('file')(req, res, async function (err) {
    if (err) {
      console.error('Ошибка загрузки файла:', err);
      return res.status(500).json({ error: 'Ошибка загрузки файла' });
    }
    try {
      const { building_id, name } = req.body;
      const file_url = `/uploads/${req.file.filename}`;
      const file_type = req.file.mimetype;

      const newFloorPlan = await FloorPlan.create({ building_id, name, file_url, file_type });
      res.status(201).json(newFloorPlan);
    } catch (error) {
      console.error('Ошибка при создании этажа:', error);
      res.status(500).json({ error: 'Ошибка при создании этажа' });
    }
  });
};

exports.updateFloorPlan = async (req, res) => {
  console.log('Handling updateFloorPlan request');
  upload.single('file')(req, res, async function (err) {
    if (err) {
      console.error('Ошибка загрузки файла:', err);
      return res.status(500).json({ error: 'Ошибка загрузки файла' });
    }
    try {
      const { building_id, name } = req.body;
      const floorPlan = await FloorPlan.findByPk(req.params.id);
      if (!floorPlan) {
        return res.status(404).json({ error: 'Этаж не найден' });
      }
      const file_url = req.file ? `/uploads/${req.file.filename}` : floorPlan.file_url;
      const file_type = req.file ? req.file.mimetype : floorPlan.file_type;

      await floorPlan.update({ building_id, name, file_url, file_type });
      res.json(floorPlan);
    } catch (error) {
      console.error('Ошибка при обновлении этажа:', error);
      res.status(500).json({ error: 'Ошибка при обновлении этажа' });
    }
  });
};

exports.deleteFloorPlan = async (req, res) => {
  try {
    const floorPlan = await FloorPlan.findByPk(req.params.id);
    if (!floorPlan) {
      return res.status(404).json({ error: 'Этаж не найден' });
    }
    await floorPlan.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Ошибка при удалении этажа:', error);
    res.status(500).json({ error: 'Ошибка при удалении этажа' });
  }
};

exports.getUnassignedFloorPlans = async (req, res) => {
  try {
    const floorPlans = await FloorPlan.findAll({
      where: {
        building_id: null
      }
    });
    res.json(floorPlans);
  } catch (error) {
    console.error('Ошибка при получении независящих планов этажей:', error);
    res.status(500).json({ error: 'Ошибка при получении независящих планов этажей' });
  }
};
