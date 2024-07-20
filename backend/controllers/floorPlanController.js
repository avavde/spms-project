const { FloorPlan, Beacon, Building } = require('../models');
const path = require('path');
const multer = require('multer');

// Настройка хранения файлов с помощью multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Setting destination for file upload'); // Debug log
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    console.log('Setting filename for file upload'); // Debug log
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
  console.log('Handling createFloorPlan request'); // Debug log
  upload.single('file')(req, res, async function (err) {
    if (err) {
      console.error('Ошибка загрузки файла:', err); // Debug log
      return res.status(500).json({ error: 'Ошибка загрузки файла' });
    }
    try {
      console.log('Request body:', req.body); // Debug log
      console.log('Uploaded file:', req.file); // Debug log

      const { building_id, name } = req.body;
      if (!building_id || !name || !req.file) {
        console.error('Missing required fields'); // Debug log
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const file_url = `/uploads/${req.file.filename}`;
      const file_type = req.file.mimetype;

      const newFloorPlan = await FloorPlan.create({ building_id, name, file_url, file_type });
      console.log('Created floor plan:', newFloorPlan); // Debug log
      res.status(201).json(newFloorPlan);
    } catch (error) {
      console.error('Ошибка при создании этажа:', error);
      res.status(500).json({ error: 'Ошибка при создании этажа' });
    }
  });
};

exports.updateFloorPlan = async (req, res) => {
  console.log('Handling updateFloorPlan request'); // Debug log
  upload.single('file')(req, res, async function (err) {
    if (err) {
      console.error('Ошибка загрузки файла:', err); // Debug log
      return res.status(500).json({ error: 'Ошибка загрузки файла' });
    }
    try {
      console.log('Request body:', req.body); // Debug log
      console.log('Uploaded file:', req.file); // Debug log

      const { building_id, name } = req.body;
      const floorPlan = await FloorPlan.findByPk(req.params.id);
      if (!floorPlan) {
        console.error('Этаж не найден'); // Debug log
        return res.status(404).json({ error: 'Этаж не найден' });
      }
      const file_url = req.file ? `/uploads/${req.file.filename}` : floorPlan.file_url;
      const file_type = req.file ? req.file.mimetype : floorPlan.file_type;

      await floorPlan.update({ building_id, name, file_url, file_type });
      console.log('Updated floor plan:', floorPlan); // Debug log
      res.json(floorPlan);
    } catch (error) {
      console.error('Ошибка при обновлении этажа:', error);
      res.status(500).json({ error: 'Ошибка при обновлении этажа' });
    }
  });
};

exports.deleteFloorPlan = async (req, res) => {
  try {
    console.log('Handling deleteFloorPlan request'); // Debug log
    const floorPlan = await FloorPlan.findByPk(req.params.id);
    if (!floorPlan) {
      console.error('Этаж не найден'); // Debug log
      return res.status(404).json({ error: 'Этаж не найден' });
    }
    await floorPlan.destroy();
    console.log('Deleted floor plan:', floorPlan); // Debug log
    res.status(204).send();
  } catch (error) {
    console.error('Ошибка при удалении этажа:', error);
    res.status(500).json({ error: 'Ошибка при удалении этажа' });
  }
};

exports.getBeaconsForFloorPlan = async (req, res) => {
  try {
    console.log('Handling getBeaconsForFloorPlan request'); // Debug log
    const beacons = await Beacon.findAll({ where: { floor_id: req.params.id } });
    console.log('Beacons for floor plan:', beacons); // Debug log
    res.json(beacons);
  } catch (error) {
    console.error('Ошибка при получении маяков для этажа:', error);
    res.status(500).json({ error: 'Ошибка при получении маяков для этажа' });
  }
};

exports.getUnassignedFloorPlans = async (req, res) => {
  try {
    const unassignedFloorPlans = await FloorPlan.findAll({
      where: {
        building_id: null
      }
    });
    console.log('Unassigned floor plans:', unassignedFloorPlans); // Debug log
    res.json(unassignedFloorPlans);
  } catch (error) {
    console.error('Ошибка при получении незакрепленных этажей:', error);
    res.status(500).json({ error: 'Ошибка при получении незакрепленных этажей' });
  }
};
