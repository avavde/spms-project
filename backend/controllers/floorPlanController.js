const { FloorPlan, Beacon } = require('../models');
const path = require('path');
const multer = require('multer');

// Настройка хранения файлов с помощью multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

exports.getAllFloorPlans = async (req, res) => {
  try {
    const floorPlans = await FloorPlan.findAll();
    console.log('All floor plans:', floorPlans); // Debug log
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
      console.error('Этаж не найден:', req.params.id); // Debug log
      return res.status(404).json({ error: 'Этаж не найден' });
    }
    console.log('Floor plan by ID:', floorPlan); // Debug log
    res.json(floorPlan);
  } catch (error) {
    console.error('Ошибка при получении этажа:', error);
    res.status(500).json({ error: 'Ошибка при получении этажа' });
  }
};

exports.createFloorPlan = async (req, res) => {
  upload.single('file')(req, res, async function (err) {
    if (err) {
      console.error('Ошибка загрузки файла:', err); // Debug log
      return res.status(500).json({ error: 'Ошибка загрузки файла' });
    }
    try {
      console.log('Uploaded file:', req.file); // Debug log
      console.log('Request body:', req.body); // Debug log
      const { building_id, name } = req.body;
      const file_url = `/uploads/${req.file.filename}`;
      const file_type = req.file.mimetype;

      const newFloorPlan = await FloorPlan.create({ building_id, name, file_url, file_type });
      console.log('New floor plan created:', newFloorPlan); // Debug log
      res.status(201).json(newFloorPlan);
    } catch (error) {
      console.error('Ошибка при создании этажа:', error);
      res.status(500).json({ error: 'Ошибка при создании этажа' });
    }
  });
};

exports.updateFloorPlan = async (req, res) => {
  upload.single('file')(req, res, async function (err) {
    if (err) {
      console.error('Ошибка загрузки файла:', err); // Debug log
      return res.status(500).json({ error: 'Ошибка загрузки файла' });
    }
    try {
      console.log('Uploaded file:', req.file); // Debug log
      console.log('Request body:', req.body); // Debug log
      const { building_id, name } = req.body;
      const floorPlan = await FloorPlan.findByPk(req.params.id);
      if (!floorPlan) {
        console.error('Этаж не найден:', req.params.id); // Debug log
        return res.status(404).json({ error: 'Этаж не найден' });
      }
      const file_url = req.file ? `/uploads/${req.file.filename}` : floorPlan.file_url;
      const file_type = req.file ? req.file.mimetype : floorPlan.file_type;

      await floorPlan.update({ building_id, name, file_url, file_type });
      console.log('Floor plan updated:', floorPlan); // Debug log
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
      console.error('Этаж не найден:', req.params.id); // Debug log
      return res.status(404).json({ error: 'Этаж не найден' });
    }
    await floorPlan.destroy();
    console.log('Floor plan deleted:', req.params.id); // Debug log
    res.status(204).send();
  } catch (error) {
    console.error('Ошибка при удалении этажа:', error);
    res.status(500).json({ error: 'Ошибка при удалении этажа' });
  }
};

exports.getBeaconsForFloorPlan = async (req, res) => {
  try {
    const beacons = await Beacon.findAll({ where: { floor_id: req.params.id } });
    console.log('Beacons for floor plan:', beacons); // Debug log
    res.json(beacons);
  } catch (error) {
    console.error('Ошибка при получении маяков для этажа:', error);
    res.status(500).json({ error: 'Ошибка при получении маяков для этажа' });
  }
};
